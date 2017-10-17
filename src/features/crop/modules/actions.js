// import * as types from './mutationTypes'

/** 作物分类分级渲染 */
export const gradeCrops = ({commit, state, rootState}, parmas) => {
  return new Promise((resolve, reject) => {
    const {map, view, ESRI} = rootState.index
    // 移除已经加载的crops
    let crops = map.findLayerById('crops')
    // 移除已经加载的所有田块
    let draw = map.findLayerById('draw')
    // 移除图层
    crops && map.remove(crops)
    draw && map.remove(draw)
    // 移除legend
    view.ui.empty('bottom-left')
    let {layer} = parmas
    // layer.definitionExpression = 'field_id in (11349, 11285, 11292, 11262, 11267)'
    // 添加新图层
    map.add(layer)

    let legend = new ESRI.Legend({
      view: view,
      layerInfos: [
        {
          layer: layer,
          title: `作物分类专题图`
        }]
    })

    // 添加图例
    view.then(() => {
      view.ui.add(legend, 'bottom-left')
    })
  })
}
