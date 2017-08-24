/** 获取N分布 */
export const N = (state) => state.N
/** 获取P分布 */
export const P = (state) => state.P
/** 获取K分布 */
export const K = (state) => state.K
/** 编辑框是否展示 **/
export const showEdit = (state) => {
  return state.editVisible
}
/** 获取田块信息 **/
export const field = (state) => {
  return state.fieldDetail
}
