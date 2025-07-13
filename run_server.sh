#!/bin/bash

# 设置GitHub API token以避免metadata警告
# 请设置您的GitHub Personal Access Token为环境变量：
# export JEKYLL_GITHUB_TOKEN=your_token_here

# 或者，如果您不想设置token，可以使用以下命令来禁用GitHub metadata
export JEKYLL_ENV=development

bundle exec jekyll serve --livereload