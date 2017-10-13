import * as types from './mutationTypes'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  gradeTopicMap: ''
}

const mutations = {
  [types.TOGGLE_TOPIC_MAP] (state, payload) {
    state.gradeTopicMap = payload.topicMap
  }
}

export default {
  actions,
  state,
  getters,
  mutations
}
