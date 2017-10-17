<template>
  <div class='header'>
    <div class='logo'>农情遥感监测平台</div>
    <div class='user-info'>
      <span class='el-dropdown-link'>
        <img class='user-logo' src='http://o9s1f7266.bkt.clouddn.com/06bOOOPIC32_202.jpg' width='100' height='100'>
        {{username}}
      </span>
      <span class="button quit" @click='_loginout'>退出登录</span>
    </div>
    <div>
      <el-radio-group v-model="mode">
        <el-radio-button label="地区模式"></el-radio-button>
        <el-radio-button label="大户模式"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  name: 'Header',
  data () {
    return {
      mode: '地区模式'
    }
  },
  computed: {
    ...mapGetters(['User']),
    username () {
      let user = window.localStorage.getItem('user')
      let userObj = JSON.parse(user)
      return userObj.cn_name
    }
  },
  methods: {
    ...mapActions(['quitLogin']),
    _loginout (evt) {
      evt.stopPropagation()
      this.quitLogin().then(() => {
        window.localStorage.removeItem('user')
        this.$router.push({name: 'login'})
      })
    }
  },
  watch: {
    'mode': function (val, oldVal) {
      this.$emit('modeChange', val)
    }
  }
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  font-size: 20px;
  line-height: 60px;
  color: #fff;
  background-color: #717576;
  z-index: 11;
  opacity: 0.7;
}
.header .logo{
  float: left;
  width:250px;
  text-align: center;
}
.user-info {
  float: right;
  padding-right: 50px;
  font-size: 16px;
  color: #fff;
}
.user-info .el-dropdown-link{
  position: relative;
  display: inline-block;
  padding-left: 50px;
  color: #fff;
  cursor: pointer;
  vertical-align: middle;
}
.user-info .user-logo{
  position: absolute;
  left:0;
  top:8px;
  width:40px;
  height:40px;
  border-radius: 50%;
}
.user-info .quit{
  display: inline-block;
  vertical-align: middle;
}
</style>
