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
/** 认领框是否展示 */
export const showClaim = (state) => {
  return state.claimVisible
}
/** 获取田块信息 **/
export const field = (state) => {
  return state.fieldDetail
}
/** 所画田块**/
export const selectedFieldsFeatures = (state) => {
  return state.spatialQuery.selectedFields
}
/** 所画田块id对应的users**/
export const selectedUserFeatures = (state) => {
  return state.spatialQuery.selectedUsers
}
