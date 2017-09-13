<template>
  <router-view></router-view>
</template>

<script>
export default {
  created () {
    // this.$router.beforeEach((to, from, next) => {
    //   if (!window.localStorage.getItem('username')) {
    //     this.$router.push({name: 'login'})
    //   }
    //   next()
    // })
    // this.$router.afterEach((to, from) => {
    // })
  }
}
</script>

<style>
</style>
