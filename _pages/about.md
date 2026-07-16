---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Currently, I am a first-year Ph.D. student in the *AML Lab* at ***City University of Hong Kong***, supervised by <a href='https://aml-cityu.github.io/'>Prof. Zhao Xiangyu</a>. Before this, I earned my Bachelor's degree in Robotics Engineering from Southeast University, where <a href='https://automation.seu.edu.cn/gyh/list.htm'><strong><em>Prof. Gan Yahui</em></strong></a> and <a href='https://automation.seu.edu.cn/lj/list.htm'><strong><em>Prof. Li Jun</em></strong></a> co-supervised me.

My research interests include Recommender Systems, Information Retrieval, and Large Language Models. I have published several papers at top international AI conferences, with <a href='https://scholar.google.com/citations?user=_H3nmDQAAAAJ&hl=zh-CN'><span id="total_cit">82</span> total Google Scholar citations</a>.

# 🔥 News
<p class="news-scroll-hint">Latest updates · scroll for earlier news ↓</p>
<div class="news-scroll-shell">
  <div class="news-list" role="region" aria-label="Latest news; scroll for earlier updates" tabindex="0">
    <ul>
      <li><time datetime="2026-07-11">2026.07.11</time><span>One paper was accepted by <strong>RecSys 2026</strong>. Congratulations to Yuxuan!</span></li>
      <li><time datetime="2026-06-21">2026.06.21</time><span>I received the <strong>KDD 2026 Student Travel Award</strong>.</span></li>
      <li><time datetime="2026-05-17">2026.05.17</time><span>Our tutorial, <strong>“Tutorial on Generative Recommendation: Foundations and Frontiers,”</strong> was accepted by <strong>KDD 2026</strong>. Many thanks to Xiaopeng for leading this work!</span></li>
      <li><time datetime="2026-05-17">2026.05.17</time><span>Our paper <strong>H²Rec</strong> was accepted by <strong>KDD 2026 ADS Track (CCF-A)</strong>. It has been deployed on RedNote (Xiaohongshu), achieving <strong>ADVV +0.89% and COST +0.59%</strong>. Many thanks to Yejing and Qidong!</span></li>
      <li><time datetime="2026-05-11">2026.05.11</time><span>Our new paper <strong>ComeIR</strong> was released on arXiv. It identifies a representation bottleneck in decoupled two-stage generative recommendation and introduces Engram memory for improved input construction and decoding.</span></li>
      <li><time datetime="2026-04-03">2026.04.03</time><span>Our paper <strong>LLM-EDT</strong> was accepted by <strong>SIGIR 2026 (CCF-A)</strong>. Many thanks to Qidong and Yejing!</span></li>
      <li><time datetime="2026-01-14">2026.01.14</time><span>One paper was accepted by <strong>WWW 2026 (CCF-A)</strong>. Many thanks to Yejing!</span></li>
      <li><time datetime="2025-12-11">2025.12.11</time><span>Our new paper <strong>H²Rec</strong> was released on arXiv. It harmonizes Semantic IDs with Hash IDs to address collaborative overwhelming.</span></li>
      <li><time datetime="2025-11-19">2025.11.19</time><span>Our new paper <strong>LLM-EDT</strong> was released on arXiv. It introduces a general cross-domain sequential recommender for domain imbalance and rough profiling.</span></li>
      <li><time datetime="2025-01">2025.01</time><span>I received the <strong>AAAI 2025 Travel Award</strong>.</span></li>
      <li><time datetime="2024-12">2024.12</time><span>Our paper <strong>SIGMA: Selective Gated Mamba for Sequential Recommendation</strong> was accepted by <strong>AAAI 2025 (CCF-A)</strong>. Many thanks to Qidong for leading this work!</span></li>
    </ul>
  </div>
</div>

# 🏷️ Service
<div class="compact-section service-grid">
  <div>
    <h3>Journals</h3>
    <ul>
      <li><strong>IEEE</strong> Transactions on Knowledge and Data Engineering (<strong>TKDE</strong>)</li>
      <li><strong>ACM</strong> Transactions on Knowledge Discovery from Data (<strong>TKDD</strong>)</li>
      <li><strong>ACM</strong> Transactions on Information Systems (<strong>TOIS</strong>)</li>
    </ul>
  </div>
  <div>
    <h3>Conferences</h3>
    <ul>
      <li>ACM SIGKDD Conference on Knowledge Discovery and Data Mining (<strong>KDD 2027</strong>), ADS Track</li>
      <li>AAAI Conference on Artificial Intelligence (<strong>AAAI 2027</strong>), Main Track</li>
      <li>ACM International Conference on Multimedia (<strong>MM 2026</strong>), Main and DB Tracks</li>
      <li>ACM SIGIR Conference on Research and Development in Information Retrieval (<strong>SIGIR 2026</strong>)</li>
      <li>AAAI Conference on Artificial Intelligence (<strong>AAAI 2026</strong>), Main and AIA Tracks</li>
      <li>ACM SIGIR Conference on Research and Development in Information Retrieval (<strong>SIGIR 2025</strong>)</li>
      <li>ACM Conference on Recommender Systems (<strong>RecSys 2025</strong>)</li>
    </ul>
  </div>
</div>

# 📝 First/Co-first Author Publications

<div class="publication-list">
  <article class="publication-card">
    <figure class="publication-figure">
      <img src="/images/publications/comeir.png" alt="Overview of the ComeIR framework" loading="lazy">
      <figcaption>ComeIR reconstructs item-aware inputs and restores token-level evidence with dual-level conditional memory.</figcaption>
    </figure>
    <div class="publication-content">
      <h3 class="publication-title">Conditional Memory Enhanced Item Representation for Generative Recommendation</h3>
      <p class="publication-authors"><strong>Ziwei Liu<sup>*</sup></strong>, Yejing Wang<sup>*</sup>, Shengyu Zhou, Xinhang Li, Xiangyu Zhao</p>
      <p class="publication-venue"><strong>Preprint</strong>, 2026</p>
      <div class="publication-links">
        <a href="https://arxiv.org/abs/2605.11447" target="_blank" rel="noopener">Paper</a>
        <span class="publication-link-disabled" title="Code will be released publicly">Code coming soon</span>
      </div>
      <p class="publication-tldr"><strong>TL;DR:</strong> ComeIR uses token scoring and dual-level Engram memories to preserve item identity and SID structure, then reuses the memories during decoding to bridge item-level inputs and token-level generation.</p>
    </div>
  </article>

  <article class="publication-card">
    <figure class="publication-figure">
      <img src="/images/publications/h2rec.png" alt="Overview of the H2Rec framework" loading="lazy">
      <figcaption>H²Rec harmonizes multi-granular Semantic IDs with unique collaborative Hash IDs through dual-branch modeling.</figcaption>
    </figure>
    <div class="publication-content">
      <h3 class="publication-title">The Best of Both Worlds: Harmonizing Semantic and Hash IDs for Sequential Recommendation</h3>
      <p class="publication-authors"><strong>Ziwei Liu<sup>*</sup></strong>, Yejing Wang<sup>*</sup>, Wanyu Wang, Zejian Wang, Qidong Liu, Zijian Zhang, Wei Huang, Chong Chen, Xiangyu Zhao</p>
      <p class="publication-venue">ACM SIGKDD Conference on Knowledge Discovery and Data Mining, ADS Track (KDD), 2026 · <strong>CCF-A</strong></p>
      <div class="publication-links">
        <a href="https://arxiv.org/abs/2512.10388" target="_blank" rel="noopener">Paper</a>
        <a href="https://github.com/Applied-Machine-Learning-Lab/KDD26_H2Rec" target="_blank" rel="noopener">Code</a>
      </div>
      <p class="publication-tldr"><strong>TL;DR:</strong> H²Rec combines the semantic generalization of SIDs with the collaborative uniqueness of HIDs, balancing recommendation quality for both head and long-tail items.</p>
    </div>
  </article>

  <article class="publication-card">
    <figure class="publication-figure">
      <img src="/images/publications/llm-edt.png" alt="Overview of the LLM-EDT framework" loading="lazy">
      <figcaption>LLM-EDT couples transferable item augmentation, dual-phase training, and domain-aware user profiling.</figcaption>
    </figure>
    <div class="publication-content">
      <h3 class="publication-title">LLM-EDT: Large Language Models Enhanced Cross-domain Sequential Recommendation with Dual-phase Training</h3>
      <p class="publication-authors"><strong>Ziwei Liu<sup>*</sup></strong>, Qidong Liu<sup>*</sup>, Wanyu Wang, Yejing Wang, Pengyue Jia, Tong Xu, Wei Huang, Chong Chen, Xiangyu Zhao</p>
      <p class="publication-venue">ACM SIGIR Conference on Research and Development in Information Retrieval (SIGIR), 2026 · <strong>CCF-A</strong></p>
      <div class="publication-links">
        <a href="https://arxiv.org/abs/2511.19931" target="_blank" rel="noopener">Paper</a>
        <a href="https://github.com/Applied-Machine-Learning-Lab/SIGIR26_LLM-EDT" target="_blank" rel="noopener">Code</a>
      </div>
      <p class="publication-tldr"><strong>TL;DR:</strong> LLM-EDT addresses domain imbalance, noisy augmentation, and rough profiling via transferable item augmentation, domain-specific fine-tuning, and adaptive domain-aware preference aggregation.</p>
    </div>
  </article>

  <article class="publication-card">
    <figure class="publication-figure">
      <img src="/images/publications/sigma.png" alt="Overview of the SIGMA framework" loading="lazy">
      <figcaption>SIGMA enhances Mamba with partial bidirectional modeling, selective gating, and short-term feature extraction.</figcaption>
    </figure>
    <div class="publication-content">
      <h3 class="publication-title">SIGMA: Selective Gated Mamba for Sequential Recommendation</h3>
      <p class="publication-authors"><strong>Ziwei Liu<sup>*</sup></strong>, Qidong Liu<sup>*</sup>, Yejing Wang, Wanyu Wang, Pengyue Jia, Maolin Wang, Zitao Liu, Yi Chang, Xiangyu Zhao</p>
      <p class="publication-venue">AAAI Conference on Artificial Intelligence (AAAI), 2025 · <strong>CCF-A</strong></p>
      <div class="publication-links">
        <a href="https://ojs.aaai.org/index.php/AAAI/article/view/33336" target="_blank" rel="noopener">Paper</a>
        <a href="https://github.com/ziwliu8/SIGMA" target="_blank" rel="noopener">Code</a>
      </div>
      <p class="publication-tldr"><strong>TL;DR:</strong> SIGMA equips Mamba with partially flipped bidirectional modeling, an input-dependent selective gate, and a feature-extracting GRU for efficient long- and short-term sequential recommendation.</p>
    </div>
  </article>
</div>

# 🎖 Honors and Awards
- *2026.06* · **KDD 2026** Student Travel Award and Volunteer
- *2025.01* · **AAAI 2025** Travel Award and Volunteer
- *2024.12* · Silver Medal, Kaggle LLM Prompt Recovery (**44/2,175**)
- *2023.06* · Excellent Graduation Project, Southeast University

# 📖 Education
- *2025.09–Present* · Ph.D. in Data Science, City University of Hong Kong
- *2023.09–2024.10* · M.E. in Data Science, City University of Hong Kong
- *2019.09–2023.06* · B.E. in Robotics Engineering, Southeast University

# 💬 Tutorial
- *2026.08* · **KDD 2026 (CCF-A)** · [Tutorial on Generative Recommendation: Foundations and Frontiers](https://github.com/Kuaishou-RecModel/Tri-Decoupled-GenRec)
- *2025.08* · **KDD 2025 (CCF-A)** · [Large Language Model Enhanced Recommender Systems: Taxonomy, Trend, Applications, and Future Directions](https://github.com/liuqidong07/Awesome-LLM-Enhanced-Recommender-Systems)


# 💻 Experience
- *2024.05–2024.12* · Research Assistant, Chinese University of Hong Kong, Shenzhen

