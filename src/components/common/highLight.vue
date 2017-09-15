<template>
</template>

<script>
/**
 * 高亮features
*/
export default {
  name: 'highLight',
  props: {
    resultFeatures: {
      type: Array,
      default: function () {
        return []
      },
      required: true
    }
  },
  watch: {
    resultFeatures: function (features, oldVal) {
      this.hightLight()
    }
  },
  methods: {
    hightLight () {
      let features = this.resultFeatures
      const { ESRI, view } = this.$store.state.nutrition
      features.forEach((feature) => {
        let polygon = new ESRI.Polygon(feature.geometry)
        let polygonGraphic = new ESRI.Graphic({
          attributes: {
            label: 'highlight'
          },
          geometry: polygon,
          symbol: new ESRI.SimpleFillSymbol({
            color: [102, 0, 255, 0.15],
            outline: {
              color: '#00FF00',
              width: 2
            }
          })
        })
        view.graphics.add(polygonGraphic)
      })
    }
  }
}
</script>
<style scoped>
</style>
