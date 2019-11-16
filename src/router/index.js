import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
// import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'
import User from '@/views/user'
import UserEdit from '@/views/user-edit'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      path: '/',
      // 路由懒加载
      component: () => import('@/views/tabbar'),
      children: [
        {
          name: 'home',
          path: '',
          component: Home
        },
        {
          name: 'user',
          path: '/user',
          component: User
        }
      ]
    },
    // {
    //   path: '/',
    //   component: Tabbar,
    //   children: [
    //     {
    //       name: 'home',
    //       path: '', // 默认子路由
    //       component: Home
    //     }
    //   ]
    // },
    {
      name: 'search',
      path: '/search',
      component: Search
    },
    {
      name: 'search-result',
      path: '/search/:q',
      component: SearchResult
    },
    {
      name: 'article',
      path: '/article/:id',
      component: Article
    },
    {
      name: 'user-edit',
      path: '/user-edit',
      component: UserEdit
    }
  ]
})
