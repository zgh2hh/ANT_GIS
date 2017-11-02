<template>
  <div class='login-wrap'>
    <div class='ms-title'>农田遥感GIS系统</div>
    <div class='ms-login'>
      <el-form :model='form' :rules='rules' ref='form' label-width='0px'>
        <el-form-item prop='username'>
          <el-input size='large' v-model='form.username' :disabled='isLogin' placeholder='手机号'>
            <template slot="prepend">手机号</template>
          </el-input>
        </el-form-item>
        <el-form-item prop='code'>
          <el-input size='large' placeholder='请输入验证码' :disabled='isLogin' v-model='form.code' @keyup.enter.native='_login'>
            <el-button slot="append" @click.native='_getCode()' type="info" :disabled="isCode">{{codeMsg}}</el-button>
          </el-input>
        </el-form-item>
        <div class='login-btn'>
          <el-button type='primary' size='large' @click='_login' :loading='isLogin'>{{isLogin ? '登录中...' : '我要登录'}}</el-button>
        </div>
      </el-form>
    </div>
    <footer>Copyright(C) 2015-2017 安徽阡陌网络科技有限公司 版权所有 皖ICP备15018616号-2</footer>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data () {
      return {
        codeMsg: '请获取验证码',
        isCode: false,
        isLogin: false,
        form: {
          username: '18130321306',
          code: '731603'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapActions(['checkCaptcha', 'sendCode']),
      _login () {
        this.isLogin = true
        this.checkCaptcha(this.form).then(() => {
          this.isLogin = false
          this.$router.push({name: 'main'})
          let user = JSON.stringify(this.$store.state.common.user)
          window.localStorage.setItem('user', user)
        }).catch(() => {
          this.isLogin = false
          window.localStorage.setItem('user', null)
        })
      },
      _getCode () {
        this.sendCode({mobile: this.form.username}).then(() => {
          let time
          let number = 60
          this.isCode = true
          setInterval(() => {
            if (number === 0) {
              clearInterval(time)
              this.isCode = false
              this.codeMsg = `请获取验证码`
            } else {
              number--
              this.codeMsg = `获取验证码中(${number}s)`
            }
          }, 1000)
          this.$message({
            message: '发送短信成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message.error('发送失败请重试')
        })
      }
    }
  }

</script>
<style scoped>
  footer {
    width: 100%;
    height: 50px;
    line-height: 50px;
    position: fixed;
    bottom: 0px;
    right: 0px;
    font-size: 14px;
    color: #aebdc9;
    text-align: center;
  }

  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: url('http://o9s1f7266.bkt.clouddn.com/fanchangbg.jpg?imageView2/0/q/75|imageslim');
    background-size: 100% 100%;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -180px;
    text-align: center;
    font-size: 30px;
  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    height: 260px;
    margin: -130px 0 0 -190px;
    padding: 40px;
    border-radius: 5px;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }
</style>
