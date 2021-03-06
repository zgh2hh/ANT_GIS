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
      'esri/renderers/SimpleRenderer',
      'esri/symbols/TextSymbol',
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
      SimpleRenderer,
      TextSymbol,
      Expand,
      Legend,
      LayerList,
      Search
    ) => {
      esriConfig.request.corsEnabledServers.push('https://60.169.69.3:6443')
      // 初始化
      // 1.定义地图
      const map = new Map({
        // basemap: 'gray'
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
        visible: true,
        sublayers: [// id顺序必须为倒序，否则影像不能同时展示，只能展示一个
          {
            id: 6,
            visible: false,
            title: '作物分类影像'
          },
          {
            id: 5,
            visible: false,
            title: '钾(K)分布'
          }, {
            id: 4,
            visible: false,
            title: '磷(P)分布'
          }, {
            id: 3,
            visible: false,
            title: '氮(N)分布'
          }, {
            id: 2,
            visible: false,
            title: '卫星图'
          }, {
            id: 1,
            visible: false,
            title: '田块钾(K)分布'
          }, {
            id: 0,
            visible: false,
            title: '田块边界'
          }]
      })
      map.add(ntrLayer)
      // 4.加载平铺镇边界图层
      var bounds = new FeatureLayer({
        url: 'https://60.169.69.3:6443/arcgis/rest/services/FeatureService/FeatureService/FeatureServer/1',
        title: '平铺镇边界'
      })
      map.add(bounds)  // adds the layer to the map
      // 5.加载平铺和许镇所有田块
      var draw = new FeatureLayer({
        id: 'draw',
        title: '田块',
        url: 'https://60.169.69.3:6443/arcgis/rest/services/FeatureService/FeatureService/FeatureServer/2',
        outFields: ['*'],
        popupTemplate: { // autocast as esri/PopupTemplate
          title: '<font color="#008000">田块详情',
          content: [
            {
              type: 'fields',
              fieldInfos: [{
                fieldName: 'field_name',
                visible: true,
                label: '田块名称'
              }, {// 折腾好久，艹
                fieldName: 'relationships/0/cn_name',
                visible: true,
                label: '大户',
                statisticType: 'min'
              }, {// 折腾好久，艹
                fieldName: 'relationships/0/user_name',
                visible: true,
                label: '电话',
                statisticType: 'min'
              }, {
                fieldName: 'area_size',
                visible: true,
                label: '田块面积'
              }, {// 折腾好久，艹
                fieldName: 'relationships/1/crop_name',
                visible: true,
                label: '当前种植作物',
                statisticType: 'min'
              }]
            }
          ]
        }
      })
      map.add(draw)

      var renderer = new SimpleRenderer({
        // Define a default Text symbol. This
        symbol: new TextSymbol({
          color: 'white',
          haloColor: 'black',
          haloSize: '1px',
          text: '已认领',
          xoffset: 0,
          yoffset: 0,
          font: {
            size: 10,
            family: 'Arial',
            weight: 'bolder'
          }
        }),
        label: 'asd'
      })
      // 6.加载田块id与username对应表
      var fieldId2Username = new FeatureLayer({
        id: 'id2username',
        title: '已认领',
        url: 'https://60.169.69.3:6443/arcgis/rest/services/FeatureService/FeatureService/FeatureServer/3',
        outFields: ['user_name', 'cn_name', 'objectid', 'field_id'],
        objectIdField: 'field_id',
        renderer: renderer
      })
      map.add(fieldId2Username)
      // 7.加载user表信息，登陆后保存用户信息
      var user = new FeatureLayer({
        id: 'user',
        title: '用户信息',
        url: 'https://60.169.69.3:6443/arcgis/rest/services/FeatureService/FeatureService/FeatureServer/5',
        outFields: ['*'],
        objectIdField: 'user_id'
      })
      map.add(user)

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
      // const searchWidget = new Search({
      //   view: view
      // })
      // view.ui.add(searchWidget, {
      //   position: 'top-left',
      //   index: 0
      // })
      watchUtils.whenTrue(view, 'stationary', () => {
        callback && callback(map, view)
      })
    }
  )
}
