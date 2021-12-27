<template>
  <div class="container">
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <!--搜索-->
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" @search="onSearch"/>
    <div class="article-list">
      <!--列表-->
      <van-pull-refresh v-model="loading" @refresh="refreshList">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="article-single" v-for="(item,index) in articleList">
            <p class="van-ellipsis title">{{ item.articleTitle }}</p>
            <p class="date">创建时间:{{ item.createTime.split(' ')[0] }}</p>
            <p class="time">阅读时长:{{ item.articleReadTimeSum }}秒</p>
            <button class="article-button" @click="toArticleDetail(item.id)">详情</button>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../../component/HeaderNavBar";
import {getUrl} from "../../../../utils/replaceUrl";
import {debounce} from "../../../../utils/debounce";

export default {
  name: "articleList",
  components: {
    HeaderNavBar
  },
  data() {
    return {
      navTitle: '数据看板',
      searchValue: '',
      loading: false,
      finished: false,
      articleList: [],
      pageProps: {
        pageNum: 1,
        pageSize: 20
      },
    }
  },
  created() {
    this.onLoad();
  },
  methods: {
    onClickLeft() {
      this.$router.push('/contextShareList');
    },
    async onLoad() {
      let url = JSON.parse(getUrl()).statistics.articleList;
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
      }
      const resultMsg = (await this.$http.get(url, {params: postData})).data
      const result = resultMsg.data;
      if (resultMsg.code !== 200) {
        this.$toast('请求失败，请重试');
        return;
      }

      if (result.length === 0) {
        // 已加载全部数据
        this.finished = true;
        this.$toast('已加载全部数据！');
      }
      this.articleList.push(...result);//拼接数组
      // 加载状态结束
      this.loading = false;
    },
    refreshList() {
      this.articleList = [];
      this.finished = false;
      this.pageProps.pageNum = 1;
      this.onLoad();
    },
    //查询进行防抖处理
    onSearch: debounce(function () {
      this.showBySearch();
    }, 1000, true),
    async showBySearch() {
      let url = JSON.parse(getUrl()).contextShare.searchByKey;
      let postData = {
        title: this.searchValue
      }
      this.articleList = [];
      const resultMsg = (await this.$http.get(url, {params: postData})).data
      if (resultMsg.code !== 200) {
        this.$toast('查询失败，请重试');
        return;
      }
      const result = resultMsg.data;
      this.articleList = result;
    },
    toArticleDetail(id) {
      this.$router.push({
        name: 'singleArticleStats',
        query: {
          articleId: id
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/deep/ .van-search {
  margin-top: 44px;
  width: 100vw;
}

.article-list {
  flex: 1;
  box-sizing: border-box;
  background-color: #f7f8fa;
  overflow-y: auto;
  padding: 10px 0px;
}

.article-single {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  background-color: white;
  margin-bottom: 10px;
}

.article-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 6rem;
  height: 1.8rem;
  color: white;
  background-color: #4876f1;
  border: none;
  outline: none;
  border-radius: 2px;
}

.title {
  font-family: 'PingFangSC-Medium';
  font-weight: 600;
  font-size: 1.1rem;
}

.date {
  color: #a5a5a5;
}

p {
  line-height: 1.8rem;
  margin-block-start: 0em;
  margin-block-end: 0em;
}
</style>
