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
      'esri/renderers/ClassBreaksRenderer',
      'esri/renderers/SimpleRenderer',
      'esri/symbols/SimpleFillSymbol',
      'esri/layers/support/LabelClass',
      'esri/symbols/TextSymbol',
      'esri/Graphic',
      'esri/geometry/geometryEngine',
      'esri/geometry/Point',
      'esri/geometry/Polygon',
      'esri/tasks/QueryTask',
      'esri/tasks/support/RelationshipQuery',
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
    ClassBreaksRenderer,
    SimpleRenderer,
    SimpleFillSymbol,
    LabelClass,
    TextSymbol,
    Graphic,
    geometryEngine,
    Point,
    Polygon,
    QueryTask,
    RelationshipQuery
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
      ClassBreaksRenderer,
      SimpleRenderer,
      SimpleFillSymbol,
      LabelClass,
      TextSymbol,
      Graphic,
      geometryEngine,
      Point,
      Polygon,
      QueryTask,
      RelationshipQuery
    })
  })
}
