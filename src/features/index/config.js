
const NCONFIG = {
  id: 'n',
  name: 'n',
  cnName: '氮',
  fieldName: 'FIELD_NAME',
  calcuField: 'N',
  classBreak: [
    {
      min: 0,
      max: 45.9999,
      label: '< 46'
    }, {
      min: 46,
      max: 92.9999,
      label: '46 - 93'
    }, {
      min: 93,
      max: 117.9999,
      label: '93 - 118'
    }, {
      min: 118,
      max: 136.9999,
      label: '118 - 137'
    }, {
      min: 137,
      max: 999,
      label: '> 137'
    }
  ]
}

const PCONFIG = {
  id: 'p',
  name: 'p',
  cnName: '磷',
  fieldName: 'FIELD_NAME',
  calcuField: 'P_MEAN',
  classBreak: [
    {
      min: 0,
      max: 4.9999,
      label: '< 5'
    }, {
      min: 5,
      max: 8.9999,
      label: '5 - 9'
    }, {
      min: 9,
      max: 11.9999,
      label: '9 - 12'
    }, {
      min: 12,
      max: 13.9999,
      label: '12 - 14'
    }, {
      min: 14,
      max: 999,
      label: '> 14'
    }
  ]
}

const KCONFIG = {
  id: 'k',
  name: 'k',
  cnName: '钾',
  fieldName: 'FIELD_NAME',
  calcuField: 'K_MEAN',
  classBreak: [
    {
      min: 0,
      max: 15.9999,
      label: '< 16'
    }, {
      min: 16,
      max: 40.9999,
      label: '16 - 41'
    }, {
      min: 41,
      max: 58.9999,
      label: '41 - 59'
    }, {
      min: 59,
      max: 72.9999,
      label: '59 - 73'
    }, {
      min: 73,
      max: 999,
      label: '> 73'
    }
  ]
}

export const getConfig = (type) => {
  if (type === 'N') {
    return NCONFIG
  } else if (type === 'P') {
    return PCONFIG
  } else if (type === 'K') {
    return KCONFIG
  }
}
