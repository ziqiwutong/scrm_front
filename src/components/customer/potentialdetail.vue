<template>
  <div>
    <van-cell class="returnbtn" @click="onReturn"> <van-icon name="arrow-left" />返回 </van-cell>
    <van-row class="busname">{{this.busName}}</van-row>
    <div class="busdetail">
      <van-row><van-col class="title">法定代表人</van-col><van-col class="detail">{{this.legRep}}</van-col></van-row>
        <van-row><van-col class="title">注册资本</van-col><van-col class="detail">{{this.regCap}}</van-col></van-row>
        <van-row><van-col class="title">经营状态</van-col><van-col class="detail">{{this.operaState}}</van-col></van-row>
        <van-row><van-col class="title">实缴资本</van-col><van-col class="detail">{{this.paidCap}}</van-col></van-row>
        <van-row><van-col class="title">成立日期</van-col><van-col class="detail">{{this.incDate}}</van-col></van-row>
        <van-row><van-col class="title">批准日期</van-col><van-col class="detail">{{this.appDate}}</van-col></van-row>
        <van-row><van-col class="title">公司类型</van-col><van-col class="detail">{{this.busType}}</van-col></van-row>
        <van-row><van-col class="title">所属行业</van-col><van-col class="detail">{{this.industry}}</van-col></van-row>
        <van-row><van-col class="title">经营期限</van-col><van-col class="detail">{{this.operDate}}</van-col></van-row>
        <van-row><van-col class="title">行业分类</van-col><van-col class="detail">{{this.industryClass}}</van-col></van-row>
        <van-row><van-col class="title">统一社会信用代码</van-col><van-col class="detail">{{this.unifCode}}</van-col></van-row>
        <van-row><van-col class="title">行业代码</van-col><van-col class="detail">{{this.industryCode}}</van-col></van-row>
        <van-row><van-col class="title">组织结构代码</van-col><van-col class="detail">{{this.organCode}}</van-col></van-row>
        <van-row><van-col class="title">登记机关</van-col><van-col class="detail">{{this.regAuth}}</van-col></van-row>
        <van-row><van-col class="title">企业地址</van-col><van-col class="detail">{{this.busAdd}}</van-col></van-row>
        </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        busName:"阿里巴巴(中国)有限公司",
        legRep:"夏林萍",
        regCap:"1000万人民币",
        operaState:"存续",
        paidCap:"-",
        incDate:"2016-12-14",
        appDate:"2018-01-15",
        busType:"股份有限公司(非上市、自然人投资或控股)",
        industry:"纺织、服装及日用品专门零售",
        operDate:"2016-12-14-9999-09-09",
        industryClass:"社会团体",
        unifCode:"91331000MA28H6KM4H",
        industryCode:"F5230",
        organCode:"MA28H6KM4",
        regAuth:"台州市市场监督管理局",
        busAdd:"浙江省台州市路桥区路北赵王村6栋2401室"


    };
  },
  methods:{
      onReturn(){
          this.$router.replace("/home");
      }
  }
};
</script>
<style lang="less" scoped>
.returnbtn {
    padding: auto;
}

.busname{

    font-size: 20px;
    padding: 5%;
    font-weight: bold;
}
.busdetail{
    padding: 3%;
}
.title{
    background-color: #F0F4FE;
    width: 35%;
    height: 60px;
    text-align:center;
    padding: 5%;
    color: #1F2752;
}
.detail{
    background-color: #FFFFFF;
    width: 65%;
    height: 60px;
    text-align:center;
    padding: 5%;
    color: #1F2752;
}
</style>