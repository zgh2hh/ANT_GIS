// import * as types from './mutationTypes'

/** 作物分类分级渲染 */
export const gradeCrops = ({commit, state, rootState, getters}, parmas) => {
  return new Promise((resolve, reject) => {
    const {view, ESRI} = rootState.index
    let {climedFieldsIds} = getters
    let {layer, render} = parmas
    let type = rootState.common.mode
    layer.renderer = render
    if (type === '大户模式') {
      layer.definitionExpression = 'field_id in (' + climedFieldsIds.join() + ')'
      // commit('TOGGLE_MODE', {
      //   mode: '大户模式'
      // })
    } else {
      layer.definitionExpression = ''
      // commit('TOGGLE_MODE', {
      //   mode: '地区模式'
      // })
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
    })
  })
}
