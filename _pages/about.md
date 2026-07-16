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

Currently, I am a first-year Ph.D student in the *AML Lab* at ***City University of Hong Kong***, supervised by <a href='https://aml-cityu.github.io/'>Prof. Zhao Xiangyu</a>. Before this, I earned my Bachelor's degree in Robotics Engineering from Southeast University, where <a href='https://automation.seu.edu.cn/gyh/list.htm'><strong><em>Prof. Gan Yahui</em></strong></a> and <a href='https://automation.seu.edu.cn/lj/list.htm'><strong><em>Prof. Li Jun</em></strong></a> co-supervised me. 

My research interest includes Recommender Systems, Information Retrieval and LLM. I have published several papers at the top international AI conferences with <a href='https://scholar.google.com/citations?user=_H3nmDQAAAAJ&hl=zh-CN'><span id="total_cit">82</span> total Google Scholar citations</a>.

# 🏷️ Service
**Journals**
- ***IEEE*** Transactions on Knowledge and Data Engineering (***TKDE***).
- ***ACM*** Transactions on Knowledge Discovery from Data (***TKDD***).
- ***ACM*** Transactions on Information Systems (***TOIS***).
 
**Conference**
- **SIGKDD** SIGKDD Conference on Knowledge Discovery and Data Mining (***KDD'2027 ADS track***).
- **AAAI** Association for the Advanced Artificial Intelligence (***AAAI'2027 main track***).
- ***ACM*** International Conference on Multimedia (***MM'2026 main track and DB track***).
- **ACM** SIGIR Conference on Research and Development in Information Retrieval (***SIGIR'2026***). 
- **AAAI** Association for the Advanced Artificial Intelligence (***AAAI'2026 main track and AIA track***).
- **ACM** SIGIR Conference on Research and Development in Information Retrieval (***SIGIR'2025***). 
- **ACM** Conference on Recommender Systems (***Recsys'2025***).


# 🔥 News
- *2026.07.11* One paper has been accepted by **Recsys'26**. Congrats to Bro Yuxuan!

- *2026.06.21* I have received the **Student Travel Award of KDD26**.

- *2026.05.17* Our Tutorial **“Tutorial on Generative Recommendation: Foundations and Frontiers”** is accepted by **KDD'26**. Great thanks for Xiaopeng for carrying me!

- *2026.05.17* Our Paper **H2Rec** is accepted by **KDD'26 ADS Track (CCF-A)**, which has been applied to **Red Book (Xiao Hong Shu)** and **achieved commercial outcomes (ADVV + 0.89% and COST +0.59%)**. Great thanks for help and suggestion from Bro Yejing and Qidong!

- *2026.05.11* Our New Paper ComeIR is preprinted on Arxiv, which identify the bottleneck of the current decoupled two stage GR framework and leverage the engram memory for better GR input and decoding.

- *2026.04.03* Our Paper **LLM-EDT** is accepted by **SIGIR'26 (CCF-A)**. Thanks for help and guidance from Bro Qidong and Yejing!

- *2026.01.14* One Paper got accepted by **WWW'26 (CCF-A)**. Thank Bro Yejing for carrying me!**

- *2025.12.11* Our New paper H^2Rec is preprinted on Arxiv, which harmonizing the semantic IDs with Hash IDs to address the collaborative overwhelming problem.

- *2025.11.19* Our New paper LLM-EDT is preprinted on Arxiv, which propose a general cross-domain sequential recommender addressing the imbalance domain issue and Rough profiling Issue.

- *2025.01*: &nbsp;🎉🎉 I have received the **Traval Award from AAAI'2025.**

- *2024.12*: &nbsp;🎉🎉 Our paper **SIGMA: Selective Gated Mamba for Sequential Recommendation** is accepted by AAAI'2025 (**CCF-A**). Sincerely thank Bro Qidong for leading the way. 

# 📝 First/Co-first Author Publications

<div class="publication-list">
  <article class="publication-card">
    <figure class="publication-figure">
      <img src="/images/publications/comeir.png" alt="Overview of the ComeIR framework" loading="lazy">
      <figcaption>ComeIR reconstructs item-aware inputs and restores token-level evidence with dual-level conditional memory.</figcaption>
    </figure>
    <div class="publication-content">
      <h3 class="publication-title">Conditional Memory Enhanced Item Representation for Generative Recommendation</h3>
      <p class="publication-authors"><strong>Ziwei Liu</strong>, Yejing Wang, Shengyu Zhou, Xinhang Li, Xiangyu Zhao</p>
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
      <p class="publication-authors"><strong>Ziwei Liu</strong>, Yejing Wang, Wanyu Wang, Zejian Wang, Qidong Liu, Zijian Zhang, Wei Huang, Chong Chen, Xiangyu Zhao</p>
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
      <p class="publication-authors"><strong>Ziwei Liu</strong>, Qidong Liu, Wanyu Wang, Yejing Wang, Pengyue Jia, Tong Xu, Wei Huang, Chong Chen, Xiangyu Zhao</p>
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
      <p class="publication-authors"><strong>Ziwei Liu</strong>, Qidong Liu, Yejing Wang, Wanyu Wang, Pengyue Jia, Maolin Wang, Zitao Liu, Yi Chang, Xiangyu Zhao</p>
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
- *2026.06* ***SIGKDD'2026*** Student Travel Award and Volunteer.
- *2025.01* ***AAAI'2025*** Travel Award and Volunteer.
- *2024.12* Silver Medal in Kaggle (2024): LLM Prompt Recovery (***44/2175***). 
- *2023.06* Excellent Graduation Project of Southeast University.

# 📖 Educations
- *2025.09 - now*, Ph.D., Data Science, City University of Hong Kong.
- *2023.09 - 2024.10*, M.E., Data Science, City University of Hong Kong. 
- *2019.09 - 2023.06*, B.E., Robotics Engineering, Southeast University.

# 💬 Tutorial
- *2026.08*, KDD'2026 (CCF-A), Tutorial on Generative Recommendation: Foundations and Frontiers (https://github.com/Kuaishou-RecModel/Tri-Decoupled-GenRec)
- *2025.08*, KDD'2025 (CCF-A), Large language model enhanced recommender systems: Taxonomy, trend, application and future (https://github.com/liuqidong07/Awesome-LLM-Enhanced-Recommender-Systems)


# 💻 Internships
- *2024.05 - 2024.12*, Research Assistant, Chinese University of Hong Kong (Shenzhen), China.

