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
    <BusinessCard v-if=" loading === false " class="bsCard"
                  :userImgUrl="sharePerImg"
                  :username="sharePerName"
                  :userCompany="sharePerCompany"
                  :userPhone="sharePerPhone" v-show="showCard"/>
    <div v-show="!inWX" class="bottomTab">
      <div class="bottomTab-left">
        <div class="bottomTab-left-first">
          <van-switch :value="showCard" @input="switchBtn" active-color="#4876f1" size="18px"/>
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
      loading: true,
      date: "",
      articleId: "123",
      article: "",
      showCard: true,
      inWX: true,
      shareId: '',
      wmId: '',
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
      ws_timer: '',
      distributeUrl: '',
      productCount: 0,
      cardListener: '',
      source: ''
    }
  },
  created() {
    this.judgeEnv();
    this.articleId = this.$route.query.articleid;
    this.shareId = this.$route.query.shareid;
    this.wmId = this.$route.query.wmid;
    this.source = this.$route.query.source;
    if (this.$route.query.ifshowshareman === 'false' || this.$route.query.ifshowshareman === false) {
      this.showCard = false;
    } else {
      this.showCard = true;
    }
    this.getArticle();
    this.getDistributeUrl();
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
      this.timer = setInterval(() => {
        this.readTime += 5;
        this.handleSend();
        if (this.readTime > 900) {// 后台Redis最大存储时间为20分钟，前台15分钟就关闭连接
          this.close();//关闭socket连接
          clearInterval(this.timer)
        }
      }, 5000);
    }
    let timer = setInterval(() => {
      if (document.querySelector('.productDiv')) {
        this.addUrlToProduct();
        clearInterval(timer);
      }
    }, 500);
  },
  destroyed() {
    let user = navigator.userAgent.toLowerCase();
    if (user.match(/MicroMessenger/i) == "micromessenger") {
      // 监听页面回退
      window.removeEventListener('popstate', this.backChange, false) // false阻止默认事件
      this.close();
    }
  },
  methods: {
    pageListener(openid) {
      if (typeof (WebSocket) === "undefined") {
        alert("您的浏览器不支持socket")
      } else {
        let url = "ws://" + JSON.parse(getUrl()).websocketUrl + "?articleId=" + this.articleId
          + '&shareId=' + this.shareId
          + '&openid=' + openid;
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
      console.log("连接错误");
      this.socket.onclose;
    },
    getMessage(msg) {
      console.log(msg.data);
    },
    send(params) {
      this.socket.send(params)
    },
    close() {
      this.socket.onclose;
      console.log("socket已经关闭");
    },
    handleSend() {
      let params = '1';
      this.send(params);
    },
    backChange() {
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
            + '&wmid='
            + this.$route.query.wmid
            + '&ifshowshareman=' + this.showCard;
          +'&source=' + this.$route.query.source;
          if (this.source === 'product') {
            this.shareMsg.pageUrl += '&productid=' + this.$route.query.productid;
          }
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
          console.log(this.wxUserMsg);
          this.pageListener(wxUserMsg.openid);
        }
        this.inWX = true;
        document.getElementsByClassName('article-container')[0].setAttribute('style', 'padding-top:60px;padding-bottom:0px;');
        if (this.showCard === true) {
          // 微信分享文章
          this.cardListener = setInterval(() => {
            if (document.getElementsByClassName('bsCard')[0]) {
              clearInterval(this.cardListener);
              document.getElementsByClassName('bsCard')[0].setAttribute('style', 'top:0px;');
            }
          }, 500);
        }
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
      self.sharePerImg = result.user.avatar;
      self.sharePerName = result.user.name;
      self.sharePerCompany = '泸州老窖集团有限责任公司';
      self.sharePerPhone = result.user.mobile;

      self.articleMsg.articleContext = result.article.articleContext;
      self.articleMsg.articleTitle = result.article.articleTitle;
      self.articleMsg.articleAuthor = result.article.articleOriginAuthor;
      self.articleMsg.articleAccountName = result.article.articleAccountName;
      self.articleMsg.articlePower = result.article.articlePower;
      self.articleMsg.coverImg = result.article.articleImage;
      this.loading = false;
      // 页面渲染完成后在执行
      self.$nextTick(() => {
        self.adjustSize();
      })
    },
    onClickLeft() {
      if (this.source === 'product') {
        this.$router.push("/productList");
      } else {
        this.$router.push("/contextShareList");
      }
    },
    // 删除文章
    deleteArticle() {
      let self = this;
      this.$dialog.confirm({
        title: '',
        message: '您确定删除这篇文章吗',
        confirmButtonColor: '#4876f1',
      })
        .then(async () => {
          // 向后台发送删除文章的请求
          let postData = {
            id: self.articleId
          }
          let url = JSON.parse(getUrl()).contextShare.deleteArticle;
          const result = (await this.$http.delete(url, {params: postData})).data;
          if (result.code == 200) {
            if (this.source === 'product') {
              let url = "/api/se/product/delete";
              let postData = {
                id: this.$route.query.productid
              }
              const result = (await this.$http.post(url, JSON.stringify(postData), {headers: {"Content-Type": "application/json"}})).data
              if (result.code === 200) {
                Toast("删除成功！");
                this.$router.push('/productList');
              } else {
                Toast('产品删除失败,错误码' + result.code);
              }
            } else {
              self.$router.push("/contextShareList");
            }
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
      let url = JSON.parse(getUrl()).userInfo.yyConfig;
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
      } else {
        shareMsg.type = '2';
      }
      await yyApi.yyRegister(yyConfig, shareMsg, 2);
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
          wmId: this.wmId,
          ifShowShareMan: this.showCard,
          source: this.source
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
      if (this.source === 'product') {
        this.$router.push({
          path: '/productEdit',
          query: {
            articleid: this.articleId,
            shareid: JSON.parse(getUserId()).userID,
            wmid: this.$store.state.userMessage.wmId,
            ifshowshareman: true,
            source: 'product',
            productID: this.$route.query.productid,
          }
        })
      } else {
        let shareId = JSON.parse(getUserId()).userID;
        this.$store.commit('updateEditReqArticle', this.articleMsg);
        this.$store.commit('updateTempArticle', this.article);
        this.$router.push({
          name: 'repArticleDetail',
          query: {
            type: '1',
            articleId: this.articleId,
            shareId: shareId,
            wmId: this.wmId,
            ifShowShareMan: this.showCard,
            source: this.source
          }
        });
      }
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
    },
    // 获取分销链接
    async getDistributeUrl() {
      let url = JSON.parse(getUrl()).contextShare.getDistributeUrl;
      // 微盟id要从url里进行截取
      let getData = {
        id: this.wmId
      }
      const result = (await this.$http.get(url, {params: getData})).data;
      if (result.code === 200 || result.code === '200') {
        this.distributeUrl = result.data;
      }
    },
    // 为产品绑定分销链接
    addUrlToProduct() {
      let productUrl = document.querySelectorAll('.productDiv');
      for (let index = this.productCount; index < productUrl.length; index++) {
        productUrl[index].addEventListener('click', () => {
          location.href = this.distributeUrl;
        });
      }
      this.productCount = productUrl.length;
    },
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

/deep/ p {
  margin-block-start: 0em;
  margin-block-end: 0em;
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
  background-color: #4876f1;
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
