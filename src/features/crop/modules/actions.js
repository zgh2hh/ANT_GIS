// import * as types from './mutationTypes'

/** 作物分类分级渲染 */
export const gradeCrops = ({commit, state, rootState, getters}, parmas) => {
  return new Promise((resolve, reject) => {
    const {view, ESRI} = rootState.index
    let {layer, render} = parmas
    let type = rootState.common.mode
    layer.renderer = render
    if (type === '大户模式') {
      let {climedFieldsIds} = getters
      layer.definitionExpression = 'field_id in (' + climedFieldsIds.join() + ')'
    } else {
      layer.definitionExpression = ''
    }

    // 移除legend
    view.ui.empty('bottom-left')
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
      resolve('success')
    })
  })
}

/** 加载遥感影像 */
export const loadRemoteSensingMap = ({commit, state, rootState, getters}, parmas) => {
  return new Promise((resolve, reject) => {
    const {map, view, ESRI} = rootState.index
    // 作物遥感影像
    let rsImageLayerSet = map.findLayerById('image')
    let cropTypeRsLayer = rsImageLayerSet.allSublayers.find(function (sublayer) {
      return sublayer.id === 6
    })
    cropTypeRsLayer.visible = true

    // 移除legend
    view.ui.empty('bottom-left')
    let legend = new ESRI.Legend({
      view: view,
      layerInfos: [
        {
          layer: cropTypeRsLayer,
          title: `作物分类专题图`
        }]
    })

    // 添加图例
    view.then(() => {
      view.ui.add(legend, 'bottom-left')
      resolve('success')
    })
  })
}

/** 加载遥感影像 */
export const resetAllLayer = ({commit, state, rootState, getters}, parmas) => {
  return new Promise((resolve, reject) => {
    const {map, view} = rootState.index
    let {render} = parmas
    // 田块
    let draw = map.findLayerById('draw')
    draw.renderer = render
    // 作物遥感影像
    let rsImageLayerSet = map.findLayerById('image')
    let cropTypeRsLayer = rsImageLayerSet.allSublayers.find(function (sublayer) {
      return sublayer.id === 6
    })
    cropTypeRsLayer.visible = false

    // 移除legend
    view.ui.empty('bottom-left')
    resolve('success')
  })
}
