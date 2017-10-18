<template>
  <div class="esri-widget esri-widget--panel">
    <div class="box">
      <div class="item" @click="toggleTopicMap('crops')">作物分类</div>
      <div class="item">土壤养分</div>
      <div class="item">病虫害</div>
      <div class="item">长势</div>
      <div class="item">单产估算</div>
      <div class="item">成熟期预测</div>
      <div class="item">旱情</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'topicMap',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    toggleTopicMap (type) {
      switch (type) {
        case 'crops':
          this.$store.commit('TOGGLE_TOPIC_MAP', {topicMap: type})
          break
        default:
          console.log('default')
      }
    }
  }
}
</script>

<style scoped>
.box .item{
  display: inline-block;
  width: 5.2rem;
  height: 2rem;
  margin-bottom: 3px;
  line-height: 2rem;
  border: 1px solid #3e3e3e;
  background: #f2f2f2;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
