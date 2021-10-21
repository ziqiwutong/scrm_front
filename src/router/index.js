import Vue from 'vue'
import Router from 'vue-router'
import home from "../components/view/home";
import contextShare from "../components/view/contextShare/contextShareList";
import store from "../store";
import {Toast} from "vant";
import orderList from "../components/view/order/orderList"
import orderCreate from "../components/view/order/orderCreate";
import orderDetail from "../components/view/order/orderDetail";
Vue.use(Router)

const routes = [
  {path: '/', redirect: 'home'},
  {
    path: '/home',
    component: home
  },
  {
    path: '/contextShare',
    component: contextShare
  },
  {
    path:'/orderList',
    component:orderList
  },
  {
    path:'/orderCreate',
    component:orderCreate
  },
  {
    path:'/orderDetail',
    component:orderDetail
  }
  ];

const router = new Router({
  routes
})

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const jwt = require("jsonwebtoken");//引入jwt
const secret = "scrm";// 设置秘钥
const whiteList = ["/home"]; // 定义一个白名单列表
router.beforeEach(async (to, from, next) => {
  if (whiteList.includes(to.path)) { // 如果是访问的白名单中的页面
    return next(); // 不需要校验，直接返回继续访问该页面
  }
  // 获取token
  const token = store.state.token;
  const isValid = await jwt.verify(token, secret, (err, decoded) => { // 权限验证
    if (err) {
      return false;
    }
    return true;
  });
  if (!isValid) {
    Toast("登录过期,请重新登录！")
    return next('/home');
  } else {
    next();
  }
});

export default router

