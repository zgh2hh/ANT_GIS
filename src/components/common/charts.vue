<template>
  <div>
    <div class='esri-widget-button esri-widget esri-interactive' role="button" @click='_show()'>
      <span class='esri-collapse__icon esri-icon-chart'></span>
    </div>
    <el-dialog title="统计" :visible.sync="dialogVisible" size="small">
      <span>这是一段信息</span>
      <div style='text-align:center'>
        <chart :options="bar" ref="bar" auto-resize></chart>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

export default {
  name: 'charts',
  components: {
    chart: ECharts
  },
  props: {},
  data () {
    return {
      dialogVisible: false,
      bar: {
        title: {
          text: '异步数据加载示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {
          axisLabel: {show: false}
        },
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }
    }
  },
  methods: {
    _show () {
      this.dialogVisible = true
      // alert(1)
      // this.$store.state.index.view.goTo([118.34134161472322, 31.05292479440629])
    }
  },
  created () {
    // let bar = this.$refs.bar
    // bar.showLoading({
    //   text: '正在加载',
    //   color: '#4ea397',
    //   maskColor: 'rgba(255, 255, 255, 0.4)'
    // })
  }
}
</script>

<style scoped>
</style>
