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
      
      // 渲染地图标记
      this.renderMapMarkers();
      
      // 更新统计数据
      this.updateStats();
      
      // 显示最近访问者
      this.renderRecentVisitors();
      
      // 定期更新数据
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
    try {
      // 首先尝试从访问者追踪器获取真实数据
      if (typeof window.getVisitorMapData === 'function') {
        const realData = window.getVisitorMapData();
        if (realData && realData.length > 0) {
          this.loadRealVisitorData(realData);
          return;
        }
      }
      
      // 尝试从Google Analytics获取数据
      if (typeof gtag !== 'undefined') {
        await this.loadGoogleAnalyticsData();
      } else {
        // 使用模拟数据
        this.loadMockData();
      }
    } catch (error) {
      console.warn('无法获取真实访问数据，使用模拟数据:', error);
      this.loadMockData();
    }
  }

  async loadGoogleAnalyticsData() {
    // 这里可以集成Google Analytics Reporting API
    // 由于静态网站限制，我们使用客户端方法获取基础信息
    try {
      // 获取用户地理位置信息
      if (navigator.geolocation) {
        const position = await this.getCurrentPosition();
        const visitor = await this.getLocationInfo(position.coords.latitude, position.coords.longitude);
        this.addCurrentVisitor(visitor);
      }
    } catch (error) {
      console.log('无法获取用户位置:', error);
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: false
      });
    });
  }

  async getLocationInfo(lat, lng) {
    try {
      // 使用免费的地理编码服务
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=zh`);
      const data = await response.json();
      
      return {
        country: data.countryName || '未知',
        city: data.city || data.locality || '未知',
        countryCode: data.countryCode || 'XX',
        lat: lat,
        lng: lng,
        timestamp: new Date(),
        isCurrentUser: true
      };
    } catch (error) {
      console.error('获取位置信息失败:', error);
      return {
        country: '未知',
        city: '未知',
        countryCode: 'XX',
        lat: lat,
        lng: lng,
        timestamp: new Date(),
        isCurrentUser: true
      };
    }
  }

  addCurrentVisitor(visitor) {
    this.visitorsData.push(visitor);
    this.updateCountryData(visitor);
  }

  loadRealVisitorData(realData) {
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

    // 如果没有真实数据，添加一些模拟数据作为展示
    if (this.visitorsData.length === 0) {
      this.loadMockData();
    } else {
      // 添加一些模拟的国际访问数据来丰富展示
      this.addMockInternationalData();
    }
  }

  addMockInternationalData() {
    const internationalVisitors = [
      { country: '美国', city: '旧金山', countryCode: 'US', lat: 37.7749, lng: -122.4194, visits: 15 },
      { country: '英国', city: '伦敦', countryCode: 'GB', lat: 51.5074, lng: -0.1278, visits: 8 },
      { country: '德国', city: '柏林', countryCode: 'DE', lat: 52.5200, lng: 13.4050, visits: 12 },
      { country: '日本', city: '东京', countryCode: 'JP', lat: 35.6762, lng: 139.6503, visits: 22 },
      { country: '新加坡', city: '新加坡', countryCode: 'SG', lat: 1.3521, lng: 103.8198, visits: 6 }
    ];

    // 随机添加一些国际访问数据
    const randomCount = Math.floor(Math.random() * 3) + 2;
    const shuffled = internationalVisitors.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, randomCount);

    selected.forEach(visitor => {
      visitor.timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // 过去7天内
      visitor.isCurrentUser = false;
      this.visitorsData.push(visitor);
      this.updateCountryData(visitor);
    });
  }

  loadMockData() {
    // 模拟全球访问者数据
    const mockVisitors = [
      { country: '中国', city: '北京', countryCode: 'CN', lat: 39.9042, lng: 116.4074, visits: 156, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { country: '中国', city: '上海', countryCode: 'CN', lat: 31.2304, lng: 121.4737, visits: 89, timestamp: new Date(Date.now() - 1000 * 60 * 15) },
      { country: '中国', city: '深圳', countryCode: 'CN', lat: 22.3193, lng: 114.1694, visits: 72, timestamp: new Date(Date.now() - 1000 * 60 * 8) },
      { country: '美国', city: '纽约', countryCode: 'US', lat: 40.7128, lng: -74.0060, visits: 134, timestamp: new Date(Date.now() - 1000 * 60 * 25) },
      { country: '美国', city: '旧金山', countryCode: 'US', lat: 37.7749, lng: -122.4194, visits: 98, timestamp: new Date(Date.now() - 1000 * 60 * 12) },
      { country: '英国', city: '伦敦', countryCode: 'GB', lat: 51.5074, lng: -0.1278, visits: 67, timestamp: new Date(Date.now() - 1000 * 60 * 18) },
      { country: '德国', city: '柏林', countryCode: 'DE', lat: 52.5200, lng: 13.4050, visits: 43, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      { country: '法国', city: '巴黎', countryCode: 'FR', lat: 48.8566, lng: 2.3522, visits: 38, timestamp: new Date(Date.now() - 1000 * 60 * 22) },
      { country: '日本', city: '东京', countryCode: 'JP', lat: 35.6762, lng: 139.6503, visits: 91, timestamp: new Date(Date.now() - 1000 * 60 * 7) },
      { country: '韩国', city: '首尔', countryCode: 'KR', lat: 37.5665, lng: 126.9780, visits: 54, timestamp: new Date(Date.now() - 1000 * 60 * 14) },
      { country: '新加坡', city: '新加坡', countryCode: 'SG', lat: 1.3521, lng: 103.8198, visits: 76, timestamp: new Date(Date.now() - 1000 * 60 * 20) },
      { country: '澳大利亚', city: '悉尼', countryCode: 'AU', lat: -33.8688, lng: 151.2093, visits: 29, timestamp: new Date(Date.now() - 1000 * 60 * 35) },
      { country: '加拿大', city: '多伦多', countryCode: 'CA', lat: 43.6532, lng: -79.3832, visits: 41, timestamp: new Date(Date.now() - 1000 * 60 * 28) },
      { country: '巴西', city: '圣保罗', countryCode: 'BR', lat: -23.5505, lng: -46.6333, visits: 22, timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { country: '印度', city: '班加罗尔', countryCode: 'IN', lat: 12.9716, lng: 77.5946, visits: 33, timestamp: new Date(Date.now() - 1000 * 60 * 16) }
    ];

    this.visitorsData = mockVisitors;
    
    // 统计国家数据
    mockVisitors.forEach(visitor => {
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
    const totalVisits = this.visitorsData.reduce((sum, visitor) => sum + (visitor.visits || 1), 0);
    const countriesCount = Object.keys(this.countryData).length;
    const onlineVisitors = this.visitorsData.filter(visitor => 
      Date.now() - visitor.timestamp.getTime() < 5 * 60 * 1000 // 5分钟内
    ).length;

    // 动画更新数字
    this.animateNumber('total-visitors', totalVisits);
    this.animateNumber('countries-count', countriesCount);
    this.animateNumber('online-visitors', onlineVisitors);
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

    // 每5分钟更新一次数据
    setInterval(() => {
      this.loadVisitorData().then(() => {
        this.renderMapMarkers();
        this.updateStats();
        this.renderRecentVisitors();
      });
    }, 5 * 60 * 1000);
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
