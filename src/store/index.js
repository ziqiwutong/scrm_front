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
    username: "",
    userCompany: "",
    userImgUrl: ""
  },
  repArticleDetail: {
    articleContext: '',
    articleTitle: '',
    articleAuthor: '',
    articleAccountName: '',
    articlePower: '',
    coverImg: '',
    productIds: []
  },
  hasOAuth: 'false'
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
        hasOAuth: val.hasOAuth
      }
    }
  })]
});

export default store
