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

Currently, I am a first-year Ph.D student in the *AML Lab* at the School of ***Data Science***, ***City University of Hong Kong***<a href='https://aml-cityu.github.io/'>. Before this, I earned my Master's degree at CityU under the supervision of ***Prof. Zhao Xiangyu***. I also obtained my Bachelor's degree in Robotics Engineering from Southeast University, where ***Prof. Gan Yahui*** and ***Prof. Li Jun*** co-supervised me. 

My research interest includes Recommender Systems, Information Retrieval and LLM. I have published several papers at the top international AI conferences with total <a href='https://scholar.google.com/citations?user=_H3nmDQAAAAJ'> Google Scholar citations.

<p class="cv-actions">
  <a id="generate-cv-button" class="btn btn--info" href="{{ '/cv/?print=1' | relative_url }}" target="_blank" rel="noopener">Generate CV PDF</a>
</p>

# 🏷️ Service
**Journals**
- ***IEEE*** Transactions on Knowledge and Data Engineering (***TKDE***).
- ***ACM*** Transactions on Knowledge Discovery from Data (***TKDD***).
- ***ACM*** Transactions on Information Systems (***TOIS***).
 
**Conference**
- **AAAI** Association for the Advanced Artificial Intelligence (***AAAI'2027 main track***).
- ***ACM*** International Conference on Multimedia (***MM'2026 main track and DB track***).
- **ACM** SIGIR Conference on Research and Development in Information Retrieval (***SIGIR'2026***). 
- **AAAI** Association for the Advanced Artificial Intelligence (***AAAI'2026 main track and AIA track***).
- **ACM** SIGIR Conference on Research and Development in Information Retrieval (***SIGIR'2025***). 
- **ACM** Conference on Recommender Systems (***Recsys'2025***).


# 🔥 News
- *2026。06.21* I received the **"Student Travel Award" of KDD26**.

- *2026.05.17* Our Tutorial **“Tutorial on Generative Recommendation: Foundations and Frontiers”** is accepted by **KDD'26**. Great thanks for Xiaopeng for carrying me!

- *2026.05.17* Our Paper **H2Rec** is accepted by **KDD'26 ADS Track (CCF-A)**, which has been applied to **Red Book (Xiao Hong Shu)** and **achieved commercial outcomes (ADVV + 0.89% and COST +0.59%)**. Great thanks for help and suggestion from Bro Yejing and Qidong!

- *2026.05.11* Our New Paper ComeIR is preprinted on Arxiv, which identify the bottleneck of the current decoupled two stage GR framework and leverage the engram memory for better GR input and decoding.

- *2026.04.03* Our Paper **LLM-EDT** is accepted by **SIGIR'26 (CCF-A)**. Thanks for help and guidance from Bro Qidong and Yejing!

- *2026.01.14* One Paper got accepted by **WWW'26 (CCF-A)**. Thank Bro Yejing for carrying me!**

- *2025.12.11* Our New paper H^2Rec is preprinted on Arxiv, which harmonizing the semantic IDs with Hash IDs to address the collaborative overwhelming problem.

- *2025.11.19* Our New paper LLM-EDT is preprinted on Arxiv, which propose a general cross-domain sequential recommender addressing the imbalance domain issue and Rough profiling Issue.

- *2025.01*: &nbsp;🎉🎉 I have received the **Traval Award from AAAI'2025.**

- *2024.12*: &nbsp;🎉🎉 Our paper **SIGMA: Selective Gated Mamba for Sequential Recommendation** is accepted by AAAI'2025 (**CCF-A**). Sincerely thank Bro Qidong for leading the way. 

# 📝 Publications 
***Preprint***: [Conditional Memory Enhanced Item Representation for Generative Recommendation](https://arxiv.org/abs/2605.11447)

***SIGKDD'2026 ADS (CCF-A)***: [The Best of the Two Worlds: Harmonizing Semantic and Hash IDs for Sequential Recommendation](http://arxiv.org/abs/2512.10388)

***SIGIR'2026 (CCF-A)***: [LLM-EDT: Large Language Model Enhanced Cross-domain Sequential Recommendation with Dual-phase Training](https://arxiv.org/abs/2511.19931)

***AAAI'2025 (CCF-A)***: [SIGMA: Selected Gated Mamba for Sequential Recommendation](https://ojs.aaai.org/index.php/AAAI/article/view/33336/35491)

# 🎖 Honors and Awards
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

# 🌍 Visiting Record

{% include visitor-map.html %}
