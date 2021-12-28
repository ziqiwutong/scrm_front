<template>
  <div>
    <NavBar/>
    <div class="mainArea">
      <div class="main">
<!--        <div class="title">客户管理</div>-->
        <van-grid clickable :column-num="3" :border="false">
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[0]" style="color:#ff8a5c;" :text="textArray[0]"
                         to="/customer"/>
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[1]" style="color:#3585f9;" :text="textArray[1]"
                         to="/potential"/>
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[4]" style="color:#e2b127;" :text="textArray[4]"
                         to="/relationship"/>
        </van-grid>
        <van-grid clickable :column-num="3" :border="false">
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[2]" style="color:#5b99ff;" :text="textArray[2]"
                         :to="{name:'searchCustomer',params:{type:1}}"/>
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[3]" style="color:#1296db;" :text="textArray[3]"
                         :to="{name:'searchCustomer',params:{type:2}}"/>
          <van-grid-item icon-prefix="icon-third" icon="" text="" url="/"/>
        </van-grid>
        <!--        <van-grid clickable :column-num="2" :border="false">-->
        <!--          <van-grid-item icon-prefix="icon-third" :icon="iconArray[4]" style="color:#e2b127;" :text="textArray[4]"-->
        <!--                         to="/relationship"/>-->
        <!--          <van-grid-item icon-prefix="icon-third" icon="" text="" url="/"/>-->
        <!--        </van-grid>-->
      </div>
      <div class="main">
<!--        <div class="title">资源管理</div>-->
        <van-grid clickable :column-num="3" :border="false">
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[7]" style="color:#5295e7;" :text="textArray[7]"
                         to="/communicationList"/>
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[5]" style="color:#06b4fe;" :text="textArray[5]"
                         to="/clueList"/>
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[6]" style="color:#3683f7;" :text="textArray[6]"
                         to="/bizOppList"/>
        </van-grid>
        <!--        <van-grid clickable :column-num="2" :border="false">-->
        <!--          <van-grid-item icon-prefix="icon-third" :icon="iconArray[7]" style="color:#5295e7;" :text="textArray[7]"-->
        <!--                         to="/communicationList"/>-->
        <!--          <van-grid-item icon-prefix="icon-third" icon="" text="" url="/"/>-->
        <!--        </van-grid>-->
      </div>
      <div class="main">
<!--        <div class="title">内容管理</div>-->
        <van-grid clickable :column-num="3" :border="false">
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[8]" style="color:#fdd110;" :text="textArray[8]"
                         to="/contextShareList"/>
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[9]" style="color:#ebdb9c;" :text="textArray[9]"
                         @click="toShop"/>
          <van-grid-item icon-prefix="icon-third" icon="" text="" url="/"/>
        </van-grid>
      </div>
      <div class="main">
<!--        <div class="title">产品管理</div>-->
        <van-grid clickable :column-num="3" :border="false">
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[10]" style="color:#ff9600;" :text="textArray[10]"
                         to="/productList"/>
          <van-grid-item icon-prefix="icon-third" :icon="iconArray[11]" style="color:#f1af6b;" :text="textArray[11]"
                         to="/orderList"/>
          <van-grid-item icon-prefix="icon-third" icon="" text="" url="/"/>
        </van-grid>
      </div>
    </div>
    <TabBar/>
  </div>
</template>

<script>
import { Toast } from "vant";
import NavBar from "../component/NavBar";
import TabBar from "../component/TabBar";
import {getUrl} from "../../utils/replaceUrl";
import yyApi from "../../utils/yyApi";
// import {getToken} from "@/network/getToken";


export default {
  name: "home",
  components: {
    NavBar,
    TabBar
  },
  data() {
    return {
      name: "sweet",
      active: 0,
      components: {
        NavBar,
        TabBar
      },
      iconArray: [
        "customer",
        "potential",
        "company",
        "person",
        "relationship",
        "clue",
        "biz",
        "com",
        "share",
        "fenxiao",
        "product",
        "order"
      ],
      textArray: [
        "客户列表",
        "潜在客户",
        "查企业",
        "查个人",
        "查关系",
        "线索管理",
        "商机管理",
        "沟通管理",
        "内容分享",
        "分销管理",
        "公司产品",
        "订单列表"
      ],
      autoHeight: {
        height: ""
      }
    }
  },
  created() {
    // alert(this.$route.query.code);
    this.hideNavBar();
    if (this.$route.query.code) {
      this.sendCode();
    }
    //为了测试，这里暂时写的是6，其实应该是从user里面获取
    // let userID = "4862341";
    // if (userID) {// userID 不为空时才获取，这里的userID是从URL里获取的
    //   this.getToken(userID);
    // }
    // this.getDistributeUrl();
    // 修改tabbar被选中状态
    this.$store.commit('updateTabBarActive', 0);
  },
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background:#f6f6f6')
  },
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
  methods: {
    getToken(userID) {
      const jwt = require("jsonwebtoken");// 引入jwt
      const secret = "scrm";// 设置秘钥
      const token = jwt.sign({userID: userID}, secret, {// 设置加密内容及有限时间
        expiresIn: "7d"
      })
      const isValid = jwt.verify(token, secret, (err, decoded) => { // 权限验证
        if (err) {
          return false;
        }
        return true
      });
      let hasToken = this.$store.state.token;
      if (!hasToken || !isValid) {// 缓存中没有token，或者token已失效时才生成新的token
        this.$store.commit('updateToken', token);
      }
    },
    async sendCode() {
      let url = JSON.parse(getUrl()).userInfo.sendAppCode;
      let getData = {
        code: this.$route.query.code
      }
      const wxUserMsg = (await this.$http.get(url, {params: getData})).data.data;
      let userMessage = {
        username: wxUserMsg.name,
        userCompany: '泸州老窖集团有限责任公司',
        userImgUrl: wxUserMsg.avatar,
        userId: wxUserMsg.member_id,//userId应该是从后台获取。这个id需要用友id要和scrm的用户id对接
        userPhone: wxUserMsg.mobile,
        email: wxUserMsg.email,
        sex: wxUserMsg.sex,
        duty: wxUserMsg.duty,
        deptName: wxUserMsg.dept_name,
        wmId: ''
      }
      console.log('userid:' + userMessage.userId);
      await this.$store.commit('updateUserMessage', userMessage);
      await this.getToken(userMessage.userId);
      await this.getWmId(userMessage.userId);
      await this.getDistributeUrl();
    },
    // 获取分销链接
    async getDistributeUrl() {
      let url = JSON.parse(getUrl()).contextShare.getDistributeUrl;
      // 微盟id要从url里进行截取
      let getData = {
        id: this.$store.state.userMessage.wmId
      }
      const result = (await this.$http.get(url, {params: getData})).data.data;
      if (result.length > 0) {
        this.$store.commit('updateDistributeUrl', result);
      }
    },
    // 获取微盟ID
    async getWmId(userId) {
      let url = JSON.parse(getUrl()).userInfo.getWmId;
      let getData = {
        id: userId
      }
      const result = (await this.$http.get(url, {params: getData})).data.data;
      if (result) {
        this.$store.commit('updateWmId', result.weimobId);
      }
    },
    toShop() {
      location.href = this.$store.state.distributeUrl;
    },
    async hideNavBar() {
      // 先去后台拿用友的jsConfig，然后触发分享事件
      let url = JSON.parse(getUrl()).userInfo.yyConfig;
      const result = (await this.$http.get(url)).data.data;
      let yyConfig = {
        appId: result.appid,
        timestamp: result.timestamp,
        signature: result.signature
      }
      await yyApi.yyRegister(yyConfig, null, 1);
    },
  }
}
</script>

<style lang="less" scoped>
.mainArea {
  padding-top: 65px;
  padding-bottom: 50px;
}
.main {
  margin: 5px 2% 5px 2%;
  padding: 2px;
  border-radius: 15px;
  border: 1px solid #f6f6f6;
}

.title {
  width: 100%;
  height: 2.5rem;
  line-height: 2.5rem;
  background-color: white;
  box-sizing: border-box;
  padding-left: 1rem;
  border-bottom: 1px solid #f6f6f6;
  color: #5f6368;
}
</style>
