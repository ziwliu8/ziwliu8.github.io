---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<span class='anchor' id='about-me'></span>

Currently, I am a first-year Ph.D. student in the *AML Lab* at ***City University of Hong Kong***, supervised by <a href='https://aml-cityu.github.io/'>Prof. Zhao Xiangyu</a>. Before this, I earned my Bachelor's degree in Robotics Engineering from Southeast University, where <a href='https://automation.seu.edu.cn/gyh/list.htm'><strong><em>Prof. Gan Yahui</em></strong></a> and <a href='https://automation.seu.edu.cn/lj/list.htm'><strong><em>Prof. Li Jun</em></strong></a> co-supervised me.

My research interests include Recommender Systems, Information Retrieval, and Large Language Models. I have published several papers at top international AI conferences, with <a href='https://scholar.google.com/citations?user=_H3nmDQAAAAJ&hl=zh-CN'><span id="total_cit" aria-live="polite">97</span> total Google Scholar citations</a>.

# 🔥 News
<p class="news-scroll-hint">Latest updates · scroll for earlier news ↓</p>
<div class="news-scroll-shell">
  <div class="news-list" role="region" aria-label="Latest news; scroll for earlier updates" tabindex="0">
    <ul>
      {% for item in site.data.profile.news %}
      <li><time datetime="{{ item.date }}">{{ item.display_date }}</time><span>{{ item.text_html }}</span></li>
      {% endfor %}
    </ul>
  </div>
</div>

# 📝 First/Co-first Author Publications

<div class="publication-list">
  {% for publication in site.data.profile.publications %}
  <article class="publication-card">
    <figure class="publication-figure">
      <img src="{{ publication.image }}" alt="{{ publication.image_alt }}" loading="lazy">
      <figcaption>{{ publication.caption }}</figcaption>
    </figure>
    <div class="publication-content">
      <h3 class="publication-title">{{ publication.title }}</h3>
      <p class="publication-authors">{% for publication_author in publication.authors %}{% if publication_author.me %}<strong>{% endif %}{{ publication_author.name }}{% if publication_author.equal %}<sup>*</sup>{% endif %}{% if publication_author.me %}</strong>{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}</p>
      <p class="publication-venue">{{ publication.venue_html }}</p>
      <div class="publication-links">
        <a href="{{ publication.paper_url }}" target="_blank" rel="noopener">Paper</a>
        {% if publication.code_url %}
        <a href="{{ publication.code_url }}" target="_blank" rel="noopener">Code</a>
        {% elsif publication.code_pending %}
        <span class="publication-link-disabled" title="Code will be released publicly">Code coming soon</span>
        {% endif %}
      </div>
      <p class="publication-tldr"><strong>TL;DR:</strong> {{ publication.tldr }}</p>
    </div>
  </article>
  {% endfor %}
</div>

# 💬 Tutorials
{% for tutorial in site.data.profile.tutorials %}
- *{{ tutorial.date }}* · **{{ tutorial.venue }}** · [{{ tutorial.title }}]({{ tutorial.url }})
{% endfor %}

# 🎖 Honors and Awards
{% for honor in site.data.profile.honors %}
- *{{ honor.date }}* · {{ honor.title }}
{% endfor %}

# 🏷️ Service
<div class="compact-section service-grid">
  {% for service_group in site.data.profile.service %}
  <div>
    <h3>{{ service_group.category }}</h3>
    <ul>
      {% for item in service_group.items %}
      <li>{{ item }}</li>
      {% endfor %}
    </ul>
  </div>
  {% endfor %}
</div>

# 📖 Education
{% for education in site.data.profile.education %}
- *{{ education.date }}* · {{ education.degree }}, {{ education.institution }}
{% endfor %}

# 💻 Experience
{% for experience in site.data.profile.experience %}
- *{{ experience.date }}* · {{ experience.role }}, {{ experience.institution }}
{% endfor %}

