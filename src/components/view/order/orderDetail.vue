<template>
  <div class="orderDetail_container">
    <van-nav-bar  class="nav-bar"
                  title="订单详情"
                  left-text="返回"
                  left-arrow
                  fixed
                  @click-left="onClickLeft"

    />
    <div class="order_status" v-if="orderType === 2" >
      <div class="img-group1">
        <div class="sphere"></div>
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
<!--        <img-->
<!--          width="40"-->
<!--          height="40"-->
<!--          src="../../../assets/地图-圆 (1).png">-->
        <div class="sphere"></div>
<!--        <van-icon class-prefix="icon-third" name="ditu-yuan-copy" color="#5252cc"/>-->
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

    <div class="order_status" v-else-if="orderType === 0" >
      <div class="img-group1">
        <div class="sphere"></div>

        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="img-tip">2</div>
      </div>
      <div class="line-post"></div>
      <div class="order_time">
        <p>下单</p>
        <p>{{ orderTime }}</p>
      </div>
      <div class="finish_time" >
        <p>待付款</p>
      </div>
    </div>

    <div class="order_status" v-else-if="orderType === 1" >
      <div class="img-group1">
        <div class="sphere"></div>

        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="img-tip">2</div>
      </div>
      <div class="line-post"></div>
      <div class="order_time">
        <p>下单</p>
        <p>{{ orderTime }}</p>
      </div>
      <div class="finish_time" >
        <p>待收货</p>
      </div>
    </div>

    <div class="order_status" v-else-if="orderType === -1" >
      <div class="img-group1">
        <div class="sphere"></div>

        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="img-tip">2</div>
      </div>
      <div class="line-post"></div>
      <div class="order_time">
        <p>下单</p>
        <p>{{ orderTime }}</p>
      </div>
      <div class="finish_time" >
        <p>订单已撤销</p>
      </div>
    </div>

    <div class="order_status" v-else >
      <div class="img-group1">
        <div class="sphere"></div>

        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="img-tip">2</div>
      </div>
      <div class="line-post"></div>
      <div class="order_time">
        <p>下单</p>
        <p>{{ orderTime }}</p>
      </div>
      <div class="finish_time" >
        <p>退款成功</p>
      </div>
    </div>
<!--    -->
    <div class="order_detail" >
      <van-row>
        <van-col class="top" span="6" offset="1">买家</van-col>
        <van-col class="top2"  span="15">{{ orderBuyer }}</van-col>
        <van-col span="6" offset="1">成交员工</van-col>
        <van-col span="15" class="detail_right">{{ orderStaff }}</van-col>
        <van-col span="6" offset="1">订单号</van-col>
        <van-col span="15" class="detail_right">{{ orderID }}</van-col>
        <van-col span="6" offset="1">备注</van-col>
        <van-col span="15"class="detail_right">{{ notes }}</van-col>
        <van-col span="6" offset="1">订单来源</van-col>
        <van-col span="15"class="detail_right">{{ orderSource }}</van-col>
      </van-row>
    </div>

    <div class="order_price">
    <div class="price_left">
      <van-row class="van-row2" >
        <van-col span="4" offset="1">
          <van-image class="img1"
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
          <van-col class="real2" span="13">￥{{realPrice}}</van-col>
        </van-row>
        <div class="button1">
        <van-button class="button-1" block  @click="orderEdit1" color="#5252cc"  type="info">编辑</van-button>
          <van-button class="button-1" block @click="orderDelete1" type="danger">删除</van-button>
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
      orderType:'',
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
      realPrice:'',
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
     let url = "/api/se/order/orderDetail";
     let postData = {
       orderID:this.orderID
     }
     const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
     this.productName=result.productName;
     this.productPrice=result.productPrice;
     this.orderBuyer=result.orderBuyer;
     this.orderStaff=result.orderStaff;
     this.notes=result.notes;
     this.orderSource=result.orderSource;
     this.orderTime=result.orderTime;
     this.orderFinish=result.orderFinish;
     this.productBuyAmount=result.productBuyAmount;
     this.priceChange=result.priceChange;
     this.realPrice=this.productPrice - this.priceChange;
     this.orderType=result.orderType;
   },
   onClickLeft() {
     this.$router.push('orderList')
   },
   orderEdit1(orderID){
     // console.log(123123);
     this.$router.push({
       path: '/orderEdit',
       query: {
         orderID: this.orderID
       }
     });
   },
   orderDelete1() {
     this.$dialog.confirm({
       message: '确定删除吗？',
     }).then(() => {
       this.sendDelete();
     });
   },
   async sendDelete() {
     let url = "/api/se/order/deleteOrder";
     let postData = {
       orderID: this.orderID
     }
     const result1 = (await this.$http.post(url, qs.stringify(postData))).data;
     if (result1.code === 200) {
       Toast('订单删除成功');
         this.$router.push('orderList');
     } else
       Toast('订单删除失败,错误码' + result1.code);
   }
 }

}

</script>

<style lang="less" scoped>
.orderDetail_container{
  height: 100%;
  background-color: rgba(215, 215, 215, 0.129411764705882);
}
.order_status{
  //background: url(../../../assets/底纹@3x.png);
  background-color: white ;
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
  .sphere{
    width: 40px;
    height: 40px;
    background-color: #5252cc;
    border-radius: 50%;
  }

}
.img-group2{
  height: 40px;
  width: 40px;
  position: absolute;
  top:110px;
  right:70px;
  .sphere{
    width: 40px;
    height: 40px;
    background-color: #5252cc;
    border-radius: 50%;
  }
}
.sphere1{
  width: 40px;
  height: 40px;
  background-color: lightgray;
  border-radius: 50%;
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
  left:110px;
  height: 4px;
  right:110px;
  //width: 43%;
  background-color: #5252cc;
}
.line-post{
  position: absolute;
  top:130px;
  left:110px;
  height: 4px;
  right:110px;
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
  //height: 100%;
.top{
margin-top: 20px;
}
  .top2{
    text-align: right;
    margin-top: 20px;
  }
  .detail_right {
    text-align: right;
  }
.van-col{
  height: 30px;
  font-size: 1rem;
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
  .van-row{

  }
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
  position: relative;
  .img1{
    position:absolute;
    top:80px;
  }
  .van-col{
  margin-top: 35%;
  }
  .words1{
    width: 100px;
    margin-top: 40%;
  }
  .words2{
    width: 100px;
    margin-left: 40%;
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
      font-size: 1rem;
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
  //margin-top: 10px;
  height: 35px;
  width: 140px;
  display: flex;
  margin-top: 10px;
  margin-right:10px;
}
.button-1{
  height:35px;
  width: 70px;
  margin-left:10px;
}
</style>
