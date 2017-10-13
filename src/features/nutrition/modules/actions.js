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
      resolve(ESRI)
    })
  })
}

/** 根据多边形查询feature */
export const queryFieldsByGeometry = ({commit, state}, parmas) => {
  let {featureLyr, geometry} = parmas
  let query = featureLyr.createQuery()
  query.where = '1 = 1'
  query.geometry = geometry
  query.spatialRelationship = 'intersects'
  query.returnGeometry = true
  return new Promise((resolve, reject) => {
    featureLyr.queryFeatures(query).then((results) => {
      commit(types.QUERY_FIELD_BY_POLYGON, {
        'features': results.features
      })
      resolve(results)
    }, (err) => {
      reject(err)
    })
  })
}

/** 根据fieldId查询username */
export const queryUsernameByFieldId = ({commit, state}, parmas) => {
  let {featureLyr, fieldId, geometry} = parmas
  const { ESRI } = state
  let center = new ESRI.Point(geometry.centroid)
  let query = featureLyr.createQuery()
  query.where = 'field_id = ' + fieldId
  query.outFields = ['*']
  return new Promise((resolve, reject) => {
    featureLyr.queryFeatures(query).then((results) => {
      commit(types.QUERY_USERNAME_BY_FIELDID, {
        'features': results.features,
        'fieldId': fieldId,
        'geometry': center
      })
      resolve(results)
    }, (err) => {
      reject(err)
    })
  })
}

/** 根据新增要素，fieldid对应username中对应记录 */
export const addFeatures = ({commit, state}, parmas) => {
  let {fieldId2Username, addFeatures} = parmas
  return new Promise((resolve, reject) => {
    fieldId2Username.applyEdits({
      addFeatures: [...addFeatures]
    }).then((result) => {
      resolve(result)
    }, (err) => {
      reject(err)
    })
  })
}

/** 根据编辑username中对应记录 */
export const editFeatures = ({commit, state}, parmas) => {
  let {fieldId2Username, editFeatures} = parmas
  return new Promise((resolve, reject) => {
    fieldId2Username.applyEdits({
      updateFeatures: [...editFeatures]
    }).then((result) => {
      resolve(result)
    }, (err) => {
      reject(err)
    })
  })
}
