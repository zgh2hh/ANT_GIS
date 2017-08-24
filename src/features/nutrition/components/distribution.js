import { getConfig } from '../config'
/**
 * @param loader  esriloader
 * @param type 统计类型：N P K
 * @param callback 回调
*/
export const computeDist = function (loader, type, callback) {
  const esriLoader = loader
  esriLoader.dojoRequire(
    [
      'esri/config',
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/renderers/ClassBreaksRenderer',
      'esri/symbols/SimpleFillSymbol',
      'esri/widgets/Legend',
      'esri/layers/support/LabelClass',
      'esri/symbols/TextSymbol',
      'dojo/domReady!'
    ],
    (
      esriConfig,
      Map,
      MapView,
      FeatureLayer,
      ClassBreaksRenderer,
      SimpleFillSymbol,
      Legend,
      LabelClass,
      TextSymbol
    ) => {
      // esriConfig.request.corsEnabledServers.push("http://60.169.69.3:6443");
      // esriConfig.request.corsEnabledServers.push("http://60.169.69.3:9980");

      /*****************************************************************
       * Define symbols for each class break.
       *****************************************************************/
      let config = getConfig(type)

      var level1 = new SimpleFillSymbol({
        color: '#E6B8DF',
        style: 'solid',
        outline: {
          width: 0.5,
          color: 'white'
        }
      })

      var level2 = new SimpleFillSymbol({
        color: '#EB8DC7',
        style: 'solid',
        outline: {
          width: 0.5,
          color: 'white'
        }
      })

      var level3 = new SimpleFillSymbol({
        color: '#ED66AC',
        style: 'solid',
        outline: {
          width: 0.5,
          color: 'white'
        }
      })

      var level4 = new SimpleFillSymbol({
        color: '#F03E91',
        style: 'solid',
        outline: {
          width: 0.5,
          color: 'white'
        }
      })

      var level5 = new SimpleFillSymbol({
        color: '#F20C70',
        style: 'solid',
        outline: {
          width: 0.5,
          color: 'white'
        }
      })

      /*****************************************************************
       * Set each unique value directly in the renderer's constructor.
       * At least one field must be used (in this case the "COL_DEG" field).
       * The label property of each unique value will be used to indicate
       * the field value and symbol in the legend.
       *****************************************************************/

      var renderer = new ClassBreaksRenderer({
        field: config.calcuField,
        // normalizationField: "EDUCBASECY",
        defaultSymbol: new SimpleFillSymbol({
          color: 'gray',
          outline: {
            width: 0.5,
            color: 'white'
          }
        }),
        defaultLabel: 'no data',
        classBreakInfos: [
          {
            minValue: config.classBreak[0].min,
            maxValue: config.classBreak[0].max,
            symbol: level1,
            label: config.classBreak[0].label
          }, {
            minValue: config.classBreak[1].min,
            maxValue: config.classBreak[1].max,
            symbol: level2,
            label: config.classBreak[1].label
          }, {
            minValue: config.classBreak[2].min,
            maxValue: config.classBreak[2].max,
            symbol: level3,
            label: config.classBreak[2].label
          }, {
            minValue: config.classBreak[3].min,
            maxValue: config.classBreak[3].max,
            symbol: level4,
            label: config.classBreak[3].label
          }, {
            minValue: config.classBreak[4].min,
            maxValue: config.classBreak[4].max,
            symbol: level5,
            label: config.classBreak[4].label
          }]
      })

      var labelClass = new LabelClass({
        labelExpressionInfo: { value: '{FIELD_NAME} , {K_MEAN}' },
        symbol: new TextSymbol({
          color: 'black',
          haloColor: 'red',
          haloSize: '5px'
        })
      })

      // var textSymbol = new TextSymbol({
      //   color: 'white',
      //   haloColor: 'black',
      //   haloSize: '1px',
      //   text: 'You are here',
      //   xoffset: 3,
      //   yoffset: 3,
      //   font: {  // autocast as esri/symbols/Font
      //     size: 12,
      //     family: 'sans-serif',
      //     weight: 'bolder'
      //   }
      // })

      var pingPuLyr = new FeatureLayer({
        id: config.id,
        url: 'https://60.169.69.3:6443/arcgis/rest/services/FeatureService/FeatureService/FeatureServer/0',
        renderer: renderer,
        outFields: ['*'],
        popupTemplate: { // autocast as esri/PopupTemplate
          title: '{' + config.fieldName + '}',
          content: '{' + config.fieldName + '} 平均含' + config.cnName + '/' + config.name + '量 ' +
          '{' + config.calcuField + '} ',
          actions: [{
            id: 'edit',
            title: '编辑'
          }]
        },
        labelsVisible: true,
        labelingInfo: [labelClass],
        title: '田块'
      })

      callback && callback(pingPuLyr, Legend)
    }
  )
}
