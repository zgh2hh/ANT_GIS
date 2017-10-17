import * as types from './mutationTypes'
import { loadEsri } from '../components/init'

/** 保存ESRI类 */
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
