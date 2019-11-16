import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Vant from 'vant'
import 'vant/lib/index.css'
import './styles/index.less'
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包

Vue.use(Vant)

Vue.use(VeeValidate, {
  events: '' // 禁用默认的事件校验
})

Vue.use(Vant)

Validator.localize('zh_CN', zhCN)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
