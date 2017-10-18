<template>
  <div class="esri-widget esri-widget--panel">
    <div class="box">
      <div class="item" @click="toggleMap(type.gradeMap)">分级统计图</div>
      <div class="item" @click="toggleMap(type.fieldGradeMap)">按田块分级统计图</div>
      <div class="item" @click="toggleMap(type.rsMap)">原始遥感监测图</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'switchMap',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      type: {
        fieldGradeMap: 'fieldGradeMap',
        rsMap: 'rsMap',
        gradeMap: 'gradeMap'
      }
    }
  },
  methods: {
    toggleMap (type) {
      this.$store.commit('TOGGLE_BASE_MAP', {baseMap: type})
    }
  }
}
</script>

<style scoped>
.box .item{
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
