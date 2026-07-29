---
layout: cv
permalink: /cv/
title: "Ziwei Liu CV"
author_profile: false
---

<header class="cv-header">
  <div class="cv-header-left">
    <h1>Ziwei Liu</h1>
    <p class="cv-contact">
      School of Data Science, City University of Hong Kong &middot; Hong Kong, China
    </p>
    <p class="cv-contact">
      <a href="mailto:lziwei2-c@my.cityu.edu.hk">lziwei2-c@my.cityu.edu.hk</a>
    </p>
    <p class="cv-contact">
      <a href="https://ziwliu8.github.io">ziwliu8.github.io</a> &middot;
      <a href="https://github.com/ziwliu8">GitHub</a> &middot;
      <a href="https://scholar.google.com/citations?user=_H3nmDQAAAAJ">Google Scholar</a> &middot;
      <a href="https://www.researchgate.net/?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6Il9kaXJlY3QiLCJwYWdlIjoibG9naW4ifX0%3D">ResearchGate</a>
    </p>
    <p class="cv-summary">
      Ph.D. student in the AML Lab at the School of Data Science, City University of Hong Kong.
      My research focuses on Recommender Systems, Information Retrieval, and Large Language Models,
      with papers published or preprinted at top international AI conferences.
    </p>
  </div>
  <div class="cv-header-photo">
    <img src="{{ '/images/android-chrome-512x512.png' | relative_url }}" alt="Ziwei Liu">
  </div>
</header>

<section class="cv-section">
  <h2>Education</h2>
  {% for education in site.data.profile.education %}
  <div class="cv-item">
    <div>
      <h3>{{ education.institution }}</h3>
      <p>{{ education.degree }}{% if education.details %}. {{ education.details }}{% endif %}</p>
    </div>
    <div class="cv-date">{{ education.date }}</div>
  </div>
  {% endfor %}
</section>

<section class="cv-section">
  <h2>Research Experience</h2>
  {% for experience in site.data.profile.experience %}
  <div class="cv-item">
    <div>
      <h3>{{ experience.institution }}</h3>
      <p>{{ experience.role }}</p>
    </div>
    <div class="cv-date">{{ experience.date }}</div>
  </div>
  {% endfor %}
</section>

<section class="cv-section">
  <h2>Publications & Preprints</h2>
  {% for publication in site.data.profile.publications %}
  <div class="cv-publication">
    <h3><a href="{{ publication.paper_url }}">{{ publication.title }}</a>{% if publication.short_name %} ({{ publication.short_name }}){% endif %}</h3>
    <p>{% for publication_author in publication.authors %}{% if publication_author.me %}<strong>{% endif %}{{ publication_author.name }}{% if publication_author.equal %}<sup>*</sup>{% endif %}{% if publication_author.me %}</strong>{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
    <p>{{ publication.venue }}</p>
    <ul>
      <li>{{ publication.tldr }}</li>
    </ul>
  </div>
  {% endfor %}
</section>

<section class="cv-section">
  <h2>Tutorials</h2>
  <ul>
    {% for tutorial in site.data.profile.tutorials %}
    <li><strong>{{ tutorial.venue }}:</strong> {{ tutorial.title }}. <a href="{{ tutorial.url }}">Project page</a>. {{ tutorial.date }}.</li>
    {% endfor %}
  </ul>
</section>

<section class="cv-section">
  <h2>Honors and Awards</h2>
  <ul>
    {% for honor in site.data.profile.honors %}
    <li>{{ honor.title }}, {{ honor.date }}.</li>
    {% endfor %}
  </ul>
</section>

<section class="cv-section">
  <h2>Academic Service</h2>
  {% for service_group in site.data.profile.service %}
  <h3>{{ service_group.category }}</h3>
  <ul>
    {% for item in service_group.items %}
    <li>{{ item }}</li>
    {% endfor %}
  </ul>
  {% endfor %}
</section>
