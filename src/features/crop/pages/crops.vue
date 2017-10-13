<template>

</template>

<script>
import store from '@/store'
import modules from '../modules/store'
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
    classifyCrops () {
      console.log('-------------------分级作物成功------------------------')
    }
  },
  mounted () {

  },
  watch: {
    // 监控传入的topicMap值
    'topicMap': function (val, oldVal) {
      if (val === 'crops') {
        // 分级
        this.classifyCrops()
      }
    }
  }
}
</script>

<style scoped>

</style>
