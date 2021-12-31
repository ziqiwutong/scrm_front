<template>
  <div>
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <!--列表-->
    <van-pull-refresh v-model="loading" @refresh="refreshList">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div class="list-container">
          <div class="list" v-for="(item,index) in wxUserList" :key="index">
            <div class="left">
              <van-image
                width="50"
                height="50"
                :src="item.headimgurl"
              />
            </div>
            <div class="right">
              <div class="right-top">
                <p class="readerName">{{ item.nickname }}</p>
<!--                <p class="readerLabel">{{ item.readerStatus != null ? item.readerStatus : '未知' }}</p>-->
              </div>
              <div class="right-bottom">
                <p class="readers">阅读时长：{{ item.readTime }}秒</p>
              </div>
            </div>
            <p class="shareBtn">{{ item.readDate }}</p>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {getUrl} from "../../../../utils/replaceUrl";
import HeaderNavBar from "../../../component/HeaderNavBar";

export default {
  name: "wxUserList",
  components:{
    HeaderNavBar
  },
  data() {
    return {
      navTitle:'微信用户列表',
      loading: false,
      finished: false,
      pageProps: {
        pageNum: 1,
        pageSize: 20
      },
      wxUserList:[]
    }
  },
  methods:{
    onClickLeft() {
      this.$router.push('/contextShareList');
    },
    async onLoad(){
      let url = JSON.parse(getUrl()).statistics.wxRead.userList;
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
      }
      const resultMsg = (await this.$http.get(url, {params: postData})).data
      let result = resultMsg.data;
      if (resultMsg.code !== 200) {
        this.$toast('请求失败，请重试');
        return;
      }

      if (result.length === 0) {
        // 已加载全部数据
        this.finished = true;
        this.$toast('已加载全部数据！');
      }
      this.wxUserList.push(...result);
      // 加载状态结束
      this.loading = false;
    },
    refreshList(){
      this.wxUserList = [];
      this.finished = false;
      this.pageProps.pageNum = 1;
      this.onLoad();
    }
  }
}
</script>

<style scoped lang="less">
.list-container {
  padding-top: 44px;
  overflow-y: auto;
}

.list {
  position: relative;
  display: inline-flex;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border-bottom: 1px solid #f7f8fa;
}

.left {
  margin-right: 10px;
}

/deep/ .left img {
  border-radius: 50%;
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
  height: 20px;
  top: calc(50% - 10px);
  color: #d0cece;
}

.right {
  height: 50px;
  position: relative;
}

.right-top {
  display: inline-flex;
  height: 20px;
  line-height: 20px;
  margin-bottom: 15px;
}

.readerLabel {
  background-color: rgba(191, 155, 241, 0.2);
  padding: 0px 5px;
  color: #4876f1;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 0.5rem;
}

.readerName {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right-bottom {
  height: 15px;
  width: 50vw;
  line-height: 15px;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
