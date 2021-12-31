<template>
  <div class="container">
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div class="chartType">
      <div class="chartType_btnGroup">
        <button class="sevenDay active" @click="switchChart(0)">7天数据</button>
        <button class="month" @click="switchChart(1)">30天数据</button>
      </div>
    </div>
    <div class="stats" id="stats">
    </div>
    <div class="shareList-title">
      <p>分享者列表</p>
      <div>
        <van-dropdown-menu active-color="#1989fa">
          <van-dropdown-item v-model="checkValue" :options="option" @change="switchList"/>
        </van-dropdown-menu>
      </div>
    </div>
    <div class="shareList">
      <div class="shareListItem" v-for="(item,index) in shareManList" :key="index"
           @click="toWxUserPage(item.iuapUser.id)">
        <div class="shareList-index">
          <button class="shareList-index_button">{{ ++index }}</button>
        </div>
        <div class="shareList-middle">
          <img v-if="item.iuapUser.avatar"
               :src="item.iuapUser.avatar">
          <p v-else class="avatar">{{
              item.iuapUser.name.substring(item.iuapUser.name.length - 1, item.iuapUser.name.length)
            }}</p>
          <span>{{ item.iuapUser.name }}</span>
        </div>
        <div class="shareList-right">
          <p>{{ item.readTimeSum }}秒</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../../component/HeaderNavBar";
import {getUrl} from "../../../../utils/replaceUrl";

const echarts = require('echarts');

export default {
  name: "singleArticleStats",
  components: {
    HeaderNavBar
  },
  data() {
    return {
      navTitle: '数据看板',
      checkValue: 0,
      option: [
        {text: '按时长排序', value: 0},
        {text: '按次数排序', value: 1},
      ],
      // 默认按时间排序
      shareManList: [],
      // 按时间排序
      sortByTime: [],
      // 按次数排序
      sortByTimes: [],
      // 七天的数据
      sevenData: [],
      // 一个月的数据
      monthData: []
    }
  },
  created() {
    this.getShareManList(true);
    this.initSevenData();
    this.initMonthData();
    this.getEchartsData(true);
  },
  mounted() {
    // this.initEcharts();
  },
  methods: {
    onClickLeft() {
      this.$router.push('/articleList');
    },
    initEcharts(echartsData) {
      let echartDom = document.getElementById('stats');
      let myChart = echarts.init(echartDom);
      const data = echartsData;
      const dateList = data.map(function (item) {
        return item[0];
      });
      const valueList = data.map(function (item) {
        return item[1];
      });
      let option = {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 400
          }
        ],
        // title: [
        //   {
        //     left: 'center',
        //     text: 'Gradient along the y axis'
        //   }
        // ],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            data: dateList
          }
        ],
        yAxis: [
          {}
        ],
        grid: [
          {
            bottom: '10%'
          }
        ],
        series: [
          {
            type: 'line',
            showSymbol: false,
            data: valueList
          }
        ]
      };
      option && myChart.setOption(option);
    },
    async getShareManList(sevenFlag) {
      this.shareManList = [];//没有分页请求，因此每次需要置空
      let url = JSON.parse(getUrl()).statistics.article.articleShareList;
      let postData = {
        articleId: this.$route.query.articleId,
        sevenFlag: sevenFlag
      }
      const resultMsg = (await this.$http.get(url, {params: postData})).data
      const result = resultMsg.data;
      if (resultMsg.code !== 200) {
        this.$toast('请求失败，请重试');
        return;
      }
      if (result.length > 0) {
        // for (let i = 0; i < 10; i++) {
        this.shareManList.push(...result);//拼接数组
        // }
        this.$nextTick(() => {
          // 第一、二、三名分别着色
          let shareIndex = document.querySelectorAll('.shareList-index_button');
          shareIndex[0].classList.add('first');
          if (shareIndex.length >= 3) {
            shareIndex[1].classList.add('second');
            shareIndex[2].classList.add('third');
          } else if (shareIndex.length >= 2) {
            shareIndex[1].classList.add('second');
          }
          this.initPageData();
        });
      }
    },
    switchChart(type) {
      let sevenDayBtn = document.querySelector('.sevenDay');
      let monthDayBtn = document.querySelector('.month');
      switch (type) {
        case 0:
          if (sevenDayBtn.classList.contains('active')) {
            sevenDayBtn.classList.remove('active');
            monthDayBtn.classList.add('active');
          } else {
            sevenDayBtn.classList.add('active');
            monthDayBtn.classList.remove('active');
          }
          this.getShareManList(true);
          this.getEchartsData(true);
          break;
        case 1:
          if (monthDayBtn.classList.contains('active')) {
            monthDayBtn.classList.remove('active');
            sevenDayBtn.classList.add('active');
          } else {
            monthDayBtn.classList.add('active');
            sevenDayBtn.classList.remove('active');
          }
          this.getShareManList(false);
          this.getEchartsData(false);
          break;
      }
    },
    initPageData() {
      let shareManList = this.shareManList;
      this.sortByTime = [];
      this.sortByTimes = [];
      this.sortByTime.push(...shareManList);// 后台返回的本身就是按时间排序的
      for (let i = 0; i < shareManList.length; i++) {
        this.sortByTimes.push(shareManList[i]);
        // 按次数排序
        for (let j = i - 1; j >= 0; j--) {
          if (this.sortByTimes[j].readTimes < shareManList[i].readTimes) {
            this.sortByTimes[j + 1] = this.sortByTimes[j];
            this.sortByTimes[j] = shareManList[i];
          } else { // 代表找好并排好序了
            break;
          }
        }
      }
    },
    switchList() {
      switch (this.checkValue) {
        case 0:// 按时间排序
          this.shareManList = this.sortByTime;
          break;
        case 1:// 按次数排序
          this.shareManList = this.sortByTimes;
          console.log(this.shareManList);
          break;
      }
    },
    async getEchartsData(sevenFlag) {
      let dayNumber = 7;
      if (sevenFlag === false) {
        let data = new Date();
        // 获取当前月份有多少天
        dayNumber = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
      }
      let url = JSON.parse(getUrl()).statistics.article.articleRead;
      let postData = {
        articleId: this.$route.query.articleId,
        sevenFlag: sevenFlag
      }
      const resultMsg = (await this.$http.get(url, {params: postData})).data
      const result = resultMsg.data;
      if (resultMsg.code !== 200) {
        this.$toast('请求失败，请重试');
        return;
      }
      if (result.length > 0) {
        if (sevenFlag === false) {// 按月
          for (let i = 0; i < result.length; i++) {
            // 提取后台返回日期中的日
            let dayStartIndex = (result[i].readDate).lastIndexOf('-');
            let day = (result[i].readDate).substring(dayStartIndex + 1);
            this.monthData[day - 1] = [day + '日', parseInt(result[i].readTime)];
          }
        } else {// 按周
          let data = new Date();
          let curDate = data.getDate();
          for (let i = 0; i < result.length; i++) {
            let dayStartIndex = (result[i].readDate).lastIndexOf('-');
            let day = (result[i].readDate).substring(dayStartIndex + 1);
            this.sevenData[7 - (curDate - day)] = [day + '日', parseInt(result[i].readTime)];
          }
        }
      }
      this.$nextTick(() => {
        if (sevenFlag === false) {
          this.initEcharts(this.monthData);
        } else {
          this.initEcharts(this.sevenData);
        }
      })
    },
    initMonthData() {
      let data = new Date();
      // 获取当前月份有多少天
      let dayNumber = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= dayNumber; i++) {
        this.monthData.push([i + '日', 0]);
      }
    },
    initSevenData() {
      let curDay = new Date();
      curDay = curDay.getDate();
      for (let i = 6; i >= 0; i--) {
        this.sevenData.push([(curDay - i) + '日', 0]);
      }
    },
    toWxUserPage(id) {
      this.$router.push({
        name: 'articleReaderList',
        query: {
          articleId: this.$route.query.articleId,
          shareId:id
        }
      });
    }
  }
}
</script>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  overflow: hidden;
}

.chartType {
  position: fixed;
  width: 100vw;
  top: 50px;
  display: inline-flex;
  box-sizing: border-box;
  justify-content: center;
  z-index: 999;
}

.chartType_btnGroup {
  display: inline-flex;
}

.sevenDay, .month {
  width: 35vw;
  color: #5b99ff;
  background-color: white;
  border: 1px solid #5b99ff;
}

.active {
  background-color: #5b99ff;
  color: white;
  border: none;
}

.stats {
  width: 100vw;
  height: 35vh;
  box-sizing: border-box;
  padding: 1rem;
  padding-bottom: 0rem;
  //margin-top: 44px;
}

.shareList-title {
  display: inline-flex;
  width: 100vw;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 5px 1rem;

  p {
    margin-block-start: 0em;
    margin-block-end: 0em;
    line-height: 1.8rem;
  }

  button {
    color: white;
    background-color: #4876f1;
    border: none;
    outline: none;
    border-radius: 2px;
    height: 1.8rem;
  }
}

/deep/ .van-dropdown-menu__bar {
  height: 1.8rem;
  box-shadow: 0 0px 0px rgba(100, 101, 102, .12);
}

/deep/ .van-ellipsis {
  color: #1989fa;
}

.shareList {
  width: 100vw;
  height: calc(100vh - 40vh);
  overflow-y: auto;
}

.shareListItem {
  display: inline-flex;
  width: 100vw;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 0px 1rem 0px 5px;
}

.shareList-index {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;

  button {
    border: none;
    outline: none;
    width: 1.5rem;
    height: 1.5rem;
    background-color: white;
    color: black;
    border-radius: 50%;
  }
}

//第一名
.first {
  background-color: rgb(255, 235, 19) !important;
  color: white !important;
}

// 第二名
.second {
  background-color: #cecece !important;
  color: white !important;
}

// 第三名
.third {
  background-color: #ffbe6f !important;
  color: white !important;
}

.shareList-middle {
  width: 50%;
  display: inline-flex;
  align-items: center;

  img, .avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    margin-right: 5px;
  }

  .avatar {
    background-color: #5b99ff;
    color: white;
    text-align: center;
    line-height: 2rem;
  }
}

.shareList-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
</style>
