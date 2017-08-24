<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import store from '@/store'
import modules from '../modules/store'

if (!store.state.nutrition) {
  store.registerModule('nutrition', {
    ...modules
  })
}

export default {
  name: 'layout',
  computed: {
    ...mapGetters(['Route'])
  }
}
</script>
