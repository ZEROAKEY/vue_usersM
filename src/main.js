import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css' //导入全局样式表

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//在main.js里配置axios
import axios from 'axios'
// import { config } from 'vue/types/umd';
axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1/'
//axios拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http =axios //通过$http就用axios访问

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
