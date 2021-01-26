import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/', redirect:'/login'}, //监听到/,重定向到/login
  {path:'/login',component:Login},//路由规则：当访问/login这个地址的时候，展示组件Login
  {path:'/home',component:Home} 
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) =>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转
  //next 一个函数，表示放行， next()放行 next('/login') 强制跳转
  if(to.path==='/login') return next();
  //获取token
  const tokenstr = window.sessionStorage.getItem('token');
  if(!tokenstr) return next('/login');
  next();
})
export default router
