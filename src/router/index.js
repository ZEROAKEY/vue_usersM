import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import UserList from '../components/users/UserList.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'

const UserList = () => import(/* webpackChunkName: "users_rigts_roles" */ '../components/users/UserList.vue')
const Rights = () => import(/* webpackChunkName: "users_rigts_roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName: "users_rigts_roles" */ '../components/power/Roles.vue')


// import { compile } from 'vue/types/umd'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' }, //监听到/,重定向到/login
  { path: '/login', component: Login },//路由规则：当访问/login这个地址的时候，展示组件Login
  {
    path: '/home', component: Home,
    redirect: '/welcome',//进入home就重定向到welcome
    children: [{ path: '/welcome', component: Welcome },
                {path: '/users', component : UserList},
                {path: '/rights', component : Rights},
                {path: '/roles', component : Roles},
              ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转
  //next 一个函数，表示放行， next()放行 next('/login') 强制跳转
  if (to.path === '/login') return next();
  //获取token
  const tokenstr = window.sessionStorage.getItem('token');
  if (!tokenstr) return next('/login');
  next();
})
export default router
