<template>
  <div>
    <van-tabs v-model="activeName" class="scrm-tab">
      <van-tab title="内容营销" name="article">内容营销</van-tab>
      <van-tab title="数据统计" name="statistics">数据统计</van-tab>
    </van-tabs>
    <form action="/" v-if="searchShow">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="请输入搜索关键词"
        autofocus="true"
        @search="onSearch"
        @cancel="onSearchCancel"
      />
    </form>
    <van-search v-model="searchValue" placeholder="请输入搜索关键词" v-else @click="ifShowSearch"/>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="list" v-for="(item,i) in list">
        <div class="left" @click="toArticleDetail(item.articleID)">
          <van-image
            width="50"
            height="50"
            :src="item.articleIcon"
          />
        </div>
        <div class="right" @click="toArticleDetail(item.articleID)">
          <div class="right-top">
            <p>{{ item.articleTitle }}</p>
          </div>
          <div class="right-bottom">
            <p class="readers">{{ item.articleFrequency }}人已读</p>
          </div>
        </div>
        <van-button type="primary" size="mini" class="shareBtn" @click="showShareDialog">立即分享</van-button>
      </div>
    </van-list>
    <van-share-sheet v-model="showShare" :options="options"/>
    <van-action-sheet v-if="show"
                      v-model="show"
                      :actions="actions"
                      cancel-text="取消"
                      close-on-click-action
                      @cancel="onCancel"
    />
    <CreateContext @ifShow="ifShowDialog" v-else/>
    <TabBar/>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import TabBar from "../..//component/TabBar";
import CreateContext from "../../component/CreateContext";
import {Toast} from "vant";

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
      pageProps: {
        pageNum: 1,
        pageSize: 10
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
      actions: [{name: '拍照创建内容海报'}, {name: '上传图片创建内容海报'}, {name: '转载公众号文章'}]
    };
  },
  created() {
    this.$store.commit('updateTabBarActive', 2);
  },
  methods: {
    // 是否在搜索框输入内容
    ifShowSearch() {
      this.searchShow = true;
    },
    // 取消搜索
    onSearchCancel() {
      this.searchShow = false;
      this.searchValue = '';
    },
    // 关键字搜索
    async onSearch() {
      let url = "/api/queryArticleByKey";
      let postData = {
        keySearch: this.searchValue
      }
      this.list = [];
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = true;
      this.finished = true;
      Toast('已加载全部数据！');
    },
    // 列表加载
    async onLoad() {
      let url = "/api/queryArticleList";
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      if (result.length == 0) {
        // 已加载全部数据
        this.finished = true;
        Toast('已加载全部数据！');
      }
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = false;
    },
    showShareDialog() {
      this.showShare = true
    },
    onCancel() {
      this.show = false;
    },
    ifShowDialog() {
      this.show = true;
    },
    // 跳转至文章详情页
    async toArticleDetail(articleID) {
      // 带着articleID&shareID去请求文章详情页
      this.$router.push('/articleDetail');
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

/deep/ .van-share-sheet__options {
  justify-content: space-around;
}

/deep/ .van-overlay {
  background-color: rgba(0, 0, 0, .3);
}
</style>
