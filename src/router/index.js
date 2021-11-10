import Vue from 'vue'
import Router from 'vue-router'
import home from "../components/view/home";
import contextShareList from "../components/view/contextShare/contextShareList";
import articleDetail from "../components/view/contextShare/articleDetail";
import readRecord from "../components/view/contextShare/readRecord";
import reprintArticle from "../components/view/contextShare/reprintArticle";
import store from "../store";
import {Toast} from "vant";
import orderList from "../components/view/order/orderList";
import clueList from "../components/view/clue/clueList"
import customer from "../components/customer/customer"
import Perinfor from "../components/customer/Perinfor"
import Potential from "../components/customer/Potential"
import searchRelationship from "../components/view/relationship/searchRelationship";
import relationshipDetail from "../components/view/relationship/relationshipDetail";
import product from "../components/view/product"
import clueDetail from "../components/view/clue/clueDetail";
import addClue from "../components/view/clue/addClue";
import editClueStatus from "../components/view/clue/editClueStatus";
import PotentDetail from "../components/customer/potentialdetail"
import orderCreate from "../components/view/order/orderCreate";
import orderDetail from "../components/view/order/orderDetail";
import orderEdit from "../components/view/order/orderEdit";
import editClue from "../components/view/clue/editClue";
import addClueStatus from "../components/view/clue/addClueStatus";


Vue.use(Router)

const routes = [
  {path: '/', redirect: 'home'},
  {
    path: '/home',
    component: home
  },
  {
    path: '/contextShareList',
    component: contextShareList
  },
  {
    path: '/orderList',
    component: orderList
  },
  {
    path: '/articleDetail',
    name: 'articleDetail',
    component: articleDetail
  },
  {
    path: '/clueList',
    component: clueList
  },
  {
    path: '/orderList',
    component: orderList
  },
  {
    path: '/customer',
    component: customer
  },
  {
    path: '/perinfor',
    component: Perinfor
  },
  {
    path: '/potential',
    component: Potential
  },
  {

    path: '/product',
    component: product
  },
  {
    path: '/relationship',
    component: searchRelationship
  },
  {
    path: '/clueDetail',
    component: clueDetail
  },
  {
    path: '/addClue',
    component: addClue
  },
  {
    path: '/editClueStatus',
    component: editClueStatus
  },
  {
    path: '/editClue',
    component: editClue
  },
  {
    path: '/addClueStatus',
    component: addClueStatus
  },
  {
    path: '/readRecord',
    name: 'readRecord',
    component: readRecord

  },
  {
    path: '/potentialdetail',
    component: PotentDetail
  },
  {
    path: '/relationshipDetail',
    name: 'relationshipDetail',
    component: relationshipDetail
  },

  {
    path: '/orderCreate',
    component: orderCreate
  },
  {
    path: '/orderDetail',
    component: orderDetail
  },
  {
    path: '/orderEdit',
    component: orderEdit
  },
  {
    path: '/reprintArticle',
    name: 'reprintArticle',
    component: reprintArticle
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

