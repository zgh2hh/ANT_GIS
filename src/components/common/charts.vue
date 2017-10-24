<template>
  <div>
    <div class='esri-widget-button esri-widget esri-interactive' role="button" @click='_show()'>
      <span class='esri-collapse__icon esri-icon-chart'></span>
    </div>
    <el-dialog title="统计" :visible.sync="dialogVisible" size="tiny">
      <div style='text-align:center'>
        <chart :options="bar" ref="bar" auto-resize style="height:300px;width:500px;"></chart>
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
          text: '各作物种植面积分布'
        },
        tooltip: {},
        legend: {
          data: ['面积']
        },
        xAxis: {
          data: []
        },
        yAxis: {
          axisLabel: {show: true}
        },
        series: [{
          name: '面积',
          type: 'bar',
          data: []
        }]
      },
      pie: {
        title: {
          text: '所有作物总面积占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
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
    }
  },
  created () {
    axios.get('http://192.168.1.117:9090/api/findCropArea').then((res) => {
      let area = []
      let data = []
      for (let i = 0; i < res.data.data.length; i++) {
        area.push(res.data.data[i].crop_name)
        data.push(res.data.data[i].area)
      }
      this.bar.xAxis.data = area
      this.bar.series[0].data = data
    })

    axios.get('http://192.168.1.117:9090/api/findUserPercent').then((res) => {
      let type = []
      let data = []
      for (let i = 0; i < res.data.data.length; i++) {
        type.push(res.data.data[i].user_type)
        data.push({value: res.data.data[i].area, name: res.data.data[i].user_type})
      }
      this.pie.legend.data = type
      this.pie.series[0].data = data
    })
  }
}
</script>
