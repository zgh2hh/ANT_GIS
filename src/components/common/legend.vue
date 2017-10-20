<template>
  <div class='esri-component esri-legend esri-widget'>
    <div class='esri-legend__service'>
      <p class="esri-legend__service-label">作物分类专题图</p>
      <div class='esri-legend__layer'>
        <div class='esri-legend__layer-table'>
          <div class='esri-legend__layer-caption'>crop_id</div>
          <div class='esri-legend__layer-body'>
            <div class='esri-legend__layer-row' v-for='(item, index) in layerInfo' :key="index">
              <!-- 小麦 -->
              <div class='esri-legend__layer-cell esri-legend__layer-cell--symbols'>
                <div class='esri-legend__symbol'>
                  <div>
                    <svg overflow="hidden" width="24" height="24" style="touch-action: none;"><defs></defs><g transform="matrix(1.00000000,0.00000000,0.00000000,1.00000000,12.00000000,12.00000000)"><path :fill="item.color" fill-opacity="1" stroke="rgb(255, 255, 255)" stroke-opacity="1" stroke-width="0.6666666666666666" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" path="M -10,-10 L 10,0 L 10,10 L -10,10 L -10,-10 Z" d="M-10-10L 10 0L 10 10L-10 10L-10-10Z" fill-rule="evenodd" stroke-dasharray="none" dojoGfxStrokeStyle="solid"></path></g></svg>
                  </div>
                </div>
              </div>
              <div class="esri-legend__layer-cell esri-legend__layer-cell--info">{{item.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'custom-legend',
  props: {
    title: {
      type: String,
      default: '作物分类专题图'
    },
    layerInfo: {
      type: Array,
      default: function () {
        return [{
          name: '水稻',
          color: 'rgb(12, 137, 24)'
        }, {
          name: '小麦',
          color: 'rgb(217, 182, 17)'
        }]
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
