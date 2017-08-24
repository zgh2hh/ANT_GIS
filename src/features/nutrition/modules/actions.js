import * as types from './mutationTypes'
import * as esriLoader from 'esri-loader'
import {computeDist} from '../components/distribution'
import { loadEsri } from '../components/init'

/** 地图分类分级渲染 */
export const classify = ({commit, state}, parmas) => {
  return new Promise((resolve, reject) => {
    computeDist(esriLoader, parmas.tp, (layer, Legend) => {
      let {map, view} = state
      // 移除已经加载的N、P、K
      let k = map.findLayerById('k')
      let n = map.findLayerById('n')
      let p = map.findLayerById('p')
      // 移除图层
      k && map.remove(k)
      n && map.remove(n)
      p && map.remove(p)
      // 移除legend
      view.ui.empty('bottom-left')

      // 添加新图层
      map.add(layer)
      // resolve(layer)

      let legend = new Legend({
        view: view,
        layerInfos: [
          {
            layer: layer,
            title: `平铺农田${state.current}分布`
          }]
      })

      view.then(() => {
        view.ui.add(legend, 'bottom-left')
      })
      let popup = view.popup
      var evt = state.triggerAction
      if (!evt) {
        // evt.remove()
        evt = popup.viewModel.on('trigger-action', function (event) {
          if (event.action.id === 'edit') {
            commit(types.TOGGLE_EDIT)
            let selected = popup.viewModel.selectedFeature
            commit(types.GET_FIELD_DETAIL, {
              fieldDetail: selected
            })
          }
        })
        commit(types.SAVE_TRIGGER_ACTION, {
          triggerAction: evt
        })
      }
    })
  })
}

/** 地图分类分级渲染 */
export const saveEsri = ({commit, state}, parmas) => {
  return new Promise((resolve, reject) => {
    loadEsri((ESRI) => {
      commit(types.SAVE_ESRI_CLASS, ESRI)
    })
  })
}
