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
      <img src="../../../assets/底纹@3x.png" height="200" width="100%"/>
      <div class="img-group1">
        <div class="sphere"></div>
        <div class="sphere-border"></div>
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
<!--        <img-->
<!--          width="40"-->
<!--          height="40"-->
<!--          src="../../../assets/地图-圆 (1).png">-->
        <div class="sphere"></div>
        <div class="sphere-border"></div>
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
      <img src="../../../assets/底纹@3x.png" height="200" width="100%"/>
      <div class="img-group1">
        <div class="sphere"></div>
        <div class="sphere-border"></div>
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="sphere-border"></div>
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
      <img src="../../../assets/底纹@3x.png" height="200" width="100%"/>
      <div class="img-group1">
        <div class="sphere"></div>
        <div class="sphere-border"></div>
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="sphere-border"></div>
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
      <img src="../../../assets/底纹@3x.png" height="200" width="100%"/>
      <div class="img-group1">
        <div class="sphere"></div>
        <div class="sphere-border"></div>
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="sphere-border"></div>
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

      <img src="../../../assets/底纹@3x.png" height="200" width="100%"/>
      <div class="img-group1">
        <div class="sphere"></div>
        <div class="sphere-border"></div>
        <div class="img-tip">1</div>
      </div>
      <div class="img-group2">
        <div class="sphere1"></div>
        <div class="sphere-border"></div>
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
        <van-col class="top"  span="6" offset="1">买家</van-col>
        <van-col class="top2"  span="15">{{ orderBuyer }}</van-col>
        <van-col span="6" class="left" offset="1">成交员工</van-col>
        <van-col span="15" class="detail_right">{{ orderStaff }}</van-col>
        <van-col span="6" class="left" offset="1">订单号</van-col>
        <van-col span="15" class="detail_right">{{ orderID }}</van-col>
        <van-col span="6" class="left" offset="1">备注</van-col>
        <van-col span="15"class="detail_right">{{ notes }}</van-col>
        <van-col span="6" class="left" offset="1">订单来源</van-col>
        <van-col span="15"class="detail_right">{{ orderSource }}</van-col>
      </van-row>
    </div>

    <div class="order_price">
      <!--        finished-text="没有更多了"-->
        <van-swipe-cell  v-for="(item,i) in list" :key="i"  :title="item">
          <van-row class="van-row1">
            <div  @click="onDetail(item.productID)">
              <van-col span="4" offset="1">
                <van-image
                  width="120%"
                  height="60px"
                  :src=item.productImage
                />
              </van-col>
              <van-col class="productName" span="11" offset="2"><div class="van-ellipsis">{{item.productName}}</div></van-col>
              <van-col class="price" span="5" offset="1"><span class="pricecolor">￥{{item.originPrice}}</span></van-col>
              <van-col class="stock" span="4" offset="19">×{{item.productAmount}}</van-col>
              <!--                  <van-col  class="button" span="6" offset="4">-->
              <!--                  </van-col>-->
            </div>
          </van-row>
          </van-swipe-cell>
      <div class="button1">
        <van-row class="vanrow3" >
                    <van-col class="top" span="7" offset="3">商品总价</van-col>
                    <van-col class="top" span="6">￥{{ this.productPrice }}</van-col>
                    <van-col span="7" offset="3">改价</van-col>
                    <van-col span="6">￥{{this.priceChange === null ? '0' : this.priceChange }}</van-col>
                    <van-col class="real1" span="7" offset="3">实收金额</van-col>
                    <van-col class="real2" span="6">￥{{this.realPrice}}</van-col>
        </van-row>
        <van-button class="button-1" block  @click="orderEdit1" color="#4876F1"  type="info">编辑</van-button>
        <van-button class="button-2" block @click="orderDelete1" type="danger">删除</van-button>
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
      list:[],
      pageProps: {
        pageNum: 1,
        pageSize: 10
      },
      loading: false,
      finished: false,
      //以上为商品列表
      orderType:'',
      active: '',
      orderID:'',
      result:[],
      productName:'',
      productPrice:'',
      orderBuyer:'',
      orderStaff:'',
      productPic:'',
      // productPic1:'https://img01.yzcdn.cn/vant/cat.jpeg',
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
     let url = "/api/se/order/queryByOrderNum";
     let postData = {
       orderNum:this.orderID
     }
     const result = (await this.$http.get(url,{params:postData})).data.data;
     // this.productPic=result.productPic;
     // this.productName=result.productName;
     this.productPrice=result.originPrice;
     this.id=result.id;
     this.orderBuyer=result.customerName;
     this.orderStaff=result.orderStaff;
     this.notes=result.notes;
     this.orderSource=result.orderSource;
     this.priceChange=result.changePrice;
     this.realPrice=result.receivedAmount;
     this.orderType=result.orderStatus;
     this.list=result.productList;
     this.orderTime=result.createTime.split(" ")[0];
     this.orderFinish=result.payTime.split(" ")[0];
   },
   onClickLeft() {
     // let orderStatus =
     this.$router.push({
       path: '/orderList',
       query: {
         active:this.$route.query.active
       }
     })
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
     let url = "/api/se/order/delete";
     let postData = {
       id: this.id
     }
     const result1 = (await this.$http.post(url,JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data
     if (result1.code === 200) {
       Toast('订单删除成功');
         this.$router.push('orderList');
     } else
       Toast('订单删除失败,' + result1.msg);
   },
   //   onLoad() {
   //   this.list = [];
   //   for (let i = 0; i < result.length; i++) {
   //     this.list.push(result[i]);
   //   }
   //   // 加载状态结束
   //   this.loading = false;
   //   this.finished = true;
   //   // Toast('已加载全部数据！');
   // },
 }

}

</script>

<style lang="less" scoped>
///deep/ .van-nav-bar__text{
//  //color:black;
//}


/deep/ .van-nav-bar__left{
  font-size: 1rem;
  //color:black;
}
.orderDetail_container{
  height: 100%;
  background-color: #ffffff;
}
.order_status{
  //background: url(../../../assets/底纹@3x.png) repeat-x center center;
  background-size:100% 100%;
  box-sizing: border-box;
  //background-repeat: repeat-x;
  background-color: #4876F1;
  //height:calc(20vh +  46px);
  //height:30vh;
  height: 220px;
  padding-top: 46px;
  //border-top:5vh solid rgba(215, 215, 215, 0.12941176) ;
}
.img-group1 {
  height: 40px;
  width: 40px;
  position: absolute;
  //top:15vh;
  top:100px;
  left:70px;
  .sphere{
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 50%;
  }
  .sphere-border{
    position: absolute;
   //z-index: ;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);
    opacity: 50%;
    width: 50px;
    height: 50px;
    background-color: #ffffff;
    border-radius: 50%;
  }

}
.img-group2{
  height: 40px;
  width: 40px;
  position: absolute;
   top:100px;
  right:70px;
  .sphere{
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 50%;
  }
  .sphere-border{
    position: absolute;
    //z-index: ;
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);
    opacity: 50%;
    width: 50px;
    height: 50px;
    background-color: #ffffff;
    border-radius: 50%;
  }
}
.sphere1{
  //opacity:0.5;
  width: 40px;
  height: 40px;
  background-color: #FFFFFF;
  border-radius: 50%;
}
.img-tip {
  position: absolute;
  font-size: 1.3rem;
  color: #4876F1;
  left:14px;
  top:8px;
}
.line{
  position: absolute;
  top:119px;
  left:110px;
  height: 3px;
  right:110px;
  //width: 43%;
  background-color: #ffffff;
}
.line-post{
  position: absolute;
  top:119px;
  left:110px;
  height: 4px;
  right:110px;
  background-color: #FFFFFF;
}
.order_time{
  text-align: center;
  position: absolute;
   left:89px;
   top:143px;
  transform: translateX(-50%);
  p{
    margin: 5px;
    //margin-right: auto;
    color: #FFFFFF;
    font-size: 1rem;
    font-family: PingFang-SC-Medium;
  }
}

.finish_time{
  text-align: center;
  position: absolute;
  right:89px;
  top:143px;
  transform: translateX(50%);
  p{
    margin: 5px;
    color: #FFFFFF;
    font-size: 1rem;
    font-family: PingFang-SC-Medium;
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

/deep/ .nav-bar{
  height:46PX;
  .van-nav-bar__title{
    font-size: 1rem;
    text-align: center;
  }
}
.order_detail{
  border-top:2vh solid rgba(215, 215, 215, 0.129411764705882);
  //height:30vh;
  padding-top: 1vh;
  background-color: white;
  .left{
    color:#B2B2B2
  }
  .top{
    color:#B2B2B2
  }
}
.order_price{
  position: relative;
  //border-top:2vh solid rgba(215, 215, 215, 0.129411764705882) ;
  //height:28vh;
  //padding-top: 10px;
  //height: 200px;
  //margin: auto 0;
  background-color: rgba(215, 215, 215, 0.12941176);
}
.price_left{
  height: 150px;
  background-color: white;
  width: 50%;
  float: left;
}
/deep/.van-row2{
  position: relative;
  //.img1{
  //  position:absolute;
  //  top:80px;
  //}
  .van-col{
  margin-top: 30%;
  }
  //.words1{
  //  width: 100px;
  //  margin-top: 40%;
  //}
  .words2{
    //width: 100px;
    //margin-left: 40%;
    color:#B2B2B2 ;
    margin-top: 0;
  }
}
.price_right{
  //height: 70%;
  height: 200px;
  background-color: #FFFFFF;
  width: 50%;
  float: left;
  .right_row{
    //padding-top: 30%;
    .van-col{
      font-size: 1rem;
    }
  .top{
    margin-top: 20%;
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
  //z-index: 100;
  position: relative;
  //right:25px;
  //bottom:20px;
  //margin-top: 10px;
  //height: 35px;
  width: 100% ;
  display: flex;
  margin-top: 10px;
  background-color: white;
  //margin-right:15px;
  margin-bottom: 10px;
  .button-2{
    position: absolute;
    right:15px;
    bottom:8px;
  }
  .button-1{
    position: absolute;
    right:85px;
    bottom:8px;
  }
}
/deep/ .van-button--block{
  //height:35px;
  //width: 110px;
  height: 2rem;
  width: 4rem;
  margin-left:10px;
}
/deep/ .van-row1 {
  height: 80px;
  //justify-content: center;
  background-color: white;
  //border: 1px solid lightgray;
  margin-top: 7px;
  //margin-bottom: 4px;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 5px;
  //border-bottom: whitesmoke 1px;
  .van-col {
    margin-top: 12px;
  }

  .price{
    font-size: 13px;
  }
.stock{
  margin-top: 5px;
  font-size: 13px;
}

  .productName{
    .van-ellipsis{
      font-size: 1rem;
    }
    //height: 40px;
  }
}
//以上为列表蓝

.vanrow3{

}

</style>
