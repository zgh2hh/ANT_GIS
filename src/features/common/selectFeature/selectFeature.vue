<template>
</template>

<script>
export default {
  name: 'selectFeature',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      drawConfig: {},
      pointerDownListener: null,
      clickListener: null
    }
  },
  watch: {
    active: function (val, oldVal) {
      if (val) {
        this.activateSelect()
      } else {
        this.deactivateSelect()
      }
    }
  },
  methods: {
    activateSelect () {
      const { view } = this.$store.state.nutrition
      let that = this
      // drawButton.classList.toggle("esri-draw-button-selected");

      // prevents the popup from unecessarily closing
      // after drawing has completed
      this.clickListener = view.on('click', function (evt) {
        evt.stopPropagation()
      })
      this.pointerDownListener = view.on('pointer-down', function (event) {
        event.stopPropagation()
        var point = that.createPoint(event)
        that.$emit('selected', point)
      })
    },
    deactivateSelect () {
      this.pointerDownListener.remove()
      this.clickListener.remove()
      this.$emit('deactivated')
    },
    createPoint (event) {
      const { view } = this.$store.state.nutrition
      return view.toMap(event)
    }
  }
}
</script>
<style scoped>
</style>
