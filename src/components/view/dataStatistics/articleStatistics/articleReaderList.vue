<template>
  <div class="container">
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div class="list-container">
      <div class="list" v-for="(item,index) in list" :key="index">
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
            <p class="readerLabel">{{ item.readerStatus != null ? item.readerStatus : '未知' }}</p>
          </div>
          <div class="right-bottom">
            <p class="readers">阅读时长：{{ item.readTime }}秒</p>
          </div>
        </div>
        <p class="shareBtn">{{ item.readDate }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../../component/HeaderNavBar";
import {getUrl} from "../../../../utils/replaceUrl";
import {Toast} from "vant";

export default {
  name: "articleReaderList",
  components: {
    HeaderNavBar
  },
  data() {
    return {
      navTitle: '阅读者列表',
      list: []
    }
  },
  created() {
    this.onLoad();
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        name: 'singleArticleStats',
        query: {
          articleId: this.$route.query.articleId
        }
      });
    },
    async onLoad() {
      let url = JSON.parse(getUrl()).contextShare.readRecordList;
      let getData = {
        articleId: this.$route.query.articleId,
        shareId: this.$route.query.shareId
      };
      const resultMsg = (await this.$http.get(url, {params: getData})).data;
      const result = resultMsg.data;
      this.readPeople = result.readPeople;
      this.readTimes = result.readTimes;
      let readRecord = result.wxReadRecords;
      this.list.push(...readRecord);
    }
  }
}
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100vh;
}

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
