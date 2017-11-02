import Vue from 'vue'
import * as types from './mutationTypes'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  map: null,
  view: null,
  query: null,
  current: 'N',
  editVisible: false,
  claimVisible: false,
  triggerAction: null,
  fieldDetail: {
    attributes: {},
    geometry: {}
  },
  ESRI: null,
  spatialQuery: {
    selectedFields: null,
    selectedUsers: []
  }
}

const mutations = {
  [types.SAVE_ESRI_MAP] (state, payload) {
    state.map = payload.map
    state.view = payload.view
    state.query = payload.query
  },
  [types.GET_CURRENT_DIST] (state, payload) {
    state.current = payload.current
  },
  [types.TOGGLE_EDIT] (state, payload) {
    state.editVisible = !state.editVisible
  },
  [types.TOGGLE_CLAIM] (state, payload) {
    state.claimVisible = !state.claimVisible
  },
  [types.SAVE_TRIGGER_ACTION] (state, payload) {
    state.triggerAction = payload.triggerAction
  },
  [types.GET_FIELD_DETAIL] (state, payload) {
    state.fieldDetail.attributes = payload.fieldDetail.attributes
    state.fieldDetail.geometry = payload.fieldDetail.geometry
  },
  [types.SAVE_ESRI_CLASS] (state, payload) {
    state.ESRI = payload
  },
  [types.QUERY_FIELD_BY_POLYGON] (state, payload) {
    state.spatialQuery.selectedFields = Object.assign({}, state.spatialQuery.selectedFields, payload.features)
  },
  [types.QUERY_USERNAME_BY_FIELDID] (state, payload) {
    // 一个田块对应一条记录，不管有多少所属用户
    Vue.set(state.spatialQuery.selectedUsers, state.spatialQuery.selectedUsers.length, {
      fieldId: payload.fieldId,
      features: payload.features,
      geometry: payload.geometry
    })
  },
  [types.CLEAR_SELECTED_RECORDS] (state, payload) {
    state.spatialQuery = Object.assign({}, {
      selectedFields: null,
      selectedUsers: []
    })
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}
