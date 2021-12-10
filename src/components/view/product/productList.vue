<template>
  <div class="productList_container">
    <!--以下为搜索栏-->
    <div class="surf">
      <form action="/" v-if="searchShow">
        <van-search
          v-model="searchValue"
          shape="round"
          background="#e9e9e9"
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
<div class="tabbar1">
  <van-tabbar class="tabbar2" v-model="barAct" :fixed="false" active-color="#4876F1">
    <!--    综合推荐-->
    <van-tabbar-item class="navopt" @click="sortPop1">
      综合推荐
    </van-tabbar-item>

    <!--    销量-->
    <van-tabbar-item class="navopt" @click="sortPop2">
      销量
    </van-tabbar-item>
    <!--    价格-->
    <van-tabbar-item class="navopt" @click="sortPop3">
      价格<van-icon
      class-prefix="icon-third"
      :name= "this.priceStatus == 0 ? 'sort-down' : 'paixu-shengxu'"
    />
    </van-tabbar-item>
<!--    筛选-->
    <van-tabbar-item class="navopt" @click="toSort"
    >
      筛选<van-icon class-prefix="icon-third" name="shaixuan" />
      </van-tabbar-item
    >
  </van-tabbar>

</div>
          <!--        以下为列表栏-->
          <div class="tab-list1">
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i" :title="item" >
                <van-row class="van-row1">
                <div  @click="onDetail(item.productID)">
                  <van-col span="4" offset="1">
                    <van-image
                      width="135%"
                      height="75px"
                      :src=item.productPic
                    />
<!--                      src=item.productPic-->
<!--                      />-->

                  </van-col>
                  <van-col class="productName" span="8" offset="2">{{item.productName}}</van-col>
                  <van-col class="price" span="8" offset="0"><div class="van-ellipsis">售价:<span class="pricecolor">￥{{item.productPrice}}</span></div></van-col>
                  <van-col class="stock" span="8" offset="10">库存:{{item.productInventory}}件</van-col>
                  <van-col class="View" span="10" offset="2">{{item.productView}}人浏览</van-col>
<!--                  <van-col  class="button" span="6" offset="4">-->
<!--                  </van-col>-->
                </div>
                  <div class="button">
                  <van-button class="button-edit" block  @click="showShareDialog" color="#4876F1"  type="info">立即分享</van-button>
                  </div>
                </van-row>

                <!-- 滑动删除 -->
                <template #right>
                  <van-button square text="删除" type="danger" class="delete-button" />
                </template>
              </van-swipe-cell>
            </van-list>
          </div>
    </div>
<!---->
    <van-popup v-model="scrShow" closeable position="bottom" class="scrpop">
      <van-row v-for="item in scrList" :key="item.name">
        <p class="scrname">{{ item.name }}</p>
        <van-button
          v-for="item1 in item.class"
          :key="item1.name"
          :class="item1.isSelected ? 'actscrbtn' : 'scrbtn'"
          @click="cutTabClick(item1)"
        >
          {{ item1.name }}</van-button
        >
      </van-row>



      <van-button type="default" @click="reset" class="scrresbtn" hairline
      >重置</van-button
      >
      <!-- 筛选内容提交 -->
      <van-button type="info" @click="screen" class="scrfirbtn"
      >确定</van-button
      >
    </van-popup>
<!--    -->
    <CreateContext @ifShow="ifShowDialog" :text="createContext" />
    <van-share-sheet v-model="showShare" :options="options"  @select="shareArticleApp"/>
    <TabBar/>
  </div>

</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
import productCreate from "./productCreate";
import {getUrl} from "../../../utils/replaceUrl";
import TabBar from "../..//component/TabBar";
import CreateContext from "../../component/CreateContext";
import yyApi from "../../../utils/yyApi";
export default {
  name: "productList",
  data() {
    return {
      ifChoose:'',
      //
      shareId: '1',

      //
      colorful:'#4876F1',
      active1: 0,
      priceStatus:0,
      // priceName: this.priceStatus == 0 ? '-paixu_jiangxu' : '-paixu_shengxu',
      //筛选层
      barAct:0,
      showShare:false,
      options: [
        {
          name: '微信',
          icon: 'wechat',
        },
        {
          name: '朋友圈',
          icon: 'wechat-moments',
        }
      ],
      pageProps: {
        pageNum: 1,
        pageSize: 10
      },
      createContext: "+创建产品",
      searchValue: "",
      searchShow: false,
      active: '',
      list: [],    //以下三个是list参数
      //error: false,
      loading: false,
      finished: false,
      // productName:"必炫",
      // productPrice:"1999",
      // productBuyAmount:"3",
      // orderBuyer:"王佳乐",
      // orderID:"123978129038123",
      //  productPic1:"",
    //以下为标签栏

    //  以下为筛选数据
      scrShow: false,
      followShow: false,
      //筛选列表
      scrList: [
        {
          name: "价格",
          class: [
            { name: "小于500元", isSelected: false },
            { name: "500到1000元", isSelected: false },
            { name: "1000元到2000元", isSelected: false },
            { name: "2000元到3000元", isSelected: false },
            { name: "3000元以上", isSelected: false }
          ],
        },
        {
          name: "产品类型",
          class: [
            { name: "红酒", isSelected: false },
            { name: "啤酒", isSelected: false },
            { name: "白酒", isSelected: false },
            { name: "定制酒", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },

      ],
      shareMsg: {
        type: '2',
        title: '',
        imageUrl: '',
        desc: '点击查看详情->',
        pageUrl: ''
      }
    }
  },
  components: {
    CreateContext,
    TabBar
  },
  mounted() {
    // let dropdown = document.querySelector('/deep/.van-dropdown-menu__title');
    // dropdown.classList.add('.van-dropdown-menu__title__active');
  },
  created(){
    this.shareId=this.$store.state.userMessage.userId;
  },

  methods: {
    //todo 分享设置、
    showShareDialog(item) {
      let imageUrl = item.productPic.replace('/wxResource', 'http://mmbiz.qpic.cn');
      this.shareMsg.title = item.productName;
      this.shareMsg.imageUrl = imageUrl;
      this.shareMsg.pageUrl = JSON.parse(getUrl()).baseUrl + 'articleDetail?articleid=' + item.id + '&shareid=' + this.shareId + '&ifshowshareman=true';
      this.showShare = true;
    },
    async shareArticleApp(e) {
      // 先去后台拿用友的jsConfig，然后触发分享事件
      let url = JSON.parse(getUrl()).contextShare.yyConfig;
      const result = (await this.$http.get(url)).data.data;
      let yyConfig = {
        appId: result.appid,
        timestamp: result.timestamp,
        signature: result.signature
      }
      let shareMsg = this.shareMsg;
      if (e.name === '朋友圈') {
        shareMsg.type = '3';
      }
      console.log(shareMsg);
      await yyApi.yyRegister(yyConfig, shareMsg);
      this.showShare = false;
    },

    //以上为筛选内容
    toScreen() {
      this.scrShow = !this.scrShow;
    },
    reset() {
      let i, j;
      for (i = 0; i < this.scrList.length; i++) {
        for (j = 0; j < this.scrList[i].class.length; j++) {
          if (this.scrList[i].class[j].isSelected === true) {
            this.scrList[i].class[j].isSelected = false;
          }
        }
      }
      this.ifChoose = true;
    },
    // 筛选-按钮点击高亮事件
    cutTabClick(item) {
      //然后通过这个属性判断是否选中点亮和取消
      item.isSelected = !item.isSelected;
    },
    // 筛选-跟进人列表-弹窗
    toFollow() {
      this.followShow = true;
    },
    // 筛选-上次跟进人列表-弹窗

    // 筛选-重置-重置已经选中标签

    // 筛选-筛选内容提交
    screen() {
      this.selectList = [];
      let i, j;
      //读取选中的标签
      for (i = 0; i < this.scrList.length; i++) {
        for (j = 0; j < this.scrList[i].class.length; j++) {
          if (this.scrList[i].class[j].isSelected === true) {
            this.selectList.push(
              // this.scrList[i].name + ":" + this.scrList[i].class[j].name
              j+5*i
            );
          }
        }
      }
      console.log(this.selectList);
      this.send();
    },
    async send(){  //发送筛选请求
      this.pageProps.pageNum=1;
      this.list=[];
      let url = "/api/se/product/queryProduct";
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
        type: 4,
        sort:this.selectList,
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
      console.log(this.list);
      // 加载状态结束
      this.loading = false;
      this.scrShow = false;
    },
    //以上为筛选内容
    // toFollow(){
    //
    // },

    toSort(){
   this.scrShow = true;
    },
    sortPop1(barAct){
      // let dropdown = document.querySelector('.van-ellipsis');
      // dropdown.classList.add('.van-ellipsis-active');
      this.pageProps.pageNum=1;
      this.list=[];
      this.onLoad();
    },
    sortPop2(barAct){

      this.pageProps.pageNum=1;
      this.list=[];
      this.onLoad();
    },
    sortPop3(barAct){
     if(this.priceStatus === 0)
       this.priceStatus = 1;
      else
       this.priceStatus = 0;
     this.pageProps.pageNum=1;
      this.pageProps.pageSize=10;
      this.list=[];
      this.onLoad();
    },
    open1(){
      this.barAct=0;
    },

    ifShowSearch() {
      this.searchShow = true;
    },
    onDetail(productID) {
      this.$router.push({
        path: '/productDetail',
        query: {
          productID: productID
        }
      });
    },
    // toArticleDetail(articleId) {
    //   // 带着articleId&shareId去请求文章详情页
    //   this.$router.push({
    //     name: 'articleDetail',
    //     query: {
    //       articleid: articleId,
    //       shareid: this.shareId,
    //       ifshowshareman: true
    //     }
    //   });
    // },
    async onSearch() {
      let url = "/api/se/product/queryProductByKey";
      let postData = {
        keySearch: this.searchValue,
        // orderType: this.active
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
      let url = "/api/se/product/queryProduct";
      let barAct1=this.barAct;
      if( this.barAct == 2 && this.priceStatus == 0) barAct1 =3;
      // if( this.barAct == 3 ) barAct1 =4;
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
        type: barAct1
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
      console.log(this.list);
      // 加载状态结束
      this.loading = false;
    },

    async beforeClose({position, instance}) {
      switch (position) {
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
          // console.log(instance.$attrs.title.orderID);
          // console.log();
          this.$dialog.confirm({
            confirmButtonColor:'#5252cc',
            message: '确定删除吗？'
          }).then(() => {
            instance.close();
            this.deletefun(instance.$attrs.title.productID);//此处需要刷新页面
          });
          break;
      }
    },
    async deletefun(productID){
      let url = "/api/se/product/deleteProduct";
      let postData = {
        productID: productID
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data
      if(result.code === 200) {
        Toast('产品删除成功');
        this.list=[];
        this.pageProps.pageNum=1;
        this.onLoad();
      }
      else
        Toast('产品删除失败,错误码' + result.code);
    },
    ifShowDialog()
    {
      this.$router.push('productCreate')
    }
  },
}
</script>

<style lang="less" scoped>
 .tuijain{
  height: auto;
  color: #4876F1;
}
//以下为筛选内容
.scrpop {
  //width: 90%;
}
// 筛选按钮
.scrbtn {
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}
.actscrbtn {
  background-color: #4876f1;
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}
//筛选分类name
.scrname {
  margin-left: 20px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 6px;
}
//筛选提交按钮
.scrfirbtn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
  background-color: #4876f1;
}
//筛选重置按钮
.scrresbtn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
}
//以上为筛选内容
/deep/ .tabbar2{
  height: 100%;
  width: 100%;
  float: left;
  .van-tabbar-item{
    font-size: 15px;
  }
}
h3{
  background-color: white;
  text-align: center;
  margin-bottom: 0;
}
.tabbar1 {
  height: 48px;
  //.screen {
  //  //display: inline-block;
  //  text-align: center;
  //  background-color: white;
  //  float: left;
  //  line-height: 48px;
  //  font-size: 15px;
  //  height: 100%;
  //  width: 25%;
  //}

}
/deep/ .van-dropdown-menu{
  float: left;
  //display: inline-block;
  width:25%;
}
/deep/ .van-dropdown-menu__bar{
  box-shadow:0 0 0 0;
  //width:75%;
}
 .van-dropdown-menu__title__active{
   color: #4876F1;
 }
.productList_container{
  height:100%;
  //margin-bottom: 40px;
  background-color: rgba(215, 215, 215, 0.129411764705882);
}

/deep/ .van-list{
  height: 100%;
  margin-bottom: 50px;
}
/deep/ .content1 {
  height:30px;
  //border:1px solid gray;
  background-color: white;
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
  .van-col{
    font-size: 14px;
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
  background-color: rgba(215, 215, 215, 0.129411764705882);

}
.delete-button{
  height:100%;
}
 /deep/ .van-row1 .van-col--8{
   // display: flex;
   //height:40px;
   font-size:14px;

 }
/deep/ .van-row1 {
  height:100px;
  //justify-content: center;
  background-color: white;
  //border: 1px solid lightgray;
  margin-top: 7px;
  //margin-bottom: 4px;
  margin-left: 8px;
  margin-right: 8px;
  border-radius: 5px;
  .van-col{
    margin-top: 12px;
  }
  .second{
    text-align: right;
  }
  .order1{
    text-align: right;
    font-size: 13px;
  }
  .productName{
    font-size: 14px;
    //height: 40px;
  }

.stock{
  margin-top: 8px;
  font-size:12px;
  text-align: right;
  font-weight: lighter;
}
  .price{
    text-align: right;
    font-size: 14px;
  }
.View{
  margin-top: 10px;
  font-size:12px;
  font-weight: lighter;
}
  .button{
    position:absolute;
    right:20px;
    bottom: 12px;
    margin-top: 5px;
    z-index: 999;
  }
  .button-edit{
    margin-top: 3px;
    height: 25px;
    width: 90px;
  }
  .pricecolor{
    color: red;
  }
}


/deep/ .van-dropdown-menu__title{
  padding-top: 4px;
  //color: #4876F1;
}
///deep/ .van-ellipsis{
//  color:rgb(72, 118, 241);
//}
/deep/ .van-ellipsis-active{
  color:#030303;
}

</style>
