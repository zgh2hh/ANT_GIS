<template>

</template>

<script>
import store from '@/store'
import modules from '../modules/store'
import { mapActions } from 'vuex'
import { CROPS_GRADE_CONFIG } from '../components/gradeConfig'

// 注册crops的modules
if (!store.state.crops) {
  store.registerModule('crops', {
    ...modules
  })
}
/**
 * crops组件
*/
export default {
  name: 'crops',
  props: {
    topicMap: {
      type: String,
      default: null
    },
    baseMap: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      rice: {
        label: '水稻',
        value: 1
      },
      wheat: {
        label: '小麦',
        value: 2
      }
    }
  },
  methods: {
    ...mapActions(['gradeCrops', 'loadRemoteSensingMap', 'resetAllLayer']),
    classifyCrops () { // 作物分类
      const { map } = this.$store.state.index
      let draw = map.findLayerById('draw')
      return this.gradeCrops({
        layer: draw,
        render: this.createRender()
      })
    },
    loadRsImage () { // 切换遥感底图
      return this.loadRemoteSensingMap()
    },
    resetLayer () {
      return this.resetAllLayer({
        render: this.createSimpleRender()
      })
    },
    createRender () {
      const { ESRI } = this.$store.state.index
      const config = CROPS_GRADE_CONFIG
      let that = this

      return new ESRI.ClassBreaksRenderer({
        field: config.calcuField,
        defaultSymbol: new ESRI.SimpleFillSymbol({
          color: 'gray',
          outline: {
            width: 0.5,
            color: 'white'
          }
        }),
        defaultLabel: '未知',
        classBreakInfos: [
          {
            minValue: config.classBreak[0].min,
            maxValue: config.classBreak[0].max,
            symbol: that.createSimpleFill(config.classBreak[0].color),
            label: config.classBreak[0].label
          }, {
            minValue: config.classBreak[1].min,
            maxValue: config.classBreak[1].max,
            symbol: that.createSimpleFill(config.classBreak[1].color),
            label: config.classBreak[1].label
          }, {
            minValue: config.classBreak[2].min,
            maxValue: config.classBreak[2].max,
            symbol: that.createSimpleFill(config.classBreak[2].color),
            label: config.classBreak[2].label
          }]
      })
    },
    createSimpleRender () {
      const { ESRI } = this.$store.state.index
      return new ESRI.SimpleRenderer({
        symbol: this.createSimpleFill([0, 255, 255, 0.1])
      })
    },
    createSimpleFill (color = 'gray') {
      const {ESRI} = this.$store.state.index
      return new ESRI.SimpleFillSymbol({
        color: color,
        style: 'solid',
        outline: {
          width: 0.5,
          color: 'white'
        }
      })
    }
  },
  mounted () {

  },
  watch: {
    // 监控传入的topicMap值
    'topicMap': function (val, oldVal) {
      if (val === 'crops') {
        this.resetLayer().then(() => {
          if (this.baseMap === 'gradeMap') { // 分级统计图
            // 田块内部分级

          } else if (this.baseMap === 'fieldGradeMap') { // 按田块分级统计图
            this.classifyCrops()
          } else if (this.baseMap === 'rsMap') { // 原始遥感监测图
            // 加载遥感影像
            this.loadRsImage()
          } else {
            this.resetLayer()
          }
        })
      }
    },
    // 监控传入的topicMap值
    'baseMap': function (val, oldVal) {
      if (this.topicMap === 'crops') {
        this.resetLayer().then(() => {
          if (val === 'gradeMap') { // 田块内部分级
            // 田块内部分级

          } else if (val === 'fieldGradeMap') { // 按田块分级统计图
            this.classifyCrops()
          } else if (val === 'rsMap') { // 原始遥感监测图
            // 加载遥感影像
            this.loadRsImage()
          } else {
            this.resetLayer()
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
