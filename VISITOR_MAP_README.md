# 访问者世界地图组件使用说明

## 概述

这个访问者世界地图组件为您的Jekyll个人主页添加了一个美观的可视化展示，显示全球访问者的地理分布情况。

## 功能特性

### ✨ 核心功能
- **实时访问者地理位置追踪** - 自动获取访问者的地理位置信息
- **交互式世界地图** - 基于Leaflet.js的高性能地图展示
- **访问统计面板** - 显示总访问量、国家数量、在线访客等统计信息
- **最近访问者列表** - 展示最近的访问者来源
- **响应式设计** - 完美适配桌面端和移动端

### 🎨 视觉特性
- **热力图展示** - 用不同颜色和大小的标记表示访问量
- **脉冲动画** - 当前访问者位置的动态效果
- **现代化UI** - 美观的渐变色彩和阴影效果
- **图例说明** - 清晰的访问量级别说明

### 🔒 隐私保护
- **用户同意机制** - 尊重用户的隐私选择
- **Do Not Track支持** - 自动检测并遵循浏览器的隐私设置
- **本地数据存储** - 数据存储在浏览器本地，不上传到服务器
- **匿名化处理** - 不收集个人身份信息

## 文件结构

```
ziwliu8.github.io/
├── _includes/
│   ├── visitor-map.html          # 地图组件HTML模板
│   └── visitor-map-config.html   # 配置文件
├── assets/js/
│   ├── visitor-map.js            # 地图可视化核心逻辑
│   └── visitor-tracker.js        # 访问者追踪功能
└── _pages/
    └── about.md                  # 已集成地图组件的主页
```

## 技术实现

### 前端技术栈
- **Leaflet.js** - 开源地图库，提供交互式地图功能
- **原生JavaScript** - 无额外框架依赖
- **CSS3动画** - 流畅的视觉效果
- **HTML5 Geolocation API** - 获取访问者位置

### 数据获取方式
1. **HTML5 Geolocation API** - 获取精确的用户位置（需用户授权）
2. **IP地理位置服务** - 备选方案，通过IP地址获取大概位置
3. **Google Analytics集成** - 与现有分析工具协同工作
4. **本地存储** - 使用localStorage保存访问数据

### 地理位置服务
- **BigDataCloud API** - 免费的反向地理编码服务
- **IP-API** - 备选的IP地理位置服务
- **多服务降级** - 确保服务可用性

## 配置选项

在 `_includes/visitor-map-config.html` 中可以自定义以下配置：

### 地图设置
```javascript
map: {
  center: [20, 0],        // 地图中心点
  zoom: 2,                // 初始缩放级别
  scrollWheelZoom: false, // 滚轮缩放
  touchZoom: true         // 触摸缩放
}
```

### 数据设置
```javascript
data: {
  enableRealTracking: true,     // 启用真实追踪
  enableMockData: true,         // 启用模拟数据
  maxStoredVisitors: 100,       // 最大存储数量
  updateInterval: 5 * 60 * 1000 // 更新间隔
}
```

### 样式设置
```javascript
style: {
  colors: {
    low: '#74b9ff',    // 低访问量颜色
    medium: '#fd79a8', // 中等访问量颜色
    high: '#e17055'    // 高访问量颜色
  }
}
```

## 使用方法

### 1. 集成到页面
在任何Markdown文件中添加：
```markdown
# 🌍 全球访问者分布

{% include visitor-map.html %}
```

### 2. 自定义样式
修改 `visitor-map.html` 中的CSS样式来匹配您的网站主题。

### 3. 配置选项
编辑 `visitor-map-config.html` 来调整地图行为和外观。

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ Internet Explorer 不支持

## 性能优化

### 已实现的优化
- **按需加载** - Leaflet.js库按需动态加载
- **数据缓存** - 地理位置信息本地缓存5分钟
- **请求限制** - 限制API调用频率
- **数据压缩** - 最多存储100条访问记录

### 建议的优化
- 在CDN上托管Leaflet.js库以提高加载速度
- 使用付费的地理位置API以获得更准确的数据
- 集成服务器端分析以获得更全面的统计

## 故障排除

### 常见问题

**Q: 地图不显示？**
A: 检查浏览器控制台是否有JavaScript错误，确保网络连接正常。

**Q: 位置信息不准确？**
A: 这是因为使用了IP地理位置服务，精度有限。用户授权后可获得GPS精确位置。

**Q: 统计数据为0？**
A: 首次访问时数据需要时间累积，也可能是隐私设置阻止了数据收集。

### 调试模式
在浏览器控制台中运行：
```javascript
// 查看当前访问者数据
console.log(window.getVisitorMapData());

// 查看统计信息
console.log(window.getVisitorStats());

// 重新初始化地图
new VisitorWorldMap();
```

## 隐私声明

本组件遵循以下隐私原则：
- 不收集个人身份信息
- 不上传数据到外部服务器
- 遵循用户的Do Not Track设置
- 数据仅用于展示访问统计

## 许可证

本组件基于MIT许可证开源，您可以自由使用和修改。

## 支持

如有问题或建议，请联系：lziwei2-c@my.cityu.edu.hk
