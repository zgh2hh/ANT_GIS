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
    })
  })
}

/** 切换底图 */
export const switchBaseMap = ({commit, state, rootState, getters}, parmas) => {
  return new Promise((resolve, reject) => {
    const {view, ESRI} = rootState.index
    let {climedFieldsIds} = getters
    let {layer, render} = parmas
    let type = rootState.common.mode
    layer.renderer = render
    if (type === '大户模式') {
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
    })
    // 保存当前专题图
    commit('TOGGLE_TOPIC_MAP', {
      topicMap: 'crops'
    })
  })
}
