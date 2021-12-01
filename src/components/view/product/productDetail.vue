<template>
  <div>
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft" v-show="!inWX"/>

    <div class="article-container">
      <img class="productPic1" src="../../../assets/mmexport1631806085595.jpg"  width="100%" />
      <div>
 <van-row class="content1">
   <van-col class="price" offset="2" span="16">￥{{productPrice}}</van-col>
   <van-col offset="2" span="16">{{productName}}</van-col>
 </van-row>
        <div class="detail">
      <div class="productIntro">{{productIntro}}</div>
        </div>
      </div>

      <div class="article-msg">
      </div>
      <div v-html="article" class="article"></div>
    </div>

    <van-share-sheet v-model="showShare" :options="options" @select="shareArticle"/>
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

export default {
  name: "productDetail",
  components: {BusinessCard, NavBar, HeaderNavBar},
  data() {
    return {
      navTitle: "产品详情",
      title: "",
      author: "",
      date: "",
      productPrice:"100",
      productName:"爱藏寿酒",
      productIntro:"瑞丽集团旗下的锁唇国际酒业主营进口葡萄酒业务，与全球知名的葡萄酒集团合作，为消费者提供源自澳大利亚的高品质佳酿。",
      articleId: "123",
      article: "",
      showCard: false,
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
    }
  },
  created() {
    this.articleId = this.$route.query.articleId;
    this.shareId = this.$route.query.shareId;
    this.showCard = this.$route.query.ifshowshareman;
    this.getProduct();
    let user = navigator.userAgent.toLowerCase();
    if (user.match(/MicroMessenger/i) == "micromessenger") {
      this.timer = setInterval(() => {
        this.readTime++;
      }, 1000);
    }
  },
  mounted() {
    this.judgeEnv();
    if (this.showCard == false) {
      let element = document.getElementsByClassName('article-container')[0];
      element.setAttribute('style', 'padding-top:30px;');
    }
  },
  async beforeDestroy() {
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
      privilege: this.wxUserMsg.privilege,
      unionid: this.wxUserMsg.unionid
    }
    const wxUserMsg = (await this.$http.post(url, postData)).data;
    console.log(wxUserMsg.code);
  },
  methods: {
    // 判断环境为微信还是app
    async judgeEnv() {
      let user = navigator.userAgent.toLowerCase();
      if (user.match(/MicroMessenger/i) == "micromessenger") {
        let url = window.location.href.split('#')[0];
        // 不存在code则代表是未授权页面
        if (!this.$route.query.code) {
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
        }
        this.inWX = true;
        document.getElementsByClassName('article-container')[0].setAttribute('style', 'padding-top:60px;padding-bottom:0px;');
        document.getElementsByClassName('bsCard')[0].setAttribute('style', 'top:0px;');
        // 微信分享文章
        this.shareArticle();
        // 监听页面滚动事件
        window.addEventListener("scroll", this.scrolling)
      } else {
        this.inWX = false;
      }
    },
    async getProduct() {
      let self = this;
      let url = "/api/se/product/productDetail"
      let postData = {
        productID: self.productId,
        shareId: self.shareId
      }
      const result = (await self.$http.get(url, {params: postData})).data.data;
      // self.title = result.article.articleTitle;
      // if (result.article.articleType === 1) {
      //   self.author = result.article.articleOriginAuthor;
      // } else {
      //   self.author = result.article.authorName;
      // }
      self.date = '';
      // self.article = result.article.articleContext;
      let lastWord = result.sharePerName.slice(-1);
      self.sharePerImg = result.sharePerIcon === "" ? lastWord : result.sharePerIcon;
      self.sharePerName = result.sharePerName;
      self.sharePerCompany = '泸州老窖集团有限责任公司';
      self.sharePerPhone = result.sharePerPhone;

      self.productType = result.productType;
      self.productName = result.productName
      self.productPrice = result.productPrice
      self.productIntro = result.productIntro
      // self.articleMsg.articleContext = result.article.articleContext;
      // self.articleMsg.articleTitle = result.article.articleTitle;
      // self.articleMsg.articleAuthor = result.article.articleOriginAuthor;
      // self.articleMsg.articleAccountName = result.article.articleAccountName;
      // self.articleMsg.articlePower = result.article.articlePower;
      // self.articleMsg.coverImg = result.article.articleImage;
      // 页面渲染完成后在执行
      // self.$nextTick(() => {
      //   self.adjustSize();
      // })
    },
    async getArticle() {
      let self = this;
      let url = JSON.parse(getUrl()).contextShare.articleDetail
      let postData = {
        id: self.articleId,
        shareId: self.shareId
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
      let lastWord = result.user.username.slice(-1);
      self.sharePerImg = result.user.username == "" ? "酒" : lastWord;
      self.sharePerName = result.user.username;
      self.sharePerCompany = '泸州老窖集团有限责任公司';
      self.sharePerPhone = result.user.telephone;

      // self.articleMsg.articleContext = result.article.articleContext;
      // self.articleMsg.articleTitle = result.article.articleTitle;
      // self.articleMsg.articleAuthor = result.article.articleOriginAuthor;
      // self.articleMsg.articleAccountName = result.article.articleAccountName;
      // self.articleMsg.articlePower = result.article.articlePower;
      // self.articleMsg.coverImg = result.article.articleImage;
      // 页面渲染完成后在执行
      // self.$nextTick(() => {
      //   self.adjustSize();
      // })
    },
    onClickLeft() {
      this.$router.push("/productList");
    },
    // 删除文章
    deleteArticle() {
      let self = this;
      this.$dialog.confirm({
        title: '温馨提示',
        message: '您确定删除这个产品吗',
        confirmButtonColor: '#645fd7',
      })
        .then(async () => {
          let url = "/api/se/product/deleteProduct";
          let postData = {
            productID: this.productID
          }
          const result1 = (await this.$http.post(url, qs.stringify(postData))).data;
          if (result1.code === 200) {
            Toast('产品删除成功');
            this.$router.push('productList');
          } else
            Toast('订单删除失败,错误码' + result1.code);
        })
        .catch(() => {
        });
    },
    showShareArticle() {
      this.showShare = true;
    },
    async shareArticle() {
      // 先去后台拿微信的jsConfig，然后触发分享事件，传给后台的pageUrl不需要编码
      let postData = {
        url: window.location.href.split('#')[0]
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
    // adjustSize() {
    //   let bodyWidth = document.body.clientWidth;
    //   let sectionArray = document.getElementsByTagName('section');
    //   let pArray = document.getElementsByTagName('p');
    //   let imgArray = document.getElementsByTagName('img');
    //   if (document.querySelector('#js_pc_qr_code')) {
    //     let qrCodeEle = document.querySelector('#js_pc_qr_code');
    //     qrCodeEle.setAttribute('style', 'display:none;');
    //   }
    //   for (let index = 0; index < sectionArray.length; index++) {
    //     let eleWidth = parseInt(getComputedStyle(sectionArray[index], null).getPropertyValue('width'));
    //     // 如果元素宽度大于页面宽度，则需要进行自适应
    //     if (eleWidth > bodyWidth) {
    //       sectionArray[index].setAttribute('style', 'max-width:98% !important');
    //     }
    //   }
    //   for (let index = 0; index < pArray.length; index++) {
    //     let eleWidth = parseInt(getComputedStyle(pArray[index], null).getPropertyValue('width'));
    //     if (eleWidth > bodyWidth) {
    //       pArray[index].setAttribute('style', 'max-width:98% !important');
    //     }
    //   }
    //   for (let index = 0; index < imgArray.length; index++) {
    //     if (imgArray[index].src.startsWith("https://mmbiz.qpic.cn")) {
    //       let dataSrc = imgArray[index].getAttribute('data-src');
    //       let newValue = dataSrc.replace("https://mmbiz.qpic.cn", "/wxResource");
    //       imgArray[index].setAttribute('data-src', newValue);
    //       imgArray[index].src = newValue;
    //     }
    //     if (imgArray[index].src.startsWith("http://mmbiz.qpic.cn")) {
    //       let dataSrc = imgArray[index].getAttribute('data-src');
    //       let newValue = dataSrc.replace("http://mmbiz.qpic.cn", "/wxResource");
    //       imgArray[index].setAttribute('data-src', newValue);
    //       imgArray[index].src = newValue;
    //     }
    //     let eleWidth = parseInt(getComputedStyle(imgArray[index], null).getPropertyValue('width'));
    //     // eleWidth为0表示图片未显示在页面上（图片懒加载的原因），因此也需要添加最大宽度
    //     if (eleWidth > bodyWidth || eleWidth == 0) {
    //       imgArray[index].setAttribute('style', 'max-width:98% !important');
    //     }
    //   }
    // },
    // 编辑文章
    editArticle() {
      let shareId = JSON.parse(getUserId()).userID;
      this.$router.push({
        path: '/productEdit',
        query: {
          productID: this.productId,
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
/deep/ .van-nav-bar__left{
  font-size: 1rem;
}
.productIntro{
  margin-left: 5px;
  margin-right: 5px;
  font-size: 1rem;
  line-height: 25px;
  text-indent:35px;
  letter-spacing:1px;
}
.detail{
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
  text-align: justify;
  //border:2px solid black;
  border-radius: 10px;
  //background-color: lightblue;
}
.productPic1{
  display: table-cell;
  text-align:center;
  margin: 0 auto
}
.content1{
  .price{
    color: #F74A4A;
    font-weight: bold;
    margin-bottom: 3px;
    margin-top: 10px;
  }
}
.article-container {
  padding-top: 45px;
  padding-bottom: 60px;
  //padding-left: 2%;
  //padding-right: 2%;
  //background-color: #fafafa;
}

.article {
  //text-align: center;
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
</style>
