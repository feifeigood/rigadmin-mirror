<template>
  <div class="login">
    <div class="container flex">
      <div class="left flex-50">
        <div class="logo">
          <img :src="logo" />
          <div class="ml2 text">
            RigAdmin
          </div>
        </div>
        <div class="my-auto flex">
          <img
            :src="loginBoxBg"
          />
          <div class="text">
            <span>RigAdmin</span>
          </div>
        </div>
      </div>
      <div class="right flex-50">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
          <h2 class="title">登录</h2>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="off"
              placeholder="密码"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

import logo from '@/assets/images/logo.png'
import loginBoxBg from '@/assets/images/login-box-bg.svg'

export default {
  name: "Login",
  data() {
    return {
      logo,
      loginBoxBg,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "admin",
        password: "rigserver",
        rememberMe: false,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        console.log(route)
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  padding: relative;
  width:100%;
  height:100%;
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url('../assets/images/login-bg.svg');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: '';
  }
  .container{
    position:absolute;
    padding:50px;
    width:100%;
    height:100%;
    .left{
      display: flex;
      flex-direction: column;
      .logo{
        position: absolute;
        display: flex;
        align-items: center;
        img{
          width: 48px;
        }
        .text{
          font-size: 24px;
          color: #fff;
          font-weight: 700;
        }
      }
      .my-auto{
        flex-direction: column;
        margin: auto;
        img{
          width: 50%;
        }
        .text{
          margin-top: 40px;
          font-size: 30px;
          color: #fff;
          font-weight: 700;
        }
      }
    }
    .right{
      display: flex;
      .login-form{
        width: 360px;
        margin:auto;
      }
    }
  }
}


</style>
