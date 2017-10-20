<template>
  <div class="esri-widget esri-widget--panel">
    <span class="mapType">专题图</span>
    <div class="topic-map box">
      <div v-bind:class="[topicMapStyle.selected === 'crops' ? topicMapStyle.active : '', topicMapStyle.item]" @click="toggleTopicMap(topicMap.crops)">作物分类</div>
      <div v-bind:class="[topicMapStyle.selected === 'nutrition' ? topicMapStyle.active : '', topicMapStyle.item]" @click="toggleTopicMap(topicMap.nutrition)">土壤养分</div>
      <div v-bind:class="[topicMapStyle.selected === 'pests' ? topicMapStyle.active : '', topicMapStyle.item]" @click="toggleTopicMap(topicMap.pests)">病虫害</div>
      <div v-bind:class="[topicMapStyle.selected === 'growStatus' ? topicMapStyle.active : '', topicMapStyle.item]" @click="toggleTopicMap(topicMap.growStatus)">长势</div>
      <div v-bind:class="[topicMapStyle.selected === 'yield' ? topicMapStyle.active : '', topicMapStyle.item]" @click="toggleTopicMap(topicMap.yield)">单产估算</div>
      <div v-bind:class="[topicMapStyle.selected === 'mature' ? topicMapStyle.active : '', topicMapStyle.item]" @click="toggleTopicMap(topicMap.mature)">成熟期预测</div>
      <div v-bind:class="[topicMapStyle.selected === 'drought' ? topicMapStyle.active : '', topicMapStyle.item]" @click="toggleTopicMap(topicMap.drought)">旱情</div>
    </div>
    <span class="mapType">切换图像</span>
    <div class="base-map box">
      <div v-bind:class="[baseMapStyle.selected === 'gradeMap' ? baseMapStyle.active : '', baseMapStyle.item]" @click="toggleBaseMap(baseMap.gradeMap)">分级统计图</div>
      <div v-bind:class="[baseMapStyle.selected === 'fieldGradeMap' ? baseMapStyle.active : '', baseMapStyle.item]" @click="toggleBaseMap(baseMap.fieldGradeMap)">按田块分级统计图</div>
      <div v-bind:class="[baseMapStyle.selected === 'rsMap' ? baseMapStyle.active : '', baseMapStyle.item]" @click="toggleBaseMap(baseMap.rsMap)">原始遥感监测图</div>
      <div v-bind:class="[baseMapStyle.selected === 'origin' ? baseMapStyle.active : '', baseMapStyle.item]" @click="toggleBaseMap(baseMap.origin)">原始图</div>
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
      topicMap: {
        crops: 'crops',
        nutrition: 'nutrition',
        pests: 'pests',
        growStatus: 'growStatus',
        yield: 'yield',
        mature: 'mature',
        drought: 'drought'
      },
      baseMap: {
        fieldGradeMap: 'fieldGradeMap',
        rsMap: 'rsMap',
        gradeMap: 'gradeMap',
        origin: 'origin'
      }
    }
  },
  computed: {
    topicMapStyle: function () {
      return {
        selected: this.$store.state.common.topicMap,
        active: 'active',
        item: 'item'
      }
    },
    baseMapStyle: function () {
      return {
        selected: this.$store.state.common.baseMap,
        active: 'active',
        item: 'item'
      }
    }
  },
  methods: {
    toggleTopicMap (topicMap) {
      this.$store.commit('TOGGLE_TOPIC_MAP', {topicMap: topicMap})
    },
    toggleBaseMap (baseMap) {
      this.$store.commit('TOGGLE_BASE_MAP', {baseMap: baseMap})
    }
  }
}
</script>

<style scoped>
.topic-map .item{
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

.base-map .item{
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

.active {
  background: #20a0ff !important;
  color: #FFF;
}

.mapType{
    display: block;
    width: 100%;
    text-align: center;
}
</style>
