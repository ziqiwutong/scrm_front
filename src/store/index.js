import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import moduleA from "./modules/moduleA";

// 1. 安装插件
Vue.use(Vuex)

const state = {
  token: "",
  secret: "scrm",
  tabBarActive: 0,
  userMessage: {
    username: '张楠',
    userCompany: '泸州老窖集团有限责任公司',
    userImgUrl: '',
    userId: '6',
    userPhone: '18256895659'
  },
  repArticleDetail: {
    articleContext: '',
    articleTitle: '',
    articleAuthor: '',
    articleAccountName: '',
    articlePower: '',
    coverImg: '',
    productIds: [],
    materialType: '1'
  },
  wxUser: {
    imgUrl: 'https://ss1.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/baike/pic/item/8435e5dde71190efaa5405dfc21b9d16fdfa6007.jpg',
    nickName: '1234444'
  },
  hasOAuth: 'false',
  articleType: 1
}

// 2. 创建对象
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    a: moduleA
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
      return {
        // 只储存state中的token
        token: val.token,
        userMessage: val.userMessage,
        repArticleDetail: val.repArticleDetail,
        hasOAuth: val.hasOAuth,
        wxUser: val.wxUser,
        articleType: val.articleType
      }
    }
  })]
});

export default store
