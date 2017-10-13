<template>

</template>

<script>
import store from '@/store'
import modules from '../modules/store'
import { mapActions } from 'vuex'
// import { CROPS_GRADE_CONFIG } from '../components/gradeConfig'

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
      console.log('-------------------分级作物成功------------------------')
      this.gradeCrops()
    },
    createSimpleFill () {
      const {ESRI} = this.$store.state.index
      return new ESRI.SimpleFillSymbol({
        color: '#E6B8DF',
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
