import axios from 'axios'
import * as types from './mutationTypes'
import config from '@/config/config'

/** 获取用户信息 */
export const loadLayers = ({ commit }, parmas) => {
  return new Promise((resolve, reject) => {
    axios.get(config.getUrl())
      .then(response => {
        const layers = response.data.results
        commit(types.ADD_LAYERS, layers)
      })
      .catch(error => console.log(error))
  })
}

/** 发送短信验证码 **/
export const sendCode = ({ commit }, data) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: 'http://www.qmant.com/noa/send_code',
      params: {
        phone: data.mobile,
        type: '4'
      }
    }).then((res) => {
      resolve(res.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 验证code **/
export const checkCaptcha = ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: 'http://www.qmant.com/noa/check_code',
      params: {
        code: params.code,
        phone: params.username,
        op: 1
      }
    }).then((res) => {
      if (res.data.code === 20000) {
        commit(types.CHECK_CODE, res.data.data)
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}

/** 退出登录 **/
export const quitLogin = ({ commit }, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: 'http://www.qmant.com/noa/logout'
    }).then((res) => {
      if (res.data.code === 20000) {
        resolve(res.data)
      } else {
        reject(res)
      }
    }).catch((error) => {
      reject(error)
    })
  })
}
