import argparse
import json
import os
import random
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup


SCHOLAR_ID = os.environ["GOOGLE_SCHOLAR_ID"]
PROFILE_PATH = "/citations"
HOSTS = (
    "https://scholar.google.com",
    "https://scholar.google.com.hk",
)
USER_AGENTS = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
)
BLOCK_MARKERS = (
    "unusual traffic",
    "not a robot",
    "automated queries",
    "before you continue",
    "consent.google.com",
    "sorry...",
)
SUCCESS_EXIT = 0
STALE_EXIT = 2
FAIL_EXIT = 1


def as_int(value) -> int:
    digits = "".join(character for character in str(value or "") if character.isdigit())
    return int(digits) if digits else 0


def browser_headers() -> dict:
    user_agent = random.choice(USER_AGENTS)
    return {
        "User-Agent": user_agent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Upgrade-Insecure-Requests": "1",
        "Referer": "https://scholar.google.com/",
    }


def scholar_cookies() -> dict:
    return {
        "CONSENT": "YES+",
        "SOCS": "CAISNQgDEitib3FfaWRlbnRpdHlmcm9udGVuZHVpc2VydmVyXzIwMjQwNTI4LjA1X3AxGgJlbiACGgYIgL-_vwY",
        "GSP": "ID=abc:CF=4",
    }


def profile_params() -> dict:
    return {
        "user": SCHOLAR_ID,
        "hl": "en",
        "pagesize": 100,
        "view_op": "list_works",
    }


def is_blocked_html(html: str) -> bool:
    lowered = html.lower()
    return any(marker in lowered for marker in BLOCK_MARKERS)


def parse_profile_html(html: str, source: str) -> dict:
    if is_blocked_html(html) or "gsc_a_tr" not in html or "gsc_prf_in" not in html:
        raise RuntimeError("Google Scholar returned a consent or bot-check page")

    soup = BeautifulSoup(html, "html.parser")
    name_node = soup.select_one("#gsc_prf_in")
    metric_rows = soup.select("#gsc_rsb_st tbody tr")
    metrics = [
        [as_int(cell.get_text(" ", strip=True)) for cell in row.select("td.gsc_rsb_std")]
        for row in metric_rows
    ]
    if name_node is None or not metrics or not metrics[0]:
        raise RuntimeError("Citation metrics were missing from the profile")

    publications = {}
    for row in soup.select(".gsc_a_tr"):
        title_link = row.select_one(".gsc_a_at")
        if title_link is None:
            continue
        publication_id = parse_qs(urlparse(title_link.get("href", "")).query).get(
            "citation_for_view", [None]
        )[0]
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
        "name": name_node.get_text(" ", strip=True),
        "citedby": metrics[0][0],
        "citedby5y": metrics[0][1] if len(metrics[0]) > 1 else None,
        "hindex": metrics[1][0] if len(metrics) > 1 else None,
        "hindex5y": metrics[1][1] if len(metrics) > 1 and len(metrics[1]) > 1 else None,
        "i10index": metrics[2][0] if len(metrics) > 2 else None,
        "i10index5y": metrics[2][1] if len(metrics) > 2 and len(metrics[2]) > 1 else None,
        "publications": publications,
        "updated": datetime.now(timezone.utc).isoformat(),
        "source": source,
    }


def fetch_html_with_requests(url: str) -> str:
    response = requests.get(
        url,
        params=profile_params(),
        headers=browser_headers(),
        cookies=scholar_cookies(),
        timeout=(5, 12),
        allow_redirects=True,
    )
    response.raise_for_status()
    return response.text


def fetch_html_with_curl_cffi(url: str) -> str:
    from curl_cffi import requests as cffi_requests

    response = cffi_requests.get(
        url,
        params=profile_params(),
        headers=browser_headers(),
        cookies=scholar_cookies(),
        timeout=15,
        impersonate="chrome131",
        allow_redirects=True,
    )
    response.raise_for_status()
    return response.text


def fetch_profile_from_hosts(fetcher, source: str) -> dict:
    last_error = None
    for host in HOSTS:
        try:
            html = fetcher(host + PROFILE_PATH)
            return parse_profile_html(html, source)
        except Exception as error:  # Host-specific blocks should not abort the rest.
            last_error = error
            time.sleep(random.uniform(0.4, 1.2))
    raise RuntimeError(f"{source} failed: {last_error}")


def fetch_profile_direct() -> dict:
    return fetch_profile_from_hosts(fetch_html_with_requests, "GOOGLE_SCHOLAR_PROFILE_HTML")


def fetch_profile_curl_cffi() -> dict:
    return fetch_profile_from_hosts(fetch_html_with_curl_cffi, "CURL_CFFI")


def fetch_profile_serpapi() -> dict:
    api_key = os.environ.get("SERPAPI_KEY", "").strip()
    if not api_key:
        raise RuntimeError("SERPAPI_KEY is not set")

    response = requests.get(
        "https://serpapi.com/search.json",
        params={
            "engine": "google_scholar_author",
            "author_id": SCHOLAR_ID,
            "hl": "en",
            "num": 100,
            "api_key": api_key,
        },
        timeout=(8, 30),
    )
    response.raise_for_status()
    payload = response.json()
    if payload.get("error"):
        raise RuntimeError(payload["error"])

    cited_by = payload.get("cited_by", {}).get("table") or []
    if not cited_by:
        raise RuntimeError("SerpAPI response did not include citation metrics")

    def metric_pair(index: int):
        if index >= len(cited_by):
            return None, None
        values = next(iter(cited_by[index].values()))
        return values.get("all"), values.get("since_2021") or next(
            (value for key, value in values.items() if key != "all"),
            None,
        )

    citedby, citedby5y = metric_pair(0)
    hindex, hindex5y = metric_pair(1)
    i10index, i10index5y = metric_pair(2)
    publications = {}
    for article in payload.get("articles") or []:
        publication_id = article.get("citation_id")
        if not publication_id:
            continue
        publications[publication_id] = {
            "author_pub_id": publication_id,
            "bib": {
                "title": article.get("title") or "",
                "pub_year": str(article.get("year") or ""),
            },
            "num_citations": as_int((article.get("cited_by") or {}).get("value")),
            "filled": False,
        }

    author = payload.get("author") or {}
    return {
        "scholar_id": SCHOLAR_ID,
        "name": author.get("name") or "Ziwei Liu",
        "citedby": as_int(citedby),
        "citedby5y": as_int(citedby5y) if citedby5y is not None else None,
        "hindex": as_int(hindex) if hindex is not None else None,
        "hindex5y": as_int(hindex5y) if hindex5y is not None else None,
        "i10index": as_int(i10index) if i10index is not None else None,
        "i10index5y": as_int(i10index5y) if i10index5y is not None else None,
        "publications": publications,
        "updated": datetime.now(timezone.utc).isoformat(),
        "source": "SERPAPI",
    }


def fetch_profile_playwright() -> dict:
    from playwright.sync_api import sync_playwright

    last_error = None
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ],
        )
        try:
            context = browser.new_context(
                user_agent=USER_AGENTS[0],
                locale="en-US",
                extra_http_headers={"Accept-Language": "en-US,en;q=0.9"},
            )
            context.add_cookies(
                [
                    {"name": name, "value": value, "domain": ".google.com", "path": "/"}
                    for name, value in scholar_cookies().items()
                ]
            )
            context.add_init_script(
                "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
            )
            page = context.new_page()
            for host in HOSTS[:2]:
                url = (
                    f"{host}{PROFILE_PATH}?user={SCHOLAR_ID}"
                    "&hl=en&pagesize=100&view_op=list_works"
                )
                try:
                    page.goto(url, wait_until="domcontentloaded", timeout=25000)
                    page.wait_for_selector("#gsc_rsb_st td.gsc_rsb_std", timeout=20000)
                    return parse_profile_html(page.content(), "PLAYWRIGHT")
                except Exception as error:
                    last_error = error
        finally:
            browser.close()
    raise RuntimeError(f"Playwright fetch failed: {last_error}")


def run_with_timeout(fetcher, timeout_seconds: int):
    with ThreadPoolExecutor(max_workers=1) as pool:
        future = pool.submit(fetcher)
        return future.result(timeout=timeout_seconds)


def load_previous_profile() -> dict | None:
    candidates = [
        os.environ.get("PREVIOUS_STATS_PATH"),
        "previous/gs_data.json",
        "results/gs_data.json",
    ]
    for candidate in candidates:
        if not candidate:
            continue
        path = Path(candidate)
        if not path.is_file():
            continue
        try:
            with path.open(encoding="utf-8") as infile:
                previous = json.load(infile)
            if isinstance(previous.get("citedby"), int):
                return previous
        except (OSError, json.JSONDecodeError, TypeError):
            continue
    return None


def merge_profiles(current: dict, previous: dict | None) -> dict:
    if previous is None:
        return current

    merged = dict(current)
    merged["citedby"] = max(as_int(current.get("citedby")), as_int(previous.get("citedby")))
    publications = dict(previous.get("publications") or {})
    for publication_id, publication in (current.get("publications") or {}).items():
        previous_publication = publications.get(publication_id) or {}
        merged_publication = dict(publication)
        merged_publication["num_citations"] = max(
            as_int(publication.get("num_citations")),
            as_int(previous_publication.get("num_citations")),
        )
        publications[publication_id] = merged_publication
    merged["publications"] = publications
    return merged


def validate_profile(author: dict) -> None:
    if not isinstance(author.get("citedby"), int):
        raise ValueError("Google Scholar response did not contain an integer citedby value")
    if author.get("scholar_id") not in (None, SCHOLAR_ID):
        raise ValueError("Google Scholar returned a different author profile")


def write_results(author: dict) -> None:
    validate_profile(author)
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


def http_backends():
    backends = []
    if os.environ.get("SERPAPI_KEY", "").strip():
        backends.append(("serpapi", fetch_profile_serpapi, 25))
    backends.extend(
        [
            ("direct", fetch_profile_direct, 25),
            ("curl_cffi", fetch_profile_curl_cffi, 25),
        ]
    )
    return backends


def browser_backends():
    return [
        ("playwright", fetch_profile_playwright, 50),
    ]


def fetch_profile(use_browser: bool) -> dict:
    errors = []
    backends = browser_backends() if use_browser else http_backends()

    for name, fetcher, timeout_seconds in backends:
        try:
            if name == "playwright":
                profile = fetcher()
            else:
                profile = run_with_timeout(fetcher, timeout_seconds)
            validate_profile(profile)
            print(
                f"Fetched {profile['citedby']} citations and "
                f"{len(profile.get('publications', {}))} publications via {profile['source']}",
                flush=True,
            )
            return profile
        except Exception as error:
            message = f"{name}: {error}"
            errors.append(message)
            print(message, flush=True)
    raise RuntimeError("All Google Scholar backends failed: " + " | ".join(errors))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--browser",
        action="store_true",
        help="Try Playwright after HTTP backends were blocked.",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    previous = load_previous_profile()
    try:
        profile = merge_profiles(fetch_profile(use_browser=args.browser), previous)
        write_results(profile)
        sys.exit(SUCCESS_EXIT)
    except Exception as error:
        print(f"Fresh Google Scholar fetch failed: {error}", flush=True)
        if previous is None:
            sys.exit(FAIL_EXIT)
        previous = dict(previous)
        previous["source"] = "PREVIOUS"
        write_results(previous)
        print(
            f"Reusing previous citation snapshot with {previous['citedby']} citations",
            flush=True,
        )
        sys.exit(STALE_EXIT)
