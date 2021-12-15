<template>
  <div>
    <div class="header">
      <van-tabs v-model="activeName" class="scrm-tab">
        <van-tab title="内容营销" name="article">内容营销</van-tab>
        <van-tab title="数据统计" name="statistics">数据统计</van-tab>
      </van-tabs>
      <van-search
        v-if="searchShow"
        v-model="searchValue"
        show-action
        placeholder="请输入搜索关键词"
        autofocus="true"
        @search="onSearch"
        @cancel="onSearchCancel"
      />
      <div v-else style="display: inline-flex;width: 100%;">
        <van-search style="width: 70%;" v-model="searchValue" placeholder="请输入搜索关键词" @click="ifShowSearch"/>
        <van-dropdown-menu style="width: 30%;" active-color="#3333cc">
          <van-dropdown-item v-model="dropdownValue" :options="dropdownOption"/>
        </van-dropdown-menu>
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="list" v-for="(item,i) in list">
        <div class="left" @click="toArticleDetail(item.id)">
          <van-image
            width="50"
            height="50"
            :src="item.articleImage"
          />
        </div>
        <div class="right" @click="toArticleDetail(item.id)">
          <div class="right-top">
            <p>{{ item.articleTitle }}</p>
          </div>
          <div class="right-bottom">
            <p class="readers">浏览量:{{ item.articleViewTimes }}次</p>
          </div>
        </div>
        <van-button type="primary" size="small" class="shareBtn" @click="showShareDialog(item)">立即分享</van-button>
      </div>
    </van-list>
    <van-share-sheet v-model="showShare" :options="options" @select="shareArticleApp"/>
    <van-action-sheet v-if="show"
                      v-model="show"
                      :actions="actions"
                      cancel-text="取消"
                      @select="reprintArticle"
                      @cancel="onCancel"
    />
    <CreateContext @ifShow="ifShowDialog" :text="createText" v-else/>
    <TabBar/>
  </div>
</template>

<script>
import TabBar from "../..//component/TabBar";
import CreateContext from "../../component/CreateContext";
import {Toast} from "vant";
import {getUserId} from "../../../network/getToken";
import {getUrl} from "../../../utils/replaceUrl";
import yyApi from "../../../utils/yyApi";
import {ajax} from "../../../utils/ajax";
import {debounce} from "../../../utils/debounce";

export default {
  name: "contextShareList",
  components: {
    CreateContext,
    TabBar
  },
  data() {
    return {
      searchValue: '',
      active: 2,
      activeName: 'article',
      shareId: 1,
      pageProps: {
        pageNum: 1,
        pageSize: 20
      },
      searchShow: false,
      list: [],
      loading: false,
      finished: false,
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
      show: false,
      actions: [{name: '转载公众号文章'}],
      createText: "+创建素材",
      dropdownValue: 1,
      dropdownOption: [
        {text: '企业素材库', value: 1},
        {text: '个人素材库', value: 0}
      ],
      shareMsg: {
        type: '2',
        title: '',
        imageUrl: '',
        desc: '点击查看详情->',
        pageUrl: ''
      },
      /*关键字搜索Api计时,用于防抖*/
      searchApiTime: 0,
      /*内容列表Api计时,用于防抖*/
      listApiTime: 0,
      timer: null
    };
  },
  created() {
    this.$store.commit('updateTabBarActive', 2);
    this.shareId = JSON.parse(getUserId()).userID;
    this.dropdownValue = this.$store.state.articleType;
  },
  watch: {
    dropdownValue: {
      handler() {
        this.$store.commit('updateContextListArticleType', this.dropdownValue);
        this.pageProps.pageNum = 1;
        this.list = [];
        this.onLoad();
      }
    }
  },
  methods: {
    // 是否在搜索框输入内容
    ifShowSearch() {
      this.searchShow = true;
    },
    // 取消搜索
    onSearchCancel: debounce(function () {
      this.reloadList();
    }, 1000, true),
    reloadList() {
      this.searchShow = false;
      this.searchValue = '';
      this.pageProps.pageNum = 1;
      this.list = [];
      this.onLoad();
    },
    // 关键字搜索
    async onSearch() {
      let url = JSON.parse(getUrl()).contextShare.searchByKey;
      let postData = {
        title: this.searchValue
      }
      this.list = [];
      const result = (await this.$http.get(url, {params: postData})).data.data

      for (let i = 0; i < result.length; i++) {
        // 当阅读量过万时，以万为单位
        if (parseInt(result[i].articleViewTimes) > 10000) {
          // 小数部分保留一位
          if ((parseInt(result[i].articleViewTimes) % 10000) > 1000) {
            let firstDecimal = parseInt(result[i].articleViewTimes) % 10000;
            result[i].articleViewTimes = parseInt(result[i].articleViewTimes) / 10000 + '.' + firstDecimal + '万';
          } else {
            result[i].articleViewTimes = parseInt(result[i].articleViewTimes) / 10000 + '万';
          }
        }
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = true;
      this.finished = true;
      Toast('已加载全部数据！');
    },
    // 列表加载
    async onLoad() {
      let url = JSON.parse(getUrl()).contextShare.queryList;
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
        examineFlag: 1,
        materialType: this.dropdownValue
      }

      const result = (await this.$http.get(url, {params: postData})).data.data
      if (result.length == 0) {
        // 已加载全部数据
        this.finished = true;
        Toast('已加载全部数据！');
      }
      for (let i = 0; i < result.length; i++) {
        // 解决微信图片跨域问题
        if (result[i].articleImage.startsWith("https://mmbiz.qpic.cn") || result[i].articleImage.startsWith("http://mmbiz.qpic.cn")) {
          let imageUrl = result[i].articleImage
          if (result[i].articleImage.startsWith("https")) {
            result[i].articleImage = imageUrl.replace("https://mmbiz.qpic.cn", "/wxResource");
          } else {
            result[i].articleImage = imageUrl.replace("http://mmbiz.qpic.cn", "/wxResource");
          }
        }
        if (result[i].articleImage.startsWith("https://mmbiz.qlogo.cn") || result[i].articleImage.startsWith("http://mmbiz.qlogo.cn")) {
          let imageUrl = result[i].articleImage
          if (result[i].articleImage.startsWith("https")) {
            result[i].articleImage = imageUrl.replace("https://mmbiz.qlogo.cn", "/wxResource");
          } else {
            result[i].articleImage = imageUrl.replace("http://mmbiz.qlogo.cn", "/wxResource");
          }
        }
        // 当阅读量过万时，以万为单位
        if (parseInt(result[i].articleViewTimes) > 10000) {
          // 小数部分保留一位
          if ((parseInt(result[i].articleViewTimes) % 10000) > 1000) {
            let firstDecimal = parseInt(result[i].articleViewTimes) % 10000;
            result[i].articleViewTimes = parseInt(result[i].articleViewTimes) / 10000 + '.' + firstDecimal + '万';
          } else {
            result[i].articleViewTimes = parseInt(result[i].articleViewTimes) / 10000 + '万';
          }
        }
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = false;
    },
    showShareDialog(item) {
      let imageUrl = item.articleImage.replace('/wxResource', 'http://mmbiz.qpic.cn');
      this.shareMsg.title = item.articleTitle;
      this.shareMsg.imageUrl = imageUrl;
      this.shareMsg.pageUrl = JSON.parse(getUrl()).baseUrl + 'articleDetail?articleid=' + item.id + '&shareid=' + this.shareId + '&ifshowshareman=true';
      this.showShare = true;
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
      let shareMsg = this.shareMsg;
      if (e.name === '朋友圈') {
        shareMsg.type = '3';
      }
      console.log(shareMsg);
      await yyApi.yyRegister(yyConfig, shareMsg);
      this.showShare = false;
    },
    onCancel() {
      this.show = false;
    },
    ifShowDialog() {
      this.show = true;
    },
    // 跳转至文章详情页
    toArticleDetail(articleId) {
      this.$store.commit('updateContextListArticleType', this.dropdownValue);
      // 带着articleId&shareId去请求文章详情页
      this.$router.push({
        name: 'articleDetail',
        query: {
          articleid: articleId,
          shareid: this.shareId,
          wmid:this.$store.state.userMessage.wmId,
          ifshowshareman: true
        }
      });
    },
    // 转载公众号
    reprintArticle(item) {
      this.$store.commit('updateContextListArticleType', this.dropdownValue);
      this.$router.push('/reprintArticle');
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__wrap {
  width: 40%;
}

/deep/ .van-tabs__line {
  width: 16vw;
  background-color: #3333cc;
}

/deep/ .van-tabs__content {
  display: none;
}

.list {
  position: relative;
  display: inline-flex;
  width: calc(100% - 20px);
  height: 50px;
  padding: 10px;
  border-bottom: 1px solid #f7f8fa;
}

.left {
  margin-right: 10px;
}

p {
  font-size: 13px;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.shareBtn {
  position: absolute;
  right: 10px;
  bottom: 10%;
  background-color: #3333cc;
  border: none;
}

.right {
  height: 50px;
  position: relative;
}

.right-top {
  height: 20px;
  line-height: 20px;
  margin-bottom: 15px;
}

.right-top p {
  width: 75vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-bottom {
  height: 15px;
  line-height: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 99;
}

/deep/ .van-list {
  margin-top: 100px;
}

/deep/ .van-share-sheet__options {
  justify-content: space-around;
}

/deep/ .van-overlay {
  background-color: rgba(0, 0, 0, .3);
}

/deep/ van-search {
  width: 60%;
}

/deep/ .van-dropdown-menu__bar {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  height: 3rem;
  background-color: #fff;
  box-shadow: none;
}
</style>
