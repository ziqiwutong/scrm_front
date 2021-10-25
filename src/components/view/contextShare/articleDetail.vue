<template>
  <div>
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div class="article-container">
      <h2>{{ title }}</h2>
      <div class="article-msg">
        <p>{{ author }}</p>
        <p>{{ date }}</p>
      </div>
      <div v-html="article" class="article"></div>
    </div>
    <van-share-sheet v-model="showShare" :options="options"/>
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
        <div class="bottomTab-left-third" @click="deleteArticle">
          <van-icon name="delete-o" size="19px"/>
          <p>删除</p>
        </div>
      </div>
      <div class="bottomTab-right" @click="shareArticle">
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
      showCard: false,
      inWX: false,
      shareId: '',
      sharePerImg: "",
      sharePerName: "",
      sharePerCompany: "",
      sharePerPhone: "",
      showShare: false,
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
    }
  },
  created() {
    this.articleId = this.$route.query.articleId;
    this.shareId = this.$route.query.shareId;
    this.showCard = this.$route.query.ifShowShareMan;
    this.getArticle();
  },
  mounted() {
    this.judgeEnv();
    if (this.showCard == false) {
      let element = document.getElementsByClassName('article-container')[0];
      element.setAttribute('style', 'padding-top:30px;');
    }
  },
  methods: {
    // 判断环境为微信还是app
    judgeEnv() {
      let user = navigator.userAgent.toLowerCase();
      if (user.match(/MicroMessenger/i) == "micromessenger") {
        this.inWX = true;
        document.getElementsByClassName('article-container').setAttribute('style', 'padding-bottom:0px;');
      } else {
        this.inWX = false;
      }
    },
    async getArticle() {
      let self = this;
      let url = "/api/queryArticle";
      let postData = {
        id: self.articleId,
        shareId: self.shareId
      }
      const result = (await self.$http.post(url, qs.stringify(postData))).data.data;
      // const result = (await self.$http.get(url, {params:{id: 1, shareId: 1}})).data.data;
      self.title = result.title;
      self.author = result.author;
      self.date = result.date;
      self.article = result.article;
      let lastWord = result.sharePerName.slice(-1);
      self.sharePerImg = result.sharePerImg == "" ? lastWord : result.sharePerImg;
      self.sharePerName = result.sharePerName;
      self.sharePerCompany = result.sharePerCompany;
      self.sharePerPhone = result.sharePerPhone;
      self.$nextTick(() => {
        let imgArray = document.querySelectorAll('img');
        for (let index = 0; index < imgArray.length; index++) {
          imgArray[index].setAttribute('style', 'max-width:100%;');
        }
      })
    },
    onClickLeft() {
      this.$router.push("/contextShareList");
    },
    deleteArticle() {
      let self = this;
      this.$dialog.confirm({
        title: '温馨提示',
        message: '您确定删除这篇文章吗',
      })
        .then(async () => {
          // 向后台发送删除文章的请求
          let postData = {
            articleId: self.articleId
          }
          let url = "/api/deleteArticle";
          const result = (await this.$http.post(url, qs.stringify(postData))).data;
          if (result.code == 200) {
            Toast("删除成功！");
            self.$router.push("/contextShareList");
          }
        })
        .catch(() => {
          // 不删除文章
        });
    },
    shareArticle() {
      this.showShare = true;
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
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  padding-top: 100px;
  padding-bottom: 60px;
  background-color: #fafafa;
}

.article {
  text-align: center;
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

.header {
  background-color: rgb(245, 245, 245) !important;
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
  width: 40vw;
  margin-right: 10vw;
  justify-content: space-around;
}

.bottomTab-right {
  width: 50vw;
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
</style>
