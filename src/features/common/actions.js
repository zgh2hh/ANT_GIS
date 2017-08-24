import axios from 'axios'
import * as types from './mutationTypes'
import config from '@/config/config'

/** 获取用户信息 */
export const loadLayers = ({commit}, parmas) => {
  return new Promise((resolve, reject) => {
    axios.get(config.getUrl())
        .then(response => {
          const layers = response.data.results
          commit(types.ADD_LAYERS, layers)
        })
        .catch(error => console.log(error))
  })
}

