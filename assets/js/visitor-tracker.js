/**
 * 统一访问统计客户端。
 * 总量和地区数据均由同一个 Cloudflare Worker + D1 后端返回。
 */
class VisitorTracker {
  constructor() {
    this.request = null;
  }

  trackVisit() {
    if (!this.request) {
      this.request = this.fetchStats('/api/visit', { method: 'POST' });
    }
    return this.request;
  }

  getStats() {
    return this.fetchStats('/api/stats');
  }

  async fetchStats(path, options = {}) {
    const apiUrl = window.VisitorMapConfig?.data?.apiUrl;
    if (!apiUrl) {
      throw new Error('访问统计 API 尚未配置');
    }

    const response = await fetch(`${apiUrl.replace(/\/$/, '')}${path}`, {
      cache: 'no-store',
      ...options
    });
    if (!response.ok) {
      throw new Error(`访问统计服务返回 ${response.status}`);
    }

    const data = await response.json();
    if (!Number.isFinite(data.total) || !Array.isArray(data.locations)) {
      throw new Error('访问统计服务返回了无效数据');
    }
    return data;
  }
}

window.visitorTracker = new VisitorTracker();
