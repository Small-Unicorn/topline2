<template>
  <div>
    <!-- 导航栏组件 -->
    <van-nav-bar title="登录"/>
    <!-- 单元格 -->
    <ValidationObserver tag="form" ref="loginForm">
      <ValidationProvider tag="div" name="手机号" rules="required" v-slot="{ errors }">
        <van-field
          v-model="user.mobile"
          clearable
          label="手机号"
          placeholder="请输入手机号"
          :error-message="errors[0]"
        />
      </ValidationProvider>
      <ValidationProvider tag="div" name="验证码" rules="required" v-slot="{ errors }">
        <van-field
          v-model="user.code"
          type="password"
          label="验证码"
          placeholder="请输入验证码"
          :error-message="errors[0]"
        />
      </ValidationProvider>
    </ValidationObserver>
    <!-- <van-cell-group>
       <van-field
          v-model="user.mobile"
          clearable
          label="手机号"
          placeholder="请输入手机号"
          :error-message="errors[0]"
          required
        />

      <van-field
        :error-message="errors.first('code')"
        name="code"
        v-validate="'required'"
        v-model="user.code"
        type="password"
        label="验证码"
        placeholder="请输入验证码"
        required
      />
    </van-cell-group> -->
    <div class="login-btn">
      <van-button type="info" :loading="isLoginLoading" @click="onLogin">登录</van-button>
    </div>

  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      show: false,
      value: '',
      isLoginLoading: false,
      user: {
        mobile: '18801185986',
        code: '246810'
      }
    }
  },
  created () {
    // this.customValidatorMessages()
  },
  methods: {
    ...mapMutations(['setUser']),
    async onLogin () {
      try {
        const isValid = await this.$refs.loginForm.validate()

        if (!isValid) return
        this.isLoginLoading = true
        const { data } = await login(this.user)
        console.log(data)
        // this.setUser(data.data)
        // 登陆成功，关闭 loading
        this.isLoginLoading = false
        // 跳转到首页
        this.$router.push({ name: 'home' })
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        }
      }
      // 无论登陆成功还是失败，都要把 loading 停止
      this.isLoginLoading = false
    }
    // async onLogin () {
    //   try {
    //     // 当表单提交的时候，调用 js 进行验证
    //     const isValid = await this.$validator.validate()
    //     if (!isValid) return
    //     this.isLoginLoading = true
    //     const { data } = await login(this.user)
    //     console.log(data)
    //     this.setUser(data.data)
    //     this.$router.push({ name: 'home' })
    //     this.isLoginLoading = false
    //   } catch (err) {
    //     if (err.response && err.response.status === 400) {
    //       this.$totast.fail('手机号或验证码错误')
    //     }
    //   }
    //   // 无论登陆成功还是失败，都要把 loading 停止
    //   this.isLoginLoading = false
    // }
    // customValidatorMessages () {
    //   this.$validator.localize('zh_CN', {
    //     custom: {
    //       mobile: {
    //         required: '手机号不能为空'
    //       },
    //       code: {
    //         required: '邮箱不能为空'
    //       }
    //     }
    //   })
    // }
  }
}
</script>

<style lang="less" scoped>
  .login-btn {
    padding: 20px;
    .van-button {
      width: 100%;
    }
  }
</style>
