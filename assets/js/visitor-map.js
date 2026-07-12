/**
 * 访问者世界地图可视化组件
 * 基于Leaflet.js实现的访问流量地图
 */

class VisitorWorldMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.visitorsData = [];
    this.countryData = {};
    this.totalViews = null;
    this.viewsApiUrl = 'https://page-views-api.ratneshc.com/api/v1/views?site=ziwliu8.github.io&path=%2F';
    this.init();
  }

  async init() {
    try {
      // 显示加载状态
      this.showLoading();
      
      // 初始化地图
      await this.initMap();
      
      // 加载访问者数据
      await this.loadVisitorData();

      // 从持久化服务读取全站访问量
      await this.loadTotalViews();
      
      // 渲染地图标记
      this.renderMapMarkers();
      
      // 更新统计数据
      this.updateStats();
      
      // 显示最近访问者
      this.renderRecentVisitors();
      
      // 监听真实位置，并在跟踪完成后同步访问量
      this.startAutoUpdate();
      
    } catch (error) {
      console.error('访问者地图初始化失败:', error);
      this.showError();
    }
  }

  showLoading() {
    const mapContainer = document.getElementById('visitor-world-map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>正在加载访问者数据...</p>
        </div>
      `;
    }
  }

  showError() {
    const mapContainer = document.getElementById('visitor-world-map');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div class="loading-spinner">
          <p style="color: #e53e3e;">地图加载失败，请稍后重试</p>
        </div>
      `;
    }
  }

  async initMap() {
    // 等待Leaflet库加载完成
    if (typeof L === 'undefined') {
      await this.loadLeaflet();
    }

    // 初始化地图
    this.map = L.map('visitor-world-map', {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: false,
      dragging: true,
      touchZoom: true
    });

    // 添加地图图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);

    // 地图样式优化
    this.map.getContainer().style.background = '#a5bfdd';
  }

  async loadLeaflet() {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="leaflet"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async loadVisitorData() {
    this.visitorsData = [];
    this.countryData = {};

    if (typeof window.getVisitorMapData === 'function') {
      const realData = window.getVisitorMapData();
      if (realData && realData.length > 0) {
        this.loadRealVisitorData(realData);
      }
    }
  }

  async loadTotalViews() {
    try {
      const response = await fetch(this.viewsApiUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`访问量服务返回 ${response.status}`);
      }

      const data = await response.json();
      this.totalViews = Number.isFinite(data.views) ? data.views : null;
    } catch (error) {
      this.totalViews = null;
      console.warn('无法读取持久化访问量:', error);
    }
  }

  loadRealVisitorData(realData) {
    this.countryData = {};

    // 转换真实访问数据格式
    this.visitorsData = realData.map(visitor => ({
      country: visitor.country || '未知',
      city: visitor.city || '未知',
      countryCode: visitor.countryCode || 'XX',
      lat: visitor.latitude || 0,
      lng: visitor.longitude || 0,
      visits: 1, // 每个访问记录代表一次访问
      timestamp: new Date(visitor.timestamp || Date.now()),
      isCurrentUser: visitor.sessionId === (window.visitorTracker?.sessionId)
    }));

    // 合并相同城市的访问
    const cityVisits = {};
    this.visitorsData.forEach(visitor => {
      const key = `${visitor.city}-${visitor.country}`;
      if (cityVisits[key]) {
        cityVisits[key].visits += 1;
        // 保持最新的时间戳
        if (visitor.timestamp > cityVisits[key].timestamp) {
          cityVisits[key].timestamp = visitor.timestamp;
          cityVisits[key].isCurrentUser = visitor.isCurrentUser;
        }
      } else {
        cityVisits[key] = { ...visitor };
      }
    });

    // 转换回数组格式
    this.visitorsData = Object.values(cityVisits);

    // 统计国家数据
    this.visitorsData.forEach(visitor => {
      this.updateCountryData(visitor);
    });
  }

  updateCountryData(visitor) {
    if (!this.countryData[visitor.countryCode]) {
      this.countryData[visitor.countryCode] = {
        country: visitor.country,
        visits: 0,
        cities: new Set()
      };
    }
    
    this.countryData[visitor.countryCode].visits += (visitor.visits || 1);
    this.countryData[visitor.countryCode].cities.add(visitor.city);
  }

  renderMapMarkers() {
    // 清除现有标记
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];

    // 为每个访问者添加标记
    this.visitorsData.forEach(visitor => {
      const markerColor = this.getMarkerColor(visitor.visits || 1);
      const markerSize = this.getMarkerSize(visitor.visits || 1);

      const marker = L.circleMarker([visitor.lat, visitor.lng], {
        radius: markerSize,
        fillColor: markerColor,
        color: '#ffffff',
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6
      });

      // 添加弹出信息
      const popupContent = `
        <div style="text-align: center; min-width: 150px;">
          <h4 style="margin: 0 0 8px 0; color: #2d3748;">${visitor.city}</h4>
          <p style="margin: 0 0 4px 0; color: #4a5568; font-size: 0.9em;">${visitor.country}</p>
          <p style="margin: 0 0 4px 0; color: #718096; font-size: 0.8em;">访问次数: ${visitor.visits || 1}</p>
          <p style="margin: 0; color: #a0aec0; font-size: 0.75em;">${this.formatTime(visitor.timestamp)}</p>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(this.map);
      this.markers.push(marker);

      // 添加动画效果
      if (visitor.isCurrentUser) {
        this.addPulseAnimation(marker);
      }
    });
  }

  getMarkerColor(visits) {
    if (visits >= 50) return '#e17055'; // 高访问量 - 橙红色
    if (visits >= 11) return '#fd79a8'; // 中等访问量 - 粉色
    return '#74b9ff'; // 低访问量 - 蓝色
  }

  getMarkerSize(visits) {
    if (visits >= 50) return 12;
    if (visits >= 11) return 8;
    return 6;
  }

  addPulseAnimation(marker) {
    const element = marker.getElement();
    if (element) {
      element.style.animation = 'pulse 2s infinite';
      element.style.setProperty('--pulse-color', '#667eea');
    }
  }

  updateStats() {
    const countriesCount = Object.keys(this.countryData).length;
    const currentSessions = this.visitorsData.filter(visitor => visitor.isCurrentUser).length;

    if (this.totalViews === null) {
      const totalVisitorsElement = document.getElementById('total-visitors');
      if (totalVisitorsElement) totalVisitorsElement.textContent = '—';
    } else {
      this.animateNumber('total-visitors', this.totalViews);
    }
    this.animateNumber('countries-count', countriesCount);
    this.animateNumber('online-visitors', currentSessions);
  }

  animateNumber(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startValue = parseInt(element.textContent) || 0;
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  renderRecentVisitors() {
    const recentVisitorsList = document.getElementById('recent-visitors-list');
    if (!recentVisitorsList) return;

    // 按时间排序，显示最近的访问者
    const recentVisitors = this.visitorsData
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);

    recentVisitorsList.innerHTML = recentVisitors.map(visitor => `
      <div class="visitor-item">
        <div class="visitor-location">${visitor.city}, ${visitor.country}</div>
        <div class="visitor-time">${this.formatTime(visitor.timestamp)}</div>
      </div>
    `).join('');
  }

  formatTime(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  }

  startAutoUpdate() {
    // 监听访问者位置更新事件
    document.addEventListener('visitorLocationUpdate', (event) => {
      this.handleVisitorUpdate(event.detail);
    });

    // 跟踪脚本与地图并行加载，短暂延迟后同步一次本次访问。
    setTimeout(() => {
      this.loadTotalViews().then(() => {
        this.updateStats();
      });
    }, 1500);
  }

  handleVisitorUpdate(data) {
    // 实时更新访问者数据
    if (data.allVisitors) {
      this.loadRealVisitorData(data.allVisitors);
      this.renderMapMarkers();
      this.updateStats();
      this.renderRecentVisitors();
    }
  }
}

// 添加脉冲动画CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color, #667eea);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(102, 126, 234, 0.3);
      transform: scale(1.1);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

// 当页面加载完成时初始化地图
document.addEventListener('DOMContentLoaded', function() {
  const mapContainer = document.getElementById('visitor-world-map');
  if (mapContainer) {
    new VisitorWorldMap();
  }
});

// 导出类以供其他脚本使用
window.VisitorWorldMap = VisitorWorldMap;
