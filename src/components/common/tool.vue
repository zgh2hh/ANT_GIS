<template>
  <div class='esri-widget-button esri-widget esri-interactive' role="button" @click='_resert()'>
    <span class='esri-collapse__icon esri-icon-locate'></span>
  </div>
</template>

<script>
export default {
  name: 'tool',
  props: {},
  data () {
    return {
    }
  },
  methods: {
    _resert () {
      this.$store.state.index.view.goTo([118.34134161472322, 31.05292479440629])
    }
  }
}
</script>

<style scoped>
</style>
