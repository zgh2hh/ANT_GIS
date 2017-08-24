import * as esriLoader from 'esri-loader'

export function loadEsri (callback) {
  esriLoader.dojoRequire(
    [
      'esri/config',
      'esri/core/watchUtils',
      'esri/views/MapView',
      'esri/Map',
      'esri/layers/Layer',
      'esri/layers/FeatureLayer',
      'esri/tasks/support/Query',
      'esri/layers/MapImageLayer',
      'esri/widgets/Expand',
      'esri/widgets/Legend',
      'esri/widgets/LayerList',
      'esri/widgets/Search',
      'esri/renderers/ClassBreaksRenderer',
      'esri/symbols/SimpleFillSymbol',
      'esri/layers/support/LabelClass',
      'esri/symbols/TextSymbol',
      'esri/Graphic',
      'esri/geometry/geometryEngine',
      'esri/geometry/Polygon',
      'dojo/domReady!'
    ],
  (
    esriConfig,
    watchUtils,
    MapView,
    Map,
    Layer,
    FeatureLayer,
    Query,
    MapImageLayer,
    Expand,
    Legend,
    LayerList,
    Search,
    ClassBreaksRenderer,
    SimpleFillSymbol,
    LabelClass,
    TextSymbol,
    Graphic,
    geometryEngine,
    Polygon
  ) => {
    callback({
      esriConfig,
      watchUtils,
      MapView,
      Map,
      Layer,
      FeatureLayer,
      Query,
      MapImageLayer,
      Expand,
      Legend,
      LayerList,
      Search,
      ClassBreaksRenderer,
      SimpleFillSymbol,
      LabelClass,
      TextSymbol,
      Graphic,
      geometryEngine,
      Polygon
    })
  })
}
