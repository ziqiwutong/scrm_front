<template>
<div class="orderList_container">
<!--以下为搜索栏-->
<!--  <h3>订单管理</h3>-->
 <div class="surf">
   <form action="/" v-if="searchShow">
     <van-search
       v-model="searchValue"
       shape="round"
       background="#6E6E6E"
       show-action
       placeholder="请输入搜索关键词"
       @search="onSearch"
       @cancel="onSearchCancel"
     />
   </form>
   <van-search v-model="searchValue" placeholder="请输入搜索关键词" v-else @click="ifShowSearch"/>
 </div>
<!--  以下为标签页切换  -->
  <div class="orderList_tab">
    <van-tabs class="vant-tab-wrap" title-active-color="#5252cc"	@click="onClick"  color="#5252cc"  v-model="active" animated>
      <van-tab  title="全部" >
<!--        <div class="content1">-->
<!--          <div class="tab-nav1"><p class="nav-p">商品 价格(元)/数量(件) 买家  订单号</p></div>-->
<!--        </div>-->
        <van-row class="content1">
          <van-col span="3" offset="2">商品</van-col>
          <van-col span="5" offset="1" >总价格(元)</van-col>
          <van-col span="5" offset="1" >总数量(件)</van-col>
          <van-col span="5" offset="2">买家</van-col>
        </van-row>
<!--        以下为列表栏-->
        <div class="tab-list1">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i" :title="item" >
              <van-row class="van-row1" @click="onDetail(item.orderID)" >
                <van-col span="5" offset="1">
                  <van-image
                    width="70"
                    height="70"
                    :src=item.productPic
                    />
<!--                    src="https://img01.yzcdn.cn/vant/cat.jpeg"-->
<!--                  />-->
                </van-col>
                <van-col span="3" class="pprice" offset="1" >￥{{item.productPrice}}</van-col>
                <van-col span="3" class="pamount" offset="4">×{{item.productBuyAmount}}</van-col>
                <van-col span="6"  class="second"><div class="van-ellipsis">{{item.orderBuyer}}</div></van-col>
                <van-col class="pName" span="7" offset="1"><div class="van-multi-ellipsis--l2">{{item.productName}}等</div></van-col>
              </van-row>
              <div class="line">
              <div class="line1"></div>
              </div>
              <van-row class="van-row2">
                <van-col class="oName" span="6" offset="1">订单号</van-col>
                <van-col  span="10" class="order1" offset="6" >{{item.orderID}}</van-col>
              </van-row>
              <!-- 滑动删除 -->
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </van-tab>

      <van-tab  title="待付款">
        <van-row class="content1">
          <van-col span="3" offset="2">商品</van-col>
          <van-col span="5" offset="1" >总价格(元)</van-col>
          <van-col span="5" offset="1" >总数量(件)</van-col>
          <van-col span="5" offset="2">买家</van-col>
        </van-row>
        <!--        以下为列表栏-->
        <div class="tab-list1">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i" :title="item" >
              <van-row class="van-row1" @click="onDetail(item.orderID)" >
                <van-col span="5" offset="1">
                  <van-image
                    width="70"
                    height="70"
                    :src=item.productPic
                  />
                  <!--                    src="https://img01.yzcdn.cn/vant/cat.jpeg"-->
                  <!--                  />-->
                </van-col>
                <van-col span="3" class="pprice" offset="1" >￥{{item.productPrice}}</van-col>
                <van-col span="3" class="pamount" offset="4">×{{item.productBuyAmount}}</van-col>
                <van-col span="6"  class="second"><div class="van-ellipsis">{{item.orderBuyer}}</div></van-col>
                <van-col class="pName" span="7" offset="1"><div class="van-multi-ellipsis--l2">{{item.productName}}等</div></van-col>
              </van-row>
              <div class="line">
                <div class="line1"></div>
              </div>
              <van-row class="van-row2">
                <van-col class="oName" span="6" offset="1">订单号</van-col>
                <van-col  span="10" class="order1" offset="6" >{{item.orderID}}</van-col>
              </van-row>
              <!-- 滑动删除 -->
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </van-tab>
      <van-tab title="交易成功">
        <van-row class="content1">
          <van-col span="3" offset="2">商品</van-col>
          <van-col span="5" offset="1" >总价格(元)</van-col>
          <van-col span="5" offset="1" >总数量(件)</van-col>
          <van-col span="5" offset="2">买家</van-col>
        </van-row>
        <!--        以下为列表栏-->
        <div class="tab-list1">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i" :title="item" >
              <van-row class="van-row1" @click="onDetail(item.orderID)" >
                <van-col span="5" offset="1">
                  <van-image
                    width="70"
                    height="70"
                    :src=item.productPic
                  />
                  <!--                    src="https://img01.yzcdn.cn/vant/cat.jpeg"-->
                  <!--                  />-->
                </van-col>
                <van-col span="3" class="pprice" offset="1" >￥{{item.productPrice}}</van-col>
                <van-col span="3" class="pamount" offset="4">×{{item.productBuyAmount}}</van-col>
                <van-col span="6"  class="second"><div class="van-ellipsis">{{item.orderBuyer}}</div></van-col>
                <van-col class="pName" span="7" offset="1"><div class="van-multi-ellipsis--l2">{{item.productName}}等</div></van-col>
              </van-row>
              <div class="line">
                <div class="line1"></div>
              </div>
              <van-row class="van-row2">
                <van-col class="oName" span="6" offset="1">订单号</van-col>
                <van-col  span="10" class="order1" offset="6" >{{item.orderID}}</van-col>
              </van-row>
              <!-- 滑动删除 -->
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </van-tab>
    <!--   待收货  -->
      <van-tab  title="待收货" >
        <van-row class="content1">
          <van-col span="3" offset="2">商品</van-col>
          <van-col span="5" offset="1" >总价格(元)</van-col>
          <van-col span="5" offset="1" >总数量(件)</van-col>
          <van-col span="5" offset="2">买家</van-col>
        </van-row>
        <!--        以下为列表栏-->
        <div class="tab-list1">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i" :title="item" >
              <van-row class="van-row1" @click="onDetail(item.orderID)" >
                <van-col span="5" offset="1">
                  <van-image
                    width="70"
                    height="70"
                    :src=item.productPic
                  />
                  <!--                    src="https://img01.yzcdn.cn/vant/cat.jpeg"-->
                  <!--                  />-->
                </van-col>
                <van-col span="3" class="pprice" offset="1" >￥{{item.productPrice}}</van-col>
                <van-col span="3" class="pamount" offset="4">×{{item.productBuyAmount}}</van-col>
                <van-col span="6"  class="second"><div class="van-ellipsis">{{item.orderBuyer}}</div></van-col>
                <van-col class="pName" span="7" offset="1"><div class="van-multi-ellipsis--l2">{{item.productName}}等</div></van-col>
              </van-row>
              <div class="line">
                <div class="line1"></div>
              </div>
              <van-row class="van-row2">
                <van-col class="oName" span="6" offset="1">订单号</van-col>
                <van-col  span="10" class="order1" offset="6" >{{item.orderID}}</van-col>
              </van-row>
              <!-- 滑动删除 -->
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </van-tab>

      <van-tab  title="撤销" >
        <!--        <div class="content1">-->
        <!--          <div class="tab-nav1"><p class="nav-p">商品 价格(元)/数量(件) 买家  订单号</p></div>-->
        <!--        </div>-->
        <van-row class="content1">
          <van-col span="3" offset="2">商品</van-col>
          <van-col span="5" offset="1" >总价格(元)</van-col>
          <van-col span="5" offset="1" >总数量(件)</van-col>
          <van-col span="5" offset="2">买家</van-col>
        </van-row>
        <!--        以下为列表栏-->
        <div class="tab-list1">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i" :title="item" >
              <van-row class="van-row1" @click="onDetail(item.orderID)" >
                <van-col span="5" offset="1">
                  <van-image
                    width="70"
                    height="70"
                    :src=item.productPic
                  />
                  <!--                    src="https://img01.yzcdn.cn/vant/cat.jpeg"-->
                  <!--                  />-->
                </van-col>
                <van-col span="3" class="pprice" offset="1" >￥{{item.productPrice}}</van-col>
                <van-col span="3" class="pamount" offset="4">×{{item.productBuyAmount}}</van-col>
                <van-col span="6"  class="second"><div class="van-ellipsis">{{item.orderBuyer}}</div></van-col>
                <van-col class="pName" span="7" offset="1"><div class="van-multi-ellipsis--l2">{{item.productName}}等</div></van-col>
              </van-row>
              <div class="line">
                <div class="line1"></div>
              </div>
              <van-row class="van-row2">
                <van-col class="oName" span="6" offset="1">订单号</van-col>
                <van-col  span="10" class="order1" offset="6" >{{item.orderID}}</van-col>
              </van-row>
              <!-- 滑动删除 -->
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </van-tab>

      <van-tab  title="退款成功" >
        <van-row class="content1">
          <van-col span="3" offset="2">商品</van-col>
          <van-col span="5" offset="1" >总价格(元)</van-col>
          <van-col span="5" offset="1" >总数量(件)</van-col>
          <van-col span="5" offset="2">买家</van-col>
        </van-row>
        <!--        以下为列表栏-->
        <div class="tab-list1">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i" :title="item" >
              <van-row class="van-row1" @click="onDetail(item.orderID)" >
                <van-col span="5" offset="1">
                  <van-image
                    width="70"
                    height="70"
                    :src=item.productPic
                  />
                  <!--                    src="https://img01.yzcdn.cn/vant/cat.jpeg"-->
                  <!--                  />-->
                </van-col>
                <van-col span="3" class="pprice" offset="1" >￥{{item.productPrice}}</van-col>
                <van-col span="3" class="pamount" offset="4">×{{item.productBuyAmount}}</van-col>
                <van-col span="6"  class="second"><div class="van-ellipsis">{{item.orderBuyer}}</div></van-col>
                <van-col class="pName" span="7" offset="1"><div class="van-multi-ellipsis--l2">{{item.productName}}等</div></van-col>
              </van-row>
              <div class="line">
                <div class="line1"></div>
              </div>
              <van-row class="van-row2">
                <van-col class="oName" span="6" offset="1">订单号</van-col>
                <van-col  span="10" class="order1" offset="6" >{{item.orderID}}</van-col>
              </van-row>
              <!-- 滑动删除 -->
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
  </div>

  <CreateContext @ifShow="ifShowDialog" :text="createContext" />

  <TabBar/>
</div>

</template>

<script>
import qs from 'qs'// axios参数包
import TabBar from "@/components/component/TabBar";
import { Toast } from 'vant';
import CreateContext from "../../component/CreateContext";
export default {
  name: "orderList",
  data() {
    return {
      pageProps: {
        pageNum: 1,
        pageSize: 10
      },
      createContext: "+创建订单",
      searchValue: "",
      searchShow: false,
      active: '',
      list: [],    //以下三个是list参数
      //error: false,
      loading: false,
      finished: false,
      orderStatus:4
    }
  },
  components: {
    CreateContext,
    TabBar
  },
  methods: {
    onClick(name, title){
      this.pageProps.pageNum=1;
      this.list=[];
      if(title === '全部')
        this.orderStatus = 4 ;
      if(title === '待付款')
        this.orderStatus = 0;
      if(title === '交易成功')
        this.orderStatus = 2;
      if(title === '待收货')
        this.orderStatus = 1;
      if(title === '撤销')
        this.orderStatus =  -1 ;
      if(title === '退款成功')
        this.orderStatus = 3;
      this.onLoad();
    },

    ifShowSearch() {
      this.searchShow = true;
    },
    onDetail(orderID) {
      this.$router.push({
        path: '/orderDetail',
        query: {
          orderID: orderID
        }
      });
    },
    async onSearch() {
      let url = "/api/se/order/queryOrderByKey";
      let postData = {
        keySearch: this.searchValue,
        orderType: this.orderStatus
      }
      this.list = [];
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = false;
      this.finished = true;
      Toast('已加载全部数据！');
    },

    onSearchCancel() {
      this.searchShow = false;
      this.searchValue = '';
    },

    async onLoad() {
      let url = "/api/se/order/queryOrder";
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
        // active:this.active,
        orderType: this.orderStatus
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
      // console.log(this.list);
      // 加载状态结束
      this.loading = false;
    },
    // onCancel1() {
    //   this.show = false;
    // },
    async beforeClose({position, instance}) {
      switch (position) {
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
          // console.log(instance.$attrs.title.orderID);
          console.log(instance);
          this.$dialog.confirm({
            confirmButtonColor:'#5252cc',
            message: '确定删除吗？'
          }).then(() => {
            instance.close();
             this.deletefun(instance.$attrs.title.orderID);//此处需要刷新页面
          });
          break;
      }
    },
   async deletefun(orderID){
     let url = "/api/se/order/deleteOrder";
     let postData = {
       orderID: orderID
     }
     const result = (await this.$http.post(url, qs.stringify(postData))).data
     if(result.code === 200) {
       Toast('订单删除成功');
       this.list=[];
       this.onLoad();
       // this.$router.push('orderList');
     }
     else
       Toast('订单删除失败,错误码' + result.code);
    },
    ifShowDialog()
    {
      this.$router.push({
        path: '/orderCreate',
        query: {
          type:1
        }
      });
    }
  },
}
</script>

<style lang="less" scoped>
.orderList_container{
  height:100%;
  //margin-bottom: 40px;
  background-color: #F3F4F8;
}
//.orderList_tab{
//  height: 100%;
//}
///deep/ .vant-tab-wrap{
//.van-tabs__wrap{
//  width: 100%;
//}
//}
///deep/ .van-tabs__content {
//  height: 100%;
//}
///deep/ .van-tab__pane{
//  height: 100%;
//}
///deep/ .van-list{
//  height: 100%;
//  margin-bottom: 50px;
//}
/deep/ .van-tab{
   width:33%;
}
/deep/ .content1 {
  //height:25px;
  //border:1px solid gray;
  background-color: white;
  line-height: 25px;
  text-align: center;
  margin-top: 5px;
 font-weight: bold;
  .van-col{
    font-size: 0.8rem;
    font-family: PingFangSC;
    font-weight: bold;
    color: #3E3C3C;
  }
}
.tab-nav1{
  background-color: lightblue;
  line-height: 35px;
  width:100%;
  height:35px;
 text-align: center;
}
.tab-nav1 p{
  margin: 8px;
}
.tab-list1{
  height: 100%;
  //background-color: rgba(215, 215, 215, 0.129411764705882);
  background-color: #F3F4F8
}
.delete-button{
  height:100%;
}

/deep/ .van-row1 {
  //height:80px;
  //justify-content: center;
  background-color: white;
  height: 85px;
  //border: 1px solid lightgray;
  margin-top: 7px;
  font-size: 14px;
  //margin-bottom: 4px;
  margin-left: 8px;
  margin-right: 8px;
  -moz-border-radius-topright: 5px;
  -moz-border-radius-topleft: 5px;
  .van-col{
    margin-top: 12px;
  }
  .pprice {
    margin-top: 18px;
    font-family: PingFangSC;
    font-weight: 400;
    color: #3E3C3C;
  }
  .pamount{
    margin-top: 19px;
    line-height:16px ;
  }
  .second{
    margin-top: 18px;
    //height: px;
    text-align: right;
    font-family: PingFangSC;
    //line-height: 50px;
    font-weight: 400;
    color: #3E3C3C;
    //text-overflow:ellipsis;
  }
  .order1{
    text-align: right;
    margin-top: 10px;
    font-size: 12px;
    font-weight: lighter;
  }
  .pName{
    margin-top: 7px;
    //height: 20px;
    //margin-top:3px;
    font-family: PingFangSC;
    font-weight: 400;
    color: #727272;
  }
}
/deep/ .van-row2{
  height: 25px;
  //border-top: 1px solid #EBEBEB ;
  margin-left: 8px;
  margin-right: 8px;
  -moz-border-radius-bottomright: 5px;
  -moz-border-radius-bottomleft: 5px;
  background-color: white;
  .oName{
    font-size: 12px;
    margin-top: 4px;
    //font-weight: lighter;
    font-family: PingFangSC;
    font-weight: 400;
    color: #6E6E6E;
  }
  .order1{
    text-align: right;
      font-size: 12px;
    margin-top: 4px;
    font-family: PingFangSC;
    font-weight: 400;
    color: #6E6E6E;
  }
}
/deep/ .van-row1 .van-col--8{
 // display: flex;
  height:40px;
  font-size:16px;
}

  .line1 {
    width: 325px;
    //margin-left: 24px;
    //margin-right: 24px;
    margin: 0 auto;
    height: 1px;
    background-color: #EBEBEB;
  }

</style>
