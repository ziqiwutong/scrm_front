<template>
  <div class="orderDetail_container">
    <van-nav-bar  class="nav-bar"
                  title="订单详情"
                  left-text="返回"
                  left-arrow
                  fixed
                  @click-left="onClickLeft"

    />
    <div class="order_status" v-if="orderType" >
      <div class="img-group1">
        <img
        width="40"
        height="40"
        src="https://d1icd6shlvmxi6.cloudfront.net/gsc/EOJKUZ/a8/01/ce/a801ce22fb4243439dcf7a3846b37518/images/订单管理-详情/u1138.png?token=a0d397c27ebf113d8795a7891303dd167bab5ef4f4a186b856828b1c63e0ac2f">
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <img
          width="40"
          height="40"
          src="https://d1icd6shlvmxi6.cloudfront.net/gsc/EOJKUZ/a8/01/ce/a801ce22fb4243439dcf7a3846b37518/images/订单管理-详情/u1138.png?token=a0d397c27ebf113d8795a7891303dd167bab5ef4f4a186b856828b1c63e0ac2f">
        <div class="img-tip">2</div>
      </div>
      <div class="line"></div>
      <div class="order_time">
        <p>下单</p>
        <p>{{ orderTime }}</p>
      </div>
      <div class="finish_time" >
        <p>交易成功</p>
        <p>{{ orderFinish }}</p>
      </div>
    </div>
<!---->

    <div class="order_status" v-else >
      <div class="img-group1">
        <img
          width="40"
          height="40"
          src="https://d1icd6shlvmxi6.cloudfront.net/gsc/EOJKUZ/a8/01/ce/a801ce22fb4243439dcf7a3846b37518/images/订单管理-详情/u1138.png?token=a0d397c27ebf113d8795a7891303dd167bab5ef4f4a186b856828b1c63e0ac2f">
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <img
          width="40"
          height="40"
          src="https://d1icd6shlvmxi6.cloudfront.net/gsc/EOJKUZ/a8/01/ce/a801ce22fb4243439dcf7a3846b37518/images/订单管理-详情/u1138.png?token=a0d397c27ebf113d8795a7891303dd167bab5ef4f4a186b856828b1c63e0ac2f">
        <div class="img-tip">2</div>
      </div>
      <div class="line-post"></div>
      <div class="order_time">
        <p>下单</p>
        <p>{{ orderTime }}</p>
      </div>
      <div class="finish_time" >
        <p>交易成功</p>
        <p>{{ orderFinish }}</p>
      </div>
    </div>

<!--    -->
    <div class="order_detail" >
      <van-row>
        <van-col class="top" span="6" offset="1">买家</van-col>
        <van-col class="top" span="17">{{ orderBuyer }}</van-col>
        <van-col span="6" offset="1">成交员工</van-col>
        <van-col span="17">{{ orderStaff }}</van-col>
        <van-col span="6" offset="1">订单号</van-col>
        <van-col span="17">{{ orderID }}</van-col>
        <van-col span="6" offset="1">备注</van-col>
        <van-col span="17">{{ notes }}</van-col>
        <van-col span="6" offset="1">订单来源</van-col>
        <van-col span="17">{{ orderSource }}</van-col>
      </van-row>
    </div>

    <div class="order_price">
    <div class="price_left">
      <van-row class="van-row2" >
        <van-col span="4" offset="1">
          <van-image
            round
            width="60"
            height="60"
            src="https://img01.yzcdn.cn/vant/cat.jpeg"
          />
        </van-col>
        <van-col class="words1" span="15" offset="4">￥{{productPrice}}×{{productBuyAmount}}</van-col>
        <van-col  class="words2" span="16" offset="10">{{productName}}</van-col>
      </van-row>
    </div>
      <div class="price_right">
        <van-row class="right_row">
          <van-col class="top" span="10" offset="1">商品总价</van-col>
          <van-col class="top" span="13">￥{{ productPrice }}</van-col>
          <van-col span="10" offset="1">改价</van-col>
          <van-col span="13">￥{{ priceChange }}</van-col>
          <van-col class="real1" span="10" offset="1">实收金额</van-col>
          <van-col class="real2" span="13">￥{{  }}</van-col>
        </van-row>
        <div class="button1">
        <van-button  color="#5252cc" size="small" type="info">编辑</van-button>
        <van-button  size="small" type="default">退款</van-button>
      </div>
      </div>
    </div>

  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
export default {
  name: "orderDetail",
  data() {
    return {
      orderType:false,
      active: '',
      orderID:'',
      result:[],
      productName:'',
      productPrice:'',
      orderBuyer:'',
      orderStaff:'',
      productPic:'',
      productBuyAmount:'',
      notes:'',
      orderSource:'',
      orderTime:'',
      orderFinish:'',
      priceChange:'',

      // productName:result[0].productName,
      // productPrice:result[0].productPrice,
      // orderBuyer:result[0].orderBuyer,
      // orderStaff:result[0].orderStaff,
      // notes:result[0].notes,
      // orderSource:result[0].orderSource,
      // orderTime:result[0].orderTime,
      // orderFinish:result[0].orderFinish,
    };
    },
 created () {
    this.test();
  },
 methods:{
   // created () {
   //   console.log(this.$route.query.orderID);
   //
   //   },
   async test(){
     this.orderID=this.$route.query.orderID;
// 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。不需要写fun
     let url = "/api/orderDetail";
     let postData = {
       orderID:this.orderID
     }
     const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
     this.productName=result.productName,
       this.productPrice=result.productPrice;
     this.orderBuyer=result.orderBuyer;
     this.orderStaff=result.orderStaff;
     this.notes=result.notes;
     this.orderSource=result.orderSource;
     this.orderTime=result.orderTime;
     this.orderFinish=result.orderFinish;
   },
   onClickLeft() {
     this.$router.push('orderList')
   },
 }

}

</script>

<style lang="less" scoped>
.orderDetail_container{
  height: 100%;
  background-color: rgba(215, 215, 215, 0.129411764705882);
}
.order_status{
  background-color: white;
  height:30%;
  padding--top: 60px;
  border-top:5px solid rgba(215, 215, 215, 0.12941176) ;
}
.img-group1 {
  height: 40px;
  width: 40px;
  position: absolute;
  top:110px;
  left:70px;
}
.img-group2{
  height: 40px;
  width: 40px;
  position: absolute;
  top:110px;
  right:70px;
}
.img-tip {
  position: absolute;
  font-size: 20px;
  color: white;
  left:14px;
  top:8px;
}
.line{
  position: absolute;
  top:130px;
  left:125px;
  height: 4px;
  width: 165px;
  background-color: #5252cc;
}
.line-post{
  position: absolute;
  top:130px;
  left:125px;
  height: 4px;
  width: 165px;
  background-color: lightgray;
}
.order_time{
  text-align: center;
  position: absolute;
   left:89px;
  top:149px;
  transform: translateX(-50%);
  p{
   margin: 5px;
  }
}

.finish_time{
  text-align: center;
  position: absolute;
  right:89px;
  top:149px;
  transform: translateX(50%);
  p{
    margin: 5px;
  }
}
/deep/ .van-steps__items{

}
/deep/ .van-steps{
  height:100%;

}
/deep/ .van-row {
  height: 100%;
.top{
margin-top: 10%;
}
.van-col{
  height: 30px;
  font-size: 18px;
}
}
.nav-bar{
  height:48px;
}
.order_detail{
  border-top:10px solid rgba(215, 215, 215, 0.129411764705882) ;
  height:30%;
  padding-top: 10px;
  background-color: white;
}
.order_price{
  border-top:10px solid rgba(215, 215, 215, 0.129411764705882) ;
  height:35%;
  //padding-top: 10px;
  background-color: white;
}
.price_left{
  height: 100%;
  width: 50%;
  float: left;
}
/deep/.van-row2{
  .van-col{
  margin-top: 35%;
  }
  .words1{
    margin-top: 40%;
  }
  .words2{
    margin-left: 30%;
    margin-top: 0;
  }
}
.price_right{
  height: 70%;
  width: 50%;
  float: left;
  .right_row{
    //padding-top: 30%;
    .van-col{
      font-size: 19px;
    }
  .top{
    margin-top: 32%;
  }
  }

}
/deep/ .real1{
  font-weight: bolder;
}
/deep/ .real2{
  color:red;
}
/deep/  .van-steps__items {
  margin: 10% 10% 10% 10%;
  .van-step__title {
    font-size: 20px;
    margin-left: 20px;
  }
.van-step__line{
  height: 5px;
  //left: 50px;
  //width: 70%;
  background-color: #5252cc;
}
}
/deep/ .van-step__line {

  left: 50px;
  width: 70%;

}
.button1{
  margin-top: 10px;
  margin-left: 80px;
}
</style>
