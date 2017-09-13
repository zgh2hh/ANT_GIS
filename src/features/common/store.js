import * as types from './mutationTypes'
import * as actions from './actions'

const state = {
  user: {},
  allLayers: [],
  selectedLayers: []
}

const getters = {
  Route: (state, getters, rootState) => {
    return rootState.route
  },
  User: state => state.user,
  getAllLayers: state => state.allLayers,
  getSelectedLayers: state => state.selectedLayers
}

const mutations = {
  [types.ADD_LAYERS] (state, layers) {
    if (!state.allLayers.length) {
      layers.map((layer) => {
        state.allLayers.push({
          id: layer.id,
          title: layer.title,
          tags: layer.tags,
          selected: false
        })
      })
    }
  },
  [types.SELECT_LAYER] (state, layerId) {
    const layer = state.allLayers.find(layer => {
      return layer.id === layerId
    })
    layer.selected = true
    const selected = {
      id: layer.id,
      title: layer.title,
      tags: layer.tags,
      selected: true
    }
    state.selectedLayers.push(selected)
  },
  [types.DESELECT_LAYER] (state, layerId) {
    const layer = state.allLayers.find(layer => {
      return layer.id === layerId
    })
    layer.selected = false
    const selected = state.selectedLayers.find(layer => {
      return layer.id === layerId
    })
    state.selectedLayers.splice(state.selectedLayers.indexOf(selected), 1)
  },
  [types.CHECK_CODE] (state, data) {
    state.user = data
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}
