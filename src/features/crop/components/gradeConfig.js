const CROPS_GRADE_CONFIG = {
  id: 'crops',
  name: 'crops',
  cnName: '作物分类',
  fieldName: 'FIELD_NAME',
  calcuField: 'CROP_ID',
  classBreak: [{
    min: 1,
    max: 1,
    label: '水稻',
    color: '#E6B8DF'
  }, {
    min: 2,
    max: 2,
    label: '小麦',
    color: '#EB8DC7'
  }, {
    min: 3,
    max: 3,
    label: '油菜',
    color: '#ED66AC'
  }, {
    min: 0,
    max: 0.99,
    label: '未知',
    color: 'gray'
  }]
}
export {CROPS_GRADE_CONFIG}
