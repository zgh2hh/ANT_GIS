# 爱农田GIS平台

* 参考Create Map项目进行修改，感谢[oppoudel/CreateMap](https://github.com/oppoudel/CreateMap)
* 在线预览地址，[http://pingpugis.qmant.com](http://pingpugis.qmant.com),首次加载需要下载大量ArcGIS js文件，比较忙，network中会遇到https请求的异常，右击该请求，open in new tab，允许访问，即可加载

## 简介
> 田块数据由后端的提供的json数据，拼接成geojson数据格式。再通过gdal转成shapefile，经过坐标转换投影等过程。导入ArcGIS，利用ArcGIS空间分析工具和ENVI图像处理技术，生成农田养分、病虫草害、成熟期预测等各种专题图，发布ArcGIS Server服务。前端通过ArcGIS API for JavaScript调用服务，展示分析结果

## 使用
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 涉及技术
* [*Vue.js 2.0*](https://cn.vuejs.org/v2/guide/instance.html)
* [*Vuex*](https://vuex.vuejs.org/zh-cn/intro.html)
* [*ArcGIS API for JavaScript V4.4*](https://developers.arcgis.com/javascript/)
