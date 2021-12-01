<template>
  <div>
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft" v-show="!inWX"/>
    <div class="article-container">
      <h2>{{ title }}</h2>
      <div class="article-msg">
        <p>{{ author }}</p>
        <p>{{ date }}</p>
      </div>
      <div v-html="article" class="article"></div>
    </div>
    <van-share-sheet v-model="showShare" title="立即分享" :options="options" @select="shareArticleApp"/>
    <BusinessCard class="bsCard" :userImgUrl="sharePerImg" :username="sharePerName" :userCompany="sharePerCompany"
                  :userPhone="sharePerPhone"
                  v-show="showCard"/>
    <div v-show="!inWX" class="bottomTab">
      <div class="bottomTab-left">
        <div class="bottomTab-left-first">
          <van-switch :value="showCard" @input="switchBtn" active-color="#645fd7" size="18px"/>
          <p>展示名片</p>
        </div>
        <div class="bottomTab-left-second" @click="toReadRecord">
          <van-icon name="todo-list-o" size="19px"/>
          <p>阅读记录</p>
        </div>
        <div class="bottomTab-left-third" @click="editArticle">
          <van-icon name="edit" size="19px"/>
          <p>编辑</p>
        </div>
        <div class="bottomTab-left-third" @click="deleteArticle">
          <van-icon name="delete-o" size="19px"/>
          <p>删除</p>
        </div>
      </div>
      <div class="bottomTab-right" @click="showShareArticle">
        <van-button round type="info" size="normal">分&nbsp;&nbsp;享</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import HeaderNavBar from "../../component/HeaderNavBar";
import NavBar from "../../component/NavBar";
import BusinessCard from "../../component/BusinessCard";
import {Toast} from "vant";
import {getUserId} from "../../../network/getToken";
import {getUrl} from "../../../utils/replaceUrl";
import wxApi from "../../../utils/wxApi";
import yyApi from "../../../utils/yyApi";
import wx from 'weixin-js-sdk'
import {ajax} from "../../../utils/ajax";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default {
  name: "articleDetail",
  components: {BusinessCard, NavBar, HeaderNavBar},
  data() {
    return {
      navTitle: "文章详情",
      title: "",
      author: "",
      date: "",
      articleId: "123",
      article: "",
      showCard: true,
      inWX: false,
      shareId: '',
      sharePerImg: "",
      sharePerName: "",
      sharePerCompany: "",
      sharePerPhone: "",
      showShare: false,
      articleMsg: {
        articleContext: '',
        articleTitle: '',
        articleAuthor: '',
        articleAccountName: '',
        articlePower: '',
        coverImg: ''
      },
      options: [
        {
          name: '微信',
          icon: 'wechat',
        },
        {
          name: '朋友圈',
          icon: 'wechat-moments',
        }
      ],
      readTime: 0,
      timer: null,
      wxUserMsg: '',
      // 滚动前，滚动条距文档顶部的距离
      oldScrollTop: 0,
      stompClient: '',
      ws_timer: ''
    }
  },
  created() {
    this.judgeEnv();
    this.articleId = this.$route.query.articleid;
    this.shareId = this.$route.query.shareid;
    this.showCard = this.$route.query.ifshowshareman;
    this.getArticle();
    let user = navigator.userAgent.toLowerCase();
    if (user.match(/MicroMessenger/i) == "micromessenger") {
      this.timer = setInterval(() => {
        this.readTime++;
      }, 1000);
    }
    this.pageListener();
    setInterval(() => {
      this.handleSend();
    }, 1000);
    // this.initWebSocket();
  },
  mounted() {
    if (this.showCard == false) {
      let element = document.getElementsByClassName('article-container')[0];
      element.setAttribute('style', 'padding-top:30px;');
    }
    let user = navigator.userAgent.toLowerCase();
    if (user.match(/MicroMessenger/i) == "micromessenger") {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.backChange, false) // false阻止默认事件
      }
      // window.addEventListener('pagehide', this.beforeunloadHandler, false);
      // window.addEventListener('onunload', e => {
      //   console.log('onunload');
      //   this.beforeunloadHandler();
      // });
      window.onbeforeunload = function () {
        this.beforeunloadHandler();
      }
    }
  },
  beforeDestroy() {
    this.beforeunloadHandler();
  },
  destroyed() {
    let user = navigator.userAgent.toLowerCase();
    if (user.match(/MicroMessenger/i) == "micromessenger") {
      // this.beforeunloadHandler();
      // 监听页面回退
      window.removeEventListener('popstate', this.backChange, false) // false阻止默认事件
      // // 监听页面关闭
      // window.removeEventListener('pagehide', this.beforeunloadHandler);
      // window.removeEventListener('onunload', this.beforeunloadHandler);
    }
    this.close();
    // this.disconnect();
  },
  methods: {
    pageListener() {
      if (typeof (WebSocket) === "undefined") {
        alert("您的浏览器不支持socket")
      } else {
        let url = "ws://192.168.1.107:30003/mk/article/ws";
        // let url = "ws://127.0.0.1:4000";
        // 实例化socket
        this.socket = new WebSocket(url)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open() {
      console.log("socket连接成功")
    },
    error() {
      console.log("连接错误")
    },
    getMessage(msg) {
      console.log(msg.data);
    },
    send: function (params) {
      // try {
      this.socket.send(params)
      // } catch (err) {
      //   console.log('websocket掉线了');
      //   return;
      //   // this.socket = new WebSocket(url);
      // }
    },
    close: function () {
      console.log("socket已经关闭")
    },
    handleSend(e) {
      let params = JSON.stringify({
        content: '1',
        id: 'sss'
      })
      this.send(params);
    },

    // initWebSocket() {
    //   this.connection();
    //   let that = this;
    //   // 断开重连机制,尝试发送消息,捕获异常发生时重连
    //   this.ws_timer = setInterval(() => {
    //     try {
    //       that.stompClient.send("test");
    //     } catch (err) {
    //       console.log("断线了: " + err);
    //       that.connection();
    //     }
    //   }, 10000);
    // },
    // connection() {
    //   // 建立连接对象
    //   let socket = new SockJS('http://127.0.0.1:3000/upgrade');
    //   // 获取STOMP子协议的客户端对象
    //   this.stompClient = Stomp.over(socket);
    //   // 定义客户端的认证信息,按需求配置
    //   let headers = {
    //     Authorization: ''
    //   }
    //   // 向服务器发起websocket连接
    //   this.stompClient.connect(headers, () => {
    //     this.stompClient.send("/ws",
    //       headers,
    //       JSON.stringify({sender: 'eet', chatType: 'JOIN'}),
    //     )   //用户加入接口
    //   }, (err) => {
    //     // 连接发生错误时的处理函数
    //     console.log('失败')
    //     console.log(err);
    //   });
    // },
    // disconnect() {
    //   if (this.stompClient) {
    //     this.stompClient.disconnect();
    //     clearInterval(this.ws_timer);
    //   }
    // },  // 断开连接
    backChange() {
      this.beforeunloadHandler();
    },
    async beforeunloadHandler() {
      clearInterval(this.timer);
      this.timer = null;
      // 把用户基本信息与用户阅读时间传给后台
      let url = JSON.parse(getUrl()).contextShare.saveWxUserMsg;
      let postData = {
        articleId: this.articleId,
        shareId: this.shareId,
        readTime: this.readTime,
        openid: this.wxUserMsg.openid,
        nickname: this.wxUserMsg.nickname,
        sex: this.wxUserMsg.sex,
        province: this.wxUserMsg.province,
        city: this.wxUserMsg.city,
        country: this.wxUserMsg.country,
        headimgurl: this.wxUserMsg.headimgurl,
        // privilege: this.wxUserMsg.privilege,
        unionid: this.wxUserMsg.unionid
      }
      ajax({
        type: 'POST',
        url: url,
        async: false,
        contentType: "application/json;charset=utf-8",
        data: postData,
        success: function (data) {
        },
        error: function () {
        }
      });
      // const wxUserMsg = (await this.$http.post(url, postData)).data;
      wx.closeWindow();
    },
    // 判断环境为微信还是app
    async judgeEnv() {
      let user = navigator.userAgent.toLowerCase();
      if (user.match(/MicroMessenger/i) == "micromessenger") {// 只能是两个等号，看起来类型是不同的
        // 不存在code则代表是未授权页面
        if (!this.$route.query.code || this.$store.state.hasOAuth === 'false') {
          this.$store.commit('updateArticleOAuth', 'true');
          let url = JSON.parse(getUrl()).baseUrl
            + 'articleDetail?articleid='
            + this.$route.query.articleid
            + '&shareid='
            + this.$route.query.shareid
            + '&ifshowshareman=' + this.showCard;
          let articleUrl = encodeURIComponent(url);
          let link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8cfd402efecab262&redirect_uri=" + articleUrl + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
          location.href = link;
        } else {
          // 用微信返回的code去请求后台获取用户基本信息
          let getData = {
            code: this.$route.query.code,
            state: 123
          }
          let url = JSON.parse(getUrl()).contextShare.getWxUserMsg;
          const wxUserMsg = (await this.$http.get(url, {params: getData})).data.data;
          // 把微信用户的基本信息存入本地，然后等用户离开页面时再返回给后台
          this.wxUserMsg = wxUserMsg;
          this.shareArticleWx();
        }
        this.inWX = true;
        document.getElementsByClassName('article-container')[0].setAttribute('style', 'padding-top:60px;padding-bottom:0px;');
        document.getElementsByClassName('bsCard')[0].setAttribute('style', 'top:0px;');

        // 微信分享文章
        // 监听页面滚动事件
        window.addEventListener("scroll", this.scrolling)
      } else {
        this.inWX = false;
      }
    },
    async getArticle() {
      let self = this;
      let url = JSON.parse(getUrl()).contextShare.articleDetail
      let postData = {
        id: this.$route.query.articleid,
        shareId: this.$route.query.shareid
      }
      const result = (await self.$http.get(url, {params: postData})).data.data;
      self.title = result.article.articleTitle;
      if (result.article.articleType === 1) {
        self.author = result.article.articleOriginAuthor;
      } else {
        self.author = result.article.authorName;
      }
      self.date = '';
      self.article = result.article.articleContext;
      self.sharePerImg = result.user.userIcon;
      self.sharePerName = result.user.username;
      self.sharePerCompany = '泸州老窖集团有限责任公司';
      self.sharePerPhone = result.user.telephone;

      self.articleMsg.articleContext = result.article.articleContext;
      self.articleMsg.articleTitle = result.article.articleTitle;
      self.articleMsg.articleAuthor = result.article.articleOriginAuthor;
      self.articleMsg.articleAccountName = result.article.articleAccountName;
      self.articleMsg.articlePower = result.article.articlePower;
      self.articleMsg.coverImg = result.article.articleImage;
      // 页面渲染完成后在执行
      self.$nextTick(() => {
        self.adjustSize();
      })
    },
    onClickLeft() {
      this.$router.push("/contextShareList");
    },
    // 删除文章
    deleteArticle() {
      let self = this;
      this.$dialog.confirm({
        title: '温馨提示',
        message: '您确定删除这篇文章吗',
        confirmButtonColor: '#645fd7',
      })
        .then(async () => {
          // 向后台发送删除文章的请求
          let postData = {
            id: self.articleId
          }
          let url = JSON.parse(getUrl()).contextShare.deleteArticle;
          const result = (await this.$http.delete(url, {params: postData})).data;
          if (result.code == 200) {
            Toast("删除成功！");
            self.$router.push("/contextShareList");
          } else {
            this.$toast('删除失败，请重试！');
          }
        })
        .catch(() => {
          // 不删除文章
        });
    },
    showShareArticle() {
      this.showShare = true;
    },
    async shareArticleWx() {
      // 先去后台拿微信的jsConfig，然后触发分享事件，传给后台的pageUrl不需要编码
      // let pageUrl = JSON.parse(getUrl()).baseUrl
      //   + 'articleDetail?artcileid='
      //   + this.articleId
      //   + '&shareid='
      //   + this.shareId
      //   + '&ifshowshareman=' + this.showCard;
      let pageUrl = location.href;
      let postData = {
        url: pageUrl
      }
      let url = JSON.parse(getUrl()).contextShare.wxConfig;
      const result = (await this.$http.get(url, {params: postData})).data.data;
      let wxConfig = {
        appId: result.appId,
        timestamp: result.timestamp,
        nonceStr: result.noncestr,
        signature: result.signature
      }
      let shareMsg = {
        title: this.title,
        desc: '点击查看详情->',
        link: window.location.href,
        imgUrl: this.articleMsg.coverImg
      }
      console.log(shareMsg.link)
      await wxApi.wxRegister(wxConfig, shareMsg);
      this.showShare = false;
    },
    async shareArticleApp(e) {
      // 先去后台拿用友的jsConfig，然后触发分享事件
      let url = JSON.parse(getUrl()).contextShare.yyConfig;
      const result = (await this.$http.get(url)).data.data;
      let yyConfig = {
        appId: result.appid,
        timestamp: result.timestamp,
        signature: result.signature
      }
      let shareMsg = {
        type: '2',
        title: this.title,
        imageUrl: this.articleMsg.coverImg,
        desc: '点击查看详情->',
        pageUrl: window.location.href
      }
      if (e.name === '朋友圈') {
        shareMsg.type = '3';
      }
      await yyApi.yyRegister(yyConfig, shareMsg);
      this.showShare = false;
    },
    switchBtn(showCard) {
      this.showCard = showCard;
      let element = document.getElementsByClassName('article-container')[0];
      if (showCard) {
        element.setAttribute('style', 'padding-top:100px;');
      } else {
        element.setAttribute('style', 'padding-top:30px;');
      }
    },
    // 文章阅读详情
    toReadRecord() {
      // 带着articleId&shareId去请求文章详情页
      let shareId = JSON.parse(getUserId()).userID;
      this.$router.push({
        name: 'readRecord',
        query: {
          articleId: this.articleId,
          shareId: shareId,
          ifShowShareMan: this.showCard
        }
      });
    },
    // 调整文章尺寸
    adjustSize() {
      let imgArray = document.getElementsByTagName('img');
      if (document.querySelector('#js_pc_qr_code')) {
        let qrCodeEle = document.querySelector('#js_pc_qr_code');
        qrCodeEle.setAttribute('style', 'display:none;');
      }
      for (let index = 0; index < imgArray.length; index++) {
        if (imgArray[index].src.startsWith("https://mmbiz.qpic.cn")) {
          let dataSrc = imgArray[index].getAttribute('data-src');
          let newValue = dataSrc.replace("https://mmbiz.qpic.cn", "/wxResource");
          imgArray[index].setAttribute('data-src', newValue);
          imgArray[index].src = newValue;
        }
        if (imgArray[index].src.startsWith("http://mmbiz.qpic.cn")) {
          let dataSrc = imgArray[index].getAttribute('data-src');
          let newValue = dataSrc.replace("http://mmbiz.qpic.cn", "/wxResource");
          imgArray[index].setAttribute('data-src', newValue);
          imgArray[index].src = newValue;
        }
      }
    },
    // 编辑文章
    editArticle() {
      let shareId = JSON.parse(getUserId()).userID;
      this.$store.commit('updateEditReqArticle', this.articleMsg);
      this.$router.push({
        name: 'repArticleDetail',
        query: {
          type: '1',
          articleId: this.articleId,
          shareId: shareId,
          ifShowShareMan: this.showCard
        }
      });
    },
    scrolling() {
      // 滚动条距文档顶部的距离
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
        document.body.scrollTop
      // 滚动条滚动的距离
      let scrollStep = scrollTop - this.oldScrollTop;
      // 更新——滚动前，滚动条距文档顶部的距离
      this.oldScrollTop = scrollTop;
      if (scrollStep < 0) {
        // 滚动条向上滚动了
        this.showCard = true;
      } else {
        // 滚动条向下滚动了
        this.showCard = false;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding-top: 100px;
  padding-bottom: 60px;
  padding-left: 2%;
  padding-right: 2%;
  overflow-x: hidden;
  //background-color: #fafafa;
}

.article {
  font-size: 17px;
  line-height: 1.6em;
  text-align: justify;
  color: #333;
  word-break: break-all;
  box-sizing: border-box;
}

.article /deep/ * {
  max-width: 100% !important;
  box-sizing: border-box;
}

h2 {
  font-weight: 500;
  margin-left: 10px;
}

.article-msg {
  height: 20px;
  display: inline-flex;
  padding-left: 10px;
  color: #c1c1c1;
}

.article-msg p {
  display: inline;
  line-height: 20px;
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  margin-right: 10px;
}

.bottomTab {
  display: inline-flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  vertical-align: middle;
  padding: 10px;
  background-color: #f2f2f2;
  z-index: 99;
}

.bottomTab p {
  font-size: 12px;
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.bottomTab-left {
  display: inline-flex;
  text-align: center;
  width: 60vw;
  justify-content: space-around;
}

.bottomTab-right {
  width: 40vw;
  position: relative;
}

/deep/ .van-button {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 5px;
  background-color: #645fd7;
  border: none;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 16px;
}

/deep/ .van-share-sheet__options {
  justify-content: space-around;
}

/deep/ .van-dialog__confirm {
  color: #645fd7 !important;
}

/deep/ code {
  display: block;
  max-width: 98%;
}

/deep/ table {
  border-collapse: collapse;
}

/deep/ td, th {
  padding: 8px 10px;
  border: 1px solid #DDD;
}

/deep/ h1 {
  display: none;
}
</style>
