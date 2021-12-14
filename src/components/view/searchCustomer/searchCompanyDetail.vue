<template>
  <!-- 非集团企业客户页面-->
  <div>
    <!--返回按钮  -->
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <!-- 企业名称 -->
    <van-row class="busname">{{ companyName }}</van-row>
    <!-- 企业详情 -->
    <div class="busdetail">
      <van-row v-for="(item,index) in msg" :key='index'>
        <van-col class="title">{{ item.title }}</van-col>
        <van-col class="detail">{{ item.detail }}</van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../component/HeaderNavBar";
import {getUrl} from "../../../utils/replaceUrl";

export default {
  name: "searchCompanyDetail",
  components: {HeaderNavBar},
  data() {
    return {
      navTitle: '企业详情',
      companyName: '',
      msg: [
        {
          title: '法定代表人',
          detail: ''
        },
        {
          title: '公司类型',
          detail: ''
        },
        {
          title: '经营状态',
          detail: ''
        },
        {
          title: '注册资本',
          detail: ''
        },
        {
          title: '实缴资本',
          detail: ''
        },
        {
          title: '成立日期',
          detail: ''
        },
        {
          title: '批准日期',
          detail: ''
        },
        {
          title: '所属行业',
          detail: ''
        },
        {
          title: '企业地址',
          detail: ''
        },
        {
          title: '统一社会信用代码',
          detail: ''
        },
        {
          title: '组织结构代码',
          detail: ''
        },
        {
          title: '登记机关',
          detail: ''
        },
        {
          title: '经营范围',
          detail: ''
        },
      ]
    }
  },
  async created() {
    let url = JSON.parse(getUrl()).searchCustomer.companyDetail;
    let getData = {
      keyword: this.$route.params.keyword
    }
    const result = (await this.$http.get(url, {params: getData})).data.data
    this.companyName = result.companyName;
    this.msg[0].detail = result.legalPerson;
    this.msg[1].detail = result.companyKind;
    this.msg[2].detail = result.statusNew;
    this.msg[3].detail = result.registerCapital;
    this.msg[4].detail = result.actualCapital;
    this.msg[5].detail = result.startDate;
    this.msg[6].detail = result.termStart;
    this.msg[7].detail = result.domain;
    this.msg[8].detail = result.address;
    this.msg[9].detail = result.creditNo;
    this.msg[10].detail = result.orgNo;
    this.msg[11].detail = result.belongOrg;
    this.msg[12].detail = result.scope;
  },
  mounted() {
    setTimeout(() => {
      this.adjustSize();
    }, 1000);
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        name: 'searchList',
        params: {
          type: 1,
          searchMessage: this.$route.params.searchMessage,
        }
      })
    },
    adjustSize() {
      let detailDiv = document.querySelectorAll('.detail');
      let titleDiv = document.querySelectorAll('.title');
      for (let i = 0; i < titleDiv.length; i++) {
        let detailHeight = parseInt(detailDiv[i].offsetHeight);
        let titleHeight = parseInt(titleDiv[i].offsetHeight);
        let finalHeight = detailHeight > titleHeight ? detailHeight : titleHeight;
        titleDiv[i].style.height = finalHeight + 'px';
        detailDiv[i].style.height = finalHeight + 'px';
      }
    }
  }
}
</script>

<style scoped>
.busname {
  font-size: 20px;
  padding: 5%;
  font-weight: bold;
  margin-top: 50px;
}

.busdetail {
  padding: 3%;
}

.title {
  background-color: #f0f4fe;
  width: 35%;
  height: 60px;
  text-align: center;
  padding: 5%;
  color: #1f2752;
}

.detail {
  background-color: #ffffff;
  width: 65%;
  text-align: center;
  padding: 5%;
  color: #1f2752;
  border-color: #f5f5f5;
  border-style: solid;
  border-width: 1px;
}
</style>
