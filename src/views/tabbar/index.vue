<template>
  <div>
    <keep-alive :include="['HomeIndex']">
      <router-view />
    </keep-alive>
    <van-tabbar route fixed>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search">标签</van-tabbar-item>
      <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
      <van-tabbar-item icon="setting-o" to="/user">{{ user ? '我的' : '未登录' }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TabbarIndex',
  data () {
    return {
      ...mapState(['user'])
    }
  },
  computed: {

  }
}
</script>
