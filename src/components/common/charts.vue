<template>
  <div>
    <div class='esri-widget-button esri-widget esri-interactive' role="button" @click='_show()'>
      <span class='esri-collapse__icon esri-icon-chart'></span>
    </div>
    <el-dialog title="统计" :visible.sync="dialogVisible" size="tiny">
      <div style='text-align:center'>
        <chart :options="bar" ref="bar" auto-resize style="height:300px;width:400px;"></chart>
      </div>
      <div style='text-align:center;'>
        <chart :options="pie" ref="pie" auto-resize style="height:300px;width:400px;"></chart>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'

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
      },
      pie: {
        title: {
          text: '饼图程序调用高亮示例',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
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
    axios.get('http://192.168.1.117:9090/api/findCropArea').then((res) => {

    })
    // let bar = this.$refs.bar
    // bar.showLoading({
    //   text: '正在加载',
    //   color: '#4ea397',
    //   maskColor: 'rgba(255, 255, 255, 0.4)'
    // })
  }
}
</script>
