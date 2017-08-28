export const createMap = function (loader, callback) {
  const esriLoader = loader
  esriLoader.dojoRequire(
    [
      'esri/config',
      'esri/core/watchUtils',
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/Layer',
      'esri/layers/FeatureLayer',
      'esri/layers/MapImageLayer',
      'esri/widgets/Expand',
      'esri/widgets/Legend',
      'esri/widgets/LayerList',
      'esri/widgets/Search'
    ],
    (
      esriConfig,
      watchUtils,
      MapView,
      Map,
      Layer,
      FeatureLayer,
      MapImageLayer,
      Expand,
      Legend,
      LayerList,
      Search
    ) => {
      esriConfig.request.corsEnabledServers.push('https://60.169.69.3:6443')
      // 初始化
      // 1.定义地图
      const map = new Map({
        basemap: 'satellite'
      })
      // 2.实例化view
      const view = new MapView({
        map: map,
        container: 'viewDiv',
        zoom: 16,
        center: [118.34134161472322, 31.05292479440629]
      })
      // 3.加载专题遥感图，默认加载N分布
      var ntrLayer = new MapImageLayer({
        url: 'https://60.169.69.3:6443/arcgis/rest/services/ImageService/RS_image/MapServer',
        id: 'image',
        title: '影像',
        sublayers: [
          {
            id: 0,
            visible: false,
            title: '磷(P)分布'
          }, {
            id: 1,
            visible: false,
            title: '氮(N)分布'
          }, {
            id: 2,
            visible: false,
            title: '钾(K)分布'
          }, {
            id: 3,
            visible: true,
            title: '卫星图'
          }, {
            id: 4,
            visible: false,
            title: '田块边界'
          }, {
            id: 5,
            visible: false,
            title: '田块钾(K)分布'
          }]
      })
      map.add(ntrLayer)
      // 4.加载平铺镇边界图层
      var bounds = new FeatureLayer({
        url: 'https://60.169.69.3:6443/arcgis/rest/services/FeatureService/FeatureService/FeatureServer/1',
        title: '平铺镇边界'
      })
      map.add(bounds)  // adds the layer to the map

      view.then(() => {
        const legend = new Legend({
          view: view,
          container: document.createElement('div')
        })
        const layerList = new LayerList({
          view: view,
          container: document.createElement('div')
        })
        const legendExpand = new Expand({
          view: view,
          content: legend.domNode,
          expandIconClass: 'esri-icon-collection',
          expandTooltip: 'Legend'
        })
        const layersExpand = new Expand({
          view: view,
          content: layerList.domNode,
          expandIconClass: 'esri-icon-layer-list',
          expandTooltip: 'Layers'
        })
        view.ui.add(layersExpand, 'top-right')
        view.ui.add(legendExpand, 'top-right')
      })
      const searchWidget = new Search({
        view: view
      })
      view.ui.add(searchWidget, {
        position: 'top-left',
        index: 0
      })
      watchUtils.whenTrue(view, 'stationary', () => {
        callback && callback(map, view)
      })
    }
  )
}
