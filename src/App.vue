<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted () {
    // 没登录自动调回登录页面
    if (!window.localStorage.getItem('username')) {
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<style>
</style>
