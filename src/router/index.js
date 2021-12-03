import Vue from 'vue'
import Router from 'vue-router'
import home from "../components/view/home";
import contextShareList from "../components/view/contextShare/contextShareList";
import articleDetail from "../components/view/contextShare/articleDetail";
import readRecord from "../components/view/contextShare/readRecord";
import reprintArticle from "../components/view/contextShare/reprintArticle";
import repArticleDetail from "../components/view/contextShare/repArticleDetail";
import reArticleDes from "../components/view/contextShare/reArticleDes";
import product2poster from "../components/component/Product2poster";
import sweetTest from "../components/view/contextShare/sweetTest";
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
import bizOppList from "../components/view/businessOpportunity/bizOppList";
import bizOppDetail from "../components/view/businessOpportunity/bizOppDetail";
import addBizOpp from "../components/view/businessOpportunity/addBizOpp";
import productList from "../components/view/product/productList";
import productCreate from "../components/view/product/productCreate";
import productDetail from "../components/view/product/productDetail";
import productEdit from "../components/view/product/productEdit";
import procustomer from "../components/customer/procustomer"
import searchList from "../components/view/searchCustomer/searchList";
import searchCustomer from "../components/view/searchCustomer/searchCustomer";
import bkIntroduce from "../components/view/searchCustomer/bkIntroduce";
import searchCompanyDetail from "../components/view/searchCustomer/searchCompanyDetail";
import communicationList from "../components/view/commuication/communicationList";
import communicationDetail from "../components/view/commuication/communicationDetail";
import addCommunicationLog  from "../components/view/commuication/addCommunicationLog"
import editCom from "../components/view/commuication/editCom"
Vue.use(Router)

const routes = [
  {path: '/', redirect: 'home'},
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/contextShareList',
    name: 'contextShareList',
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
    component: customer,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    path: '/perinfor',
    name: 'perinfor',
    component: Perinfor
  },
  {
    path: '/procustomer',
    name: 'procustomer',
    component: procustomer,
    meta: {
      keepAlive: true // 需要被缓存
    }
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
    name: "potentialdetail",
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
  },
  {
    path: '/bizOppList',
    component: bizOppList
  },
  {
    path: '/bizOppDetail',
    name: 'bizOppDetail',
    component: bizOppDetail
  },
  {
    path: '/addBizOpp',
    name: "addBizOpp",
    component: addBizOpp
  },
  {
    path: '/orderEdit',
    component: orderEdit
  },
  {
    path: '/productList',
    component: productList
  },
  {
    path: '/productCreate',
    component: productCreate
  },
  {
    path: '/productDetail',
    component: productDetail
  },
  {
    path: '/productEdit',
    component: productEdit
  },
  {
    path: '/repArticleDetail',
    name: 'repArticleDetail',
    component: repArticleDetail
  },
  {
    path: '/reArticleDes',
    name: 'reArticleDes',
    component: reArticleDes
  },
  {
    path: '/product2poster',
    name: 'product2poster',
    component: product2poster
  },
  {
    path: '/sweetTest',
    name: 'sweetTest',
    component: sweetTest
  },
  {
    path: '/searchCustomer',
    name: 'searchCustomer',
    component: searchCustomer
  },
  {
    path: '/searchList',
    name: 'searchList',
    component: searchList
  },
  {
    path: '/bkIntroduce',
    name: 'bkIntroduce',
    component: bkIntroduce
  },
  {
    path: '/searchCompanyDetail',
    name: 'searchCompanyDetail',
    component: searchCompanyDetail
  },
  {
    path: '/communicationList',
    component: communicationList
  },
  {
    path: '/communicationDetail',
    name: 'communicationDetail',
    component: communicationDetail,
  },
  {
    path: '/addCommunicationLog',
    name:'addCommunicationLog',
    component: addCommunicationLog,
  },
  {
    path: '/editCom',
    name: 'editCom',
    component: editCom,
  }
];

const router = new Router({

  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0} //期望滚动到哪个的位置
    }
  },
})

// 解决Vue-Router升级导致的Uncaught(in promise) navigation guard问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const jwt = require("jsonwebtoken");//引入jwt
const secret = "scrm";// 设置秘钥
const whiteList = ["/home", "/product2poster", "/sweetTest", "/repArticleDetail", "/articleDetail"]; // 定义一个白名单列表
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

