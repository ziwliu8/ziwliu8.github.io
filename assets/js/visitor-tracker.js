/**
 * 访问者地理位置追踪器
 * 与Google Analytics集成，收集访问者地理信息
 */

class VisitorTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.visitData = this.getStoredVisitData();
    this.init();
  }

  init() {
    // 等待页面完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startTracking());
    } else {
      this.startTracking();
    }
  }

  async startTracking() {
    try {
      // 获取访问者基础信息
      const visitorInfo = await this.getVisitorInfo();
      
      // 存储访问数据
      this.storeVisitData(visitorInfo);
      
      // 发送到Google Analytics（如果可用）
      this.sendToAnalytics(visitorInfo);
      
      // 触发地图更新事件
      this.triggerMapUpdate(visitorInfo);
      
    } catch (error) {
      console.log('访问者追踪初始化失败:', error);
    }
  }

  async getVisitorInfo() {
    const info = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      referrer: document.referrer,
      currentPage: window.location.pathname
    };

    // 尝试获取地理位置
    try {
      const position = await this.getCurrentPosition();
      const locationInfo = await this.getLocationFromCoordinates(
        position.coords.latitude, 
        position.coords.longitude
      );
      
      Object.assign(info, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        ...locationInfo
      });
    } catch (error) {
      // 如果无法获取精确位置，尝试通过IP获取大概位置
      try {
        const ipLocation = await this.getLocationFromIP();
        Object.assign(info, ipLocation);
      } catch (ipError) {
        console.log('无法获取位置信息:', ipError);
        // 使用默认值
        Object.assign(info, {
          country: '未知',
          countryCode: 'XX',
          city: '未知',
          latitude: 0,
          longitude: 0
        });
      }
    }

    return info;
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('浏览器不支持地理定位'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5分钟缓存
        }
      );
    });
  }

  async getLocationFromCoordinates(lat, lng) {
    try {
      // 使用免费的反向地理编码服务
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=zh`,
        { timeout: 5000 }
      );
      
      if (!response.ok) throw new Error('地理编码服务不可用');
      
      const data = await response.json();
      
      return {
        country: data.countryName || '未知',
        countryCode: data.countryCode || 'XX',
        city: data.city || data.locality || data.principalSubdivision || '未知',
        region: data.principalSubdivision || '',
        continent: data.continent || ''
      };
    } catch (error) {
      console.log('反向地理编码失败:', error);
      throw error;
    }
  }

  async getLocationFromIP() {
    try {
      // 使用多个免费IP地理位置服务作为备选
      const services = [
        'https://ipapi.co/json/',
        'https://api.ipify.org?format=json', // 仅获取IP
        'http://ip-api.com/json/'
      ];

      for (const service of services) {
        try {
          const response = await fetch(service, { timeout: 3000 });
          const data = await response.json();
          
          if (data.country_name || data.country) {
            return {
              country: data.country_name || data.country || '未知',
              countryCode: data.country_code || data.countryCode || 'XX',
              city: data.city || '未知',
              region: data.region || data.region_name || '',
              latitude: parseFloat(data.latitude || data.lat) || 0,
              longitude: parseFloat(data.longitude || data.lon) || 0
            };
          }
        } catch (serviceError) {
          console.log(`服务 ${service} 不可用:`, serviceError);
          continue;
        }
      }
      
      throw new Error('所有IP地理位置服务都不可用');
    } catch (error) {
      console.log('IP地理位置获取失败:', error);
      throw error;
    }
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getStoredVisitData() {
    try {
      const stored = localStorage.getItem('visitorMapData');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  storeVisitData(visitorInfo) {
    try {
      // 获取现有数据
      let visitData = this.getStoredVisitData();
      
      // 检查是否是重复访问（同一会话）
      const existingVisit = visitData.find(visit => visit.sessionId === this.sessionId);
      
      if (existingVisit) {
        // 更新现有访问记录
        Object.assign(existingVisit, visitorInfo);
      } else {
        // 添加新的访问记录
        visitData.push(visitorInfo);
        
        // 限制存储的记录数量（最多100条）
        if (visitData.length > 100) {
          visitData = visitData.slice(-100);
        }
      }
      
      localStorage.setItem('visitorMapData', JSON.stringify(visitData));
      this.visitData = visitData;
    } catch (error) {
      console.log('存储访问数据失败:', error);
    }
  }

  sendToAnalytics(visitorInfo) {
    // 发送自定义事件到Google Analytics
    if (typeof gtag === 'function') {
      gtag('event', 'visitor_location', {
        event_category: 'Geography',
        event_label: `${visitorInfo.city}, ${visitorInfo.country}`,
        custom_map: {
          custom_parameter_1: visitorInfo.countryCode,
          custom_parameter_2: visitorInfo.latitude,
          custom_parameter_3: visitorInfo.longitude
        }
      });

      // 设置用户属性
      gtag('config', 'G-CHNBJEC9QG', {
        custom_map: {
          user_country: visitorInfo.country,
          user_city: visitorInfo.city
        }
      });
    }
  }

  triggerMapUpdate(visitorInfo) {
    // 触发自定义事件，通知地图组件更新
    const event = new CustomEvent('visitorLocationUpdate', {
      detail: {
        visitor: visitorInfo,
        allVisitors: this.visitData
      }
    });
    
    document.dispatchEvent(event);
  }

  // 公共方法：获取所有访问数据
  getAllVisitorData() {
    return this.visitData;
  }

  // 公共方法：获取统计信息
  getVisitorStats() {
    const visitors = this.visitData;
    const countries = new Set(visitors.map(v => v.countryCode)).size;
    const cities = new Set(visitors.map(v => `${v.city}, ${v.country}`)).size;
    const recentVisitors = visitors.filter(v => 
      Date.now() - new Date(v.timestamp).getTime() < 24 * 60 * 60 * 1000 // 24小时内
    ).length;

    return {
      totalVisitors: visitors.length,
      uniqueCountries: countries,
      uniqueCities: cities,
      recentVisitors: recentVisitors
    };
  }
}

// 全局实例
window.visitorTracker = new VisitorTracker();

// 为地图组件提供数据接口
window.getVisitorMapData = function() {
  return window.visitorTracker ? window.visitorTracker.getAllVisitorData() : [];
};

window.getVisitorStats = function() {
  return window.visitorTracker ? window.visitorTracker.getVisitorStats() : {
    totalVisitors: 0,
    uniqueCountries: 0,
    uniqueCities: 0,
    recentVisitors: 0
  };
};
