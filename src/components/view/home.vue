<template>
  <div class="container" :style="{height:containerHeight}">
    <NavBar/>
    <div class="main">
      <van-grid clickable :column-num="2" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[0]" style="color:#ff8a5c;" :text="textArray[0]"
                       to="/httTest02"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[1]" style="color:#3585f9;" :text="textArray[1]"
                       url="/"/>
      </van-grid>
      <van-grid clickable :column-num="2" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[2]" style="color:#5b99ff;" :text="textArray[2]"
                       to="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[3]" style="color:#1296db;" :text="textArray[3]"
                       url="/"/>
      </van-grid>
      <van-grid clickable :column-num="2" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[4]" style="color:#e2b127;" :text="textArray[4]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" icon="" text="" url="/"/>
      </van-grid>
    </div>
    <div class="main">
      <van-grid clickable :column-num="2" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[5]" style="color:#06b4fe;" :text="textArray[5]"
                       to="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[6]" style="color:#3683f7;" :text="textArray[6]"
                       url="/"/>
      </van-grid>
      <van-grid clickable :column-num="2" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[7]" style="color:#5295e7;" :text="textArray[7]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" icon="" text="" url="/"/>
      </van-grid>
    </div>
    <div class="main">
      <van-grid clickable :column-num="2" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[8]" style="color:#fdd110;" :text="textArray[8]"
                       to="/contextShare"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[9]" style="color:#ebdb9c;" :text="textArray[9]"
                       url="/"/>
      </van-grid>
    </div>
    <div class="main">
      <van-grid clickable :column-num="2" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[10]" style="color:#ff9600;" :text="textArray[10]"
                       to="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[11]" style="color:#f1af6b;" :text="textArray[11]"
                       to="/orderList"/>
      </van-grid>
    </div>
    <TabBar/>
  </div>
</template>

<script>
import NavBar from "../component/NavBar";
import TabBar from "../component/TabBar";
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
      active:0,
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
      },
      containerHeight: ""
    }
  },
  created: function () {
    let containerHeight = (74.4 * 9 - 50) + "px";
    this.containerHeight = containerHeight;
    // let query=this.$route.query;
    // let userID = query.userID;
    let userID = "scrm123";
    if (userID){// userID 不为空时才获取，这里的userID是从URL里获取的
      this.getToken(userID);
    }
    // 修改tabbar被选中状态
    this.$store.commit('updateTabBarActive',0);
  },
  methods: {
    onClickLeft() {
      this.$toast('返回');
    },
    onClickRight() {
      this.$toast('按钮');
    },
    getToken(userID) {
      const jwt = require("jsonwebtoken");// 引入jwt
      const secret = "scrm";// 设置秘钥
      const token = jwt.sign({userID: userID}, secret, {// 设置加密内容及有限时间
        expiresIn: "2h"
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
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding-top: 65px;
  background-color: #f6f6f6;
}

.main {
  margin: 5px 2% 5px 2%;
  padding: 2px;
  border-radius: 15px;
  border: 1px solid #f6f6f6;
}

</style>
