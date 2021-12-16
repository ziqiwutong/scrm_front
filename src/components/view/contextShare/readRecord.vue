<template>
  <div class="main-wrap">
    <div class="header-wrapper">
      <div class="header">
        <span class="returnIcon" @click="returnClick" v-show="!headerCancelShow"></span>
        <van-tabs v-model="activeName" class="scrm-tab" @click="switchTab">
          <van-tab title="所有分享" name="allShare"></van-tab>
          <van-tab title="我的分享" name="myShare"></van-tab>
        </van-tabs>
        <span class="header-cancel" v-show="headerCancelShow" @click="cancelCheck">取消</span>
        <span class="header-myCheck" v-show="!allShare&&!headerCancelShow" @click="myCheck">多选</span>
      </div>
      <div v-show="mainPage" class="readStatistics">
        <p>阅读人数/阅读次数</p>
        <p>{{ readPeople }}/{{ readTimes }}</p>
      </div>
      <div v-show="mainPage&&allShare" class="filterWrap">
        <div class="filterWrap-item" @click="showFilterDialog">
          <van-icon class-prefix="icon-third" name="filter"/>
          <p>筛选</p>
        </div>
        <div class="filterWrap-item" @click="showCheckbox">
          <van-icon class-prefix="icon-third" name="mul-choice"/>
          <p>多选</p>
        </div>
      </div>
    </div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      v-show="mainPage"
    >
      <div class="list" v-for="(item,i) in list">
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
    </van-list>
    <van-popup class="popup" v-model="filterShow" round position="right" :style="{ width: '85%',height:'100%' }"
               :overlay-style="{backgroundColor:'rgba(0,0,0,.5)'}" @close="closeDialog">
      <p class="filterTitle">分享人</p>
      <div class="shareMan">
        <div v-for="item in shareManList" class="shareManItem" :id="item.id"
             @click="personShare(item.id)">
          {{ item.username }}
        </div>
      </div>
      <div class="filterBottom">
        <van-button plain hairline type="info" color="#8c3fff" @click="cancelBtn">重置</van-button>
        <van-button plain hairline type="info" color="white" style="background-color: #8c3fff" @click="sureBtn">确定
        </van-button>
      </div>
    </van-popup>
    <van-checkbox-group v-model="checkResultT" v-show="!mainPage" class="checkList" ref="checkboxGroup" :max="1">
      <van-cell-group class="cellList" id="cellList">
        <van-cell
          clickable
          :key="index"
          @click="toggle(index,item)"
          v-for="(item, index) in list"
        >
          <template #right-icon>
            <van-checkbox :name="item.openid" ref="checkboxes" checked-color="#6600ff"
                          :disabled="item.readerStatus === null?false:true"/>
          </template>
          <div class="list">
            <div class="left">
              <van-image
                width="50"
                height="50"
                :src="item.headImgUrl"
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
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
    <div class="checkReader" v-show="!mainPage">
      <!--      <van-checkbox v-model="allChecked" @click="checkAllReader(0)" checked-color="#6600ff">全选</van-checkbox>-->
      <van-button color="#7232dd" @click="batchAddCustomer">导入到客户池</van-button>
    </div>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import {Toast} from "vant";
import {getUrl} from "../../../utils/replaceUrl";

export default {
  name: "readRecord",
  data() {
    return {
      articleId: '',
      shareManId: '',
      wmId: '',
      activeName: 'allShare',
      list: [],
      loading: false,
      finished: false,
      filterShow: false,
      allShare: true,
      pageProps: {
        pageNum: 1,
        pageSize: 20
      },
      shareManList: [],
      shareManCosList: [],
      mainPage: true,
      checkResult: [],
      checkResultT: [],
      headerCancelShow: false,
      allChecked: false,
      cellListLength: [],
      readPeople: '',
      readTimes: ''
    }
  },
  created() {
    this.articleId = this.$route.query.articleId;
    this.shareManId = this.$route.query.shareId;
    this.wmId = this.$route.query.wmId;
  },
  watch: {
    // 以下代码应用于上拉刷新
    'mainPage': {
      deep: true,
      handler: function () {
        if (!this.mainPage) {
          // document.getElementById("cellList").addEventListener('scroll', this.checkBoxLoad);
          window.addEventListener('scroll', this.checkBoxLoad, true)
        } else {
          // document.getElementById("cellList").removeEventListener('scroll', this.checkBoxLoad);
          window.removeEventListener('scroll', this.checkBoxLoad, true)
        }
      }
    }
  },
  methods: {
    returnClick() {
      // 带着articleId&shareId&ifShowShareMan去请求文章详情页
      this.$router.push({
        name: 'articleDetail',
        query: {
          articleid: this.articleId,
          shareid: this.$route.query.shareId,
          wmid: this.wmId,
          ifshowshareman: this.$route.query.ifShowShareMan
        }
      });
    },
    switchTab(name) {
      let headerWrapper = document.querySelector('.header-wrapper');
      let headerList = document.querySelector('.van-list');
      if (name === 'myShare') {
        headerWrapper.classList.add('myShareHeader');
        headerList.classList.add('myShareList');
      } else {
        headerWrapper.classList.remove('myShareHeader');
        headerList.classList.remove('myShareList');
      }
      this.pageProps.pageNum = 1;
      this.list = [];
      this.cellListLength = [];
      if (name == "myShare") {
        this.allShare = false;
        this.shareManCosList.push(this.shareManId);
      } else {
        this.allShare = true;
        this.shareManCosList = [];
      }
      this.onLoad();
      this.loading = true;
    },
    // 列表加载
    async onLoad() {
      let url = JSON.parse(getUrl()).contextShare.readRecordList;
      let getData = {
        articleId: this.articleId,
        shareId: this.shareManCosList,
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize
      };
      // const result = (await this.$http.get(url, {params: getData})).data.data
      const result = (await this.$http.get(url + "?" + qs.stringify(getData, {arrayFormat: 'repeat'}))).data.data
      this.readPeople = result.readPeople;
      this.readTimes = result.readTimes;
      let readRecord = result.wxReadRecords;
      for (let i = 0; i < readRecord.length; i++) {
        this.list.push(readRecord[i]);
      }
      if (result.wxReadRecords.length < 20) {
        // 加载状态结束
        this.finished = true;
        Toast('已加载全部数据！');
      }
      this.loading = false;
    },
    // 展示筛选dialog
    async showFilterDialog() {
      this.filterShow = !this.filterShow;
      let url = JSON.parse(getUrl()).contextShare.queryShareMan;
      let postData = {
        articleId: this.articleId
      }
      const result = (await this.$http.get(url, {params: postData})).data.data;
      this.shareManList = result;
    },
    // 选择分享人
    personShare(shareManId) {
      let shareManList = this.shareManCosList;
      let shared = false;
      for (let i = 0; i < shareManList.length; i++) {
        if (shareManList[i] == shareManId) {// 取消选中,id为int型
          shared = true;
          document.getElementById(shareManId).setAttribute("style", "border:none");
          this.shareManCosList.splice(i, 1);//分享人数组中删除该元素
          break;
        }
      }
      if (shared == false) {
        document.getElementById(shareManId).setAttribute("style", "border:1px solid #8c3fff");
        this.shareManCosList.push(shareManId);//分享人可多选，每次选中后就进数组
      }
    },
    // 分享面板重置
    cancelBtn() {
      let shareManList = this.shareManCosList;
      for (let i = shareManList.length - 1; i >= 0; i--) {
        document.getElementById(shareManList[i]).setAttribute("style", "border:none");
        this.shareManCosList.pop();
      }
    },
    // 分享人提交
    sureBtn() {
      this.list = [];
      // 按选中的分享人加载列表
      this.onLoad();
      this.filterShow = false;
    },
    // 关闭筛选弹窗
    closeDialog() {
      // this.shareManCosList = [];// 分享人数组置空  其实不应该置空,因此注释了
    },
    // 展示多选列表
    showCheckbox() {
      let headerWrapper = document.querySelector('.header-wrapper');
      headerWrapper.classList.add('checkListHeader');
      let self = this;
      this.mainPage = false;
      this.headerCancelShow = true;
      // console.log(self.activeName)
      self.switchTab(self.activeName);
    },
    // 收起多选列表
    cancelCheck() {
      let headerWrapper = document.querySelector('.header-wrapper');
      headerWrapper.classList.remove('checkListHeader');
      this.checkResult = [];
      this.checkResultT = [];//用于页面展示选中效果
      this.mainPage = true;
      this.headerCancelShow = false;
    },
    // 复选框触发器
    toggle(index, item) {
      if (this.checkResult.length > 1 && !this.$refs.checkboxes[index].checked) {
        this.$toast('每次只能导入一名客户');
        return;
      }
      if (!this.$refs.checkboxes[index].checked) {// 选中时才加入数组
        this.checkResult.push(item);
        let wxUser = {
          imgUrl: item.headimgurl,
          nickName: item.nickname
        }
        this.$store.commit('updateWxUserMsg', wxUser);
      } else {// 取消选中时需要从数组中删除这个元素
        this.checkResult = [];
      }
    },
    // 我的分享多选
    myCheck() {
      this.mainPage = false;
      this.allShare = true;
      this.headerCancelShow = true;
      this.activeName = "myShare";
      this.switchTab(this.activeName);
    },
    // 全选
    checkAllReader(startIndex) {
      let self = this;
      if (self.allChecked == true) {// 标签被勾选了
        self.$refs.checkboxGroup.toggleAll(true);
        for (let i = startIndex; i < self.list.length; i++) {
          let hasInArray = self.hasInArray(self.list[i].readerID, self.checkResult);
          if (!hasInArray) {
            self.checkResult.push(self.list[i]);
          }
        }
      } else { // 取消勾选
        self.$refs.checkboxGroup.toggleAll(false);
        self.checkResult = [];
      }
    },
    // 封装判断数组中是否包含当前元素的方法
    hasInArray(element, array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].indexOf(element) != -1) {
          return true;
        }
      }
      return false;
    },
    // 批量添加reader至客户池
    async batchAddCustomer() {
      this.$router.push({
        name: 'articleToAddForm',
        query: {
          articleId: this.articleId,
          shareId: this.$route.query.shareId,
          wmId: this.wmId,
          ifShowShareMan: this.$route.query.ifShowShareMan
        }
      });
    },
    // 多选列表加载
    checkBoxLoad() {
      let self = this;
      if (this.$route.name === 'readRecord' && this.list.length > 0) {//列表不为空时才判断是否滚动到页面底部
        let parEle = document.getElementsByClassName("van-cell");
        let parLength = document.getElementsByClassName("van-cell").length;
        let lastEle = parEle[parLength - 1];
        let graEle = document.getElementsByClassName("checkList")[0];
        if (lastEle.getBoundingClientRect().top < graEle.offsetHeight) {
          let cellEle = self.cellListLength.length - 1
          let startIndex = parseInt(this.cellListLength[cellEle]);
          if (!this.hasInArray(parLength, this.cellListLength)) {// 滚动条到底部后只执行一次后台请求
            this.cellListLength.push("" + parLength);
            this.onLoad();
            this.checkAllReader(startIndex);
          }
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
.main-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 124px;
  width: 100%;
  background-color: white;
  z-index: 99;
}

.myShareHeader {
  height: 100px;
}

/deep/ .van-list {
  margin-top: 125px;
  height: calc(100vh - 125px);
  overflow-y: auto;
}

.myShareList {
  margin-top: 100px;
  height: calc(100vh - 100px);
}

.checkListHeader {
  height: 50px;
}

.checkList {
  margin-top: 50px;
  margin-bottom: 65px;
  overflow-y: auto;
  height: calc(100vh - 115px);
}

.checkReader {
  display: inline-flex;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  width: 100%;
  padding: 10px 10px;
  padding-left: 50%;
  border-top: 1px solid #f5f6f7;
  //justify-content: space-between;
}

.header {
  display: inline-flex;
  height: 44px;
  padding-left: 30px;
}

.returnIcon {
  position: absolute;
  top: 18px;
  left: 15px;
  border-top: 1px solid;
  border-right: 1px solid;
  width: 8px;
  height: 8px;
  border-color: #5f6368;
  transform: rotate(-135deg);
}

.header-cancel {
  position: absolute;
  top: 13px;
  right: 10px;
  font-size: 13px;
}

.header-myCheck {
  position: absolute;
  top: 13px;
  right: 10px;
  font-size: 13px;
  color: #8c3fff;
}

/deep/ .van-tabs__line {
  width: 10vw;
  background-color: #3333cc;
}

.readStatistics {
  display: inline-flex;
  height: 2.5rem;
  width: calc(100% - 20px);
  border: 1px solid #f6f6f6;
  margin: 10px;
  padding: 5px 10px;
  box-sizing: border-box;
  justify-content: space-between;
}

.readStatistics p {
  font-size: 12px;
  line-height: 2rem;
  border-radius: 5px;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.filterWrap {
  display: flex;
  width: calc(100% - 20px);
  height: 1.5rem;
  background-color: #f3f3f3;
  margin: 0px 10px;
}

.filterWrap-item {
  display: flex;
  box-sizing: border-box;
  width: 50%;
  align-items: center;
  padding-left: 20%;
}

.filterWrap-item p {
  display: inline;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
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
  color: #6600ff;
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

/deep/ .van-popup--right.van-popup--round {
  padding: 5%;
  box-sizing: border-box;
}

.popup {
  display: flex;
  flex-direction: column;
}

.filterTitle {
  margin-bottom: 10px;
}

.shareMan {
  flex: 1;
  display: flex;
  flex-wrap: wrap; //允许换行
  //justify-content: space-between;
  align-content: baseline;
  overflow: auto;
}

.shareManItem {
  width: 29%;
  height: 2.5rem;
  margin-bottom: 10px;
  background-color: #fafafa;
  text-align: center;
  line-height: 2.5rem;
  border-radius: 5px;
  font-size: 13px;
  margin-right: 3%;
  color: #5f6368;
}

.filterBottom {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

/deep/ .van-button--normal {
  width: 45%;
}

/deep/ .van-cell {
  padding: 0 10px;
}

.hidden {
  display: none;
}
</style>
