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
    ...mapActions(['gradeCrops']),
    classifyCrops () {
      let cropsLayer = this.initLayer()
      this.gradeCrops({
        layer: cropsLayer
      })
    },
    initLayer () {
      const { ESRI } = this.$store.state.index
      const config = CROPS_GRADE_CONFIG
      let renderer = this.createRender()
      return new ESRI.FeatureLayer({
        id: config.id,
        url: 'https://60.169.69.3:6443/arcgis/rest/services/FeatureService/FeatureService/FeatureServer/2',
        renderer: renderer,
        outFields: ['*'],
        popupTemplate: {
          title: '<font color="#008000">田块详情',
          content: [
            {
              type: 'fields',
              fieldInfos: [{
                fieldName: 'field_name',
                visible: true,
                label: '田块名称'
              }, {// 折腾好久，艹
                fieldName: 'relationships/0/cn_name',
                visible: true,
                label: '大户',
                statisticType: 'min'
              }, {// 折腾好久，艹
                fieldName: 'relationships/0/user_name',
                visible: true,
                label: '电话',
                statisticType: 'min'
              }, {
                fieldName: 'area_size',
                visible: true,
                label: '田块面积'
              }, {// 折腾好久，艹
                fieldName: 'relationships/1/crop_name',
                visible: true,
                label: '当前种植作物',
                statisticType: 'min'
              }]
            }
          ]
        },
        title: '作物分类'
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
        defaultLabel: 'no data',
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
        // 分级作物
        this.classifyCrops()
      }
    }
  }
}
</script>

<style scoped>

</style>
