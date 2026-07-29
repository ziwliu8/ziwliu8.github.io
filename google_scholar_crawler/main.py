import os
import json
import random
import time
from datetime import datetime, timezone
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup
from scholarly import scholarly


SCHOLAR_ID = os.environ["GOOGLE_SCHOLAR_ID"]
PROFILE_URL = "https://scholar.google.com/citations"
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
]


def as_int(value: str) -> int:
    digits = "".join(character for character in value if character.isdigit())
    return int(digits) if digits else 0


def fetch_profile_direct() -> dict:
    """Fetch the public profile HTML without relying on scholarly internals."""
    last_error = None
    for attempt in range(3):
        try:
            response = requests.get(
                PROFILE_URL,
                params={
                    "user": SCHOLAR_ID,
                    "hl": "en",
                    "pagesize": 100,
                    "view_op": "list_works",
                    "sortby": "pubdate",
                },
                headers={
                    "User-Agent": random.choice(USER_AGENTS),
                    "Accept-Language": "en-US,en;q=0.9",
                },
                timeout=(10, 30),
            )
            response.raise_for_status()
            if "gsc_a_tr" not in response.text or "gsc_prf_in" not in response.text:
                raise RuntimeError("Google Scholar returned a consent or bot-check page")

            soup = BeautifulSoup(response.text, "html.parser")
            metric_rows = soup.select("#gsc_rsb_st tbody tr")
            metrics = [
                [as_int(cell.get_text(" ", strip=True)) for cell in row.select("td.gsc_rsb_std")]
                for row in metric_rows
            ]
            if not metrics or not metrics[0]:
                raise RuntimeError("Citation metrics were missing from the profile")

            publications = {}
            for row in soup.select(".gsc_a_tr"):
                title_link = row.select_one(".gsc_a_at")
                if title_link is None:
                    continue
                publication_id = parse_qs(
                    urlparse(title_link.get("href", "")).query
                ).get("citation_for_view", [None])[0]
                if not publication_id:
                    continue
                citation_cell = row.select_one(".gsc_a_c")
                year_cell = row.select_one(".gsc_a_y")
                publications[publication_id] = {
                    "author_pub_id": publication_id,
                    "bib": {
                        "title": title_link.get_text(" ", strip=True),
                        "pub_year": year_cell.get_text(" ", strip=True) if year_cell else "",
                    },
                    "num_citations": as_int(
                        citation_cell.get_text(" ", strip=True) if citation_cell else ""
                    ),
                    "filled": False,
                }

            return {
                "scholar_id": SCHOLAR_ID,
                "name": soup.select_one("#gsc_prf_in").get_text(" ", strip=True),
                "citedby": metrics[0][0],
                "citedby5y": metrics[0][1] if len(metrics[0]) > 1 else None,
                "hindex": metrics[1][0] if len(metrics) > 1 else None,
                "hindex5y": metrics[1][1] if len(metrics) > 1 and len(metrics[1]) > 1 else None,
                "i10index": metrics[2][0] if len(metrics) > 2 else None,
                "i10index5y": metrics[2][1] if len(metrics) > 2 and len(metrics[2]) > 1 else None,
                "publications": publications,
                "updated": datetime.now(timezone.utc).isoformat(),
                "source": "GOOGLE_SCHOLAR_PROFILE_HTML",
            }
        except (requests.RequestException, RuntimeError, AttributeError) as error:
            last_error = error
            if attempt < 2:
                time.sleep(15 * (attempt + 1) + random.uniform(1, 8))
    raise RuntimeError(f"Direct Google Scholar fetch failed: {last_error}")


def fetch_profile_with_scholarly() -> dict:
    """Fallback for profile-page markup changes."""
    author = scholarly.search_author_id(SCHOLAR_ID)
    scholarly.fill(author, sections=["basics", "indices", "counts", "publications"])
    author["updated"] = datetime.now(timezone.utc).isoformat()
    author["publications"] = {
        publication["author_pub_id"]: publication
        for publication in author["publications"]
    }
    author["source"] = "SCHOLARLY"
    return author


def fetch_profile() -> dict:
    errors = []
    for fetcher in (fetch_profile_direct, fetch_profile_with_scholarly):
        try:
            return fetcher()
        except Exception as error:  # Keep the second independent backend available.
            errors.append(f"{fetcher.__name__}: {error}")
            print(errors[-1], flush=True)
    raise RuntimeError("All Google Scholar backends failed: " + " | ".join(errors))


def write_results(author: dict) -> None:
    if not isinstance(author.get("citedby"), int):
        raise ValueError("Google Scholar response did not contain an integer citedby value")
    if author.get("scholar_id") not in (None, SCHOLAR_ID):
        raise ValueError("Google Scholar returned a different author profile")

    os.makedirs("results", exist_ok=True)
    with open("results/gs_data.json", "w", encoding="utf-8") as outfile:
        json.dump(author, outfile, ensure_ascii=False, indent=2)
        outfile.write("\n")

    shields_io_data = {
        "schemaVersion": 1,
        "label": "citations",
        "message": str(author["citedby"]),
    }
    with open("results/gs_data_shieldsio.json", "w", encoding="utf-8") as outfile:
        json.dump(shields_io_data, outfile, ensure_ascii=False, indent=2)
        outfile.write("\n")


if __name__ == "__main__":
    profile = fetch_profile()
    print(
        f"Fetched {profile['citedby']} citations and "
        f"{len(profile.get('publications', {}))} publications via {profile['source']}"
    )
    write_results(profile)
