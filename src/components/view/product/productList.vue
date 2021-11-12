<template>
  <div class="productList_container">
    <!--以下为搜索栏-->
    <h3>产品列表</h3>
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
<!--      <van-row>-->
<!--        <van-tabbar v-model="barAct" :fixed="false">-->
<!--          &lt;!&ndash; 综合推荐 @click="sortPop"&ndash;&gt;-->
<!--          <van-tabbar-item class="navopt"  @click="showShareDialog">-->
<!--            <van-icon-->
<!--              :name="cus_new"-->
<!--              :class="barAct == 0 ? 'colorful' : ''"-->
<!--            />综合推荐-->
<!--          </van-tabbar-item>-->
<!--          &lt;!&ndash; 销量 &ndash;&gt;-->
<!--          <van-tabbar-item class="navopt" @click="toScreen"-->
<!--          ><van-icon-->
<!--            :name="cus_scr"-->
<!--            :class="barAct == 1 ? 'colorful' : ''"-->
<!--          />销量</van-tabbar-item-->
<!--          >-->
<!--          &lt;!&ndash; 价格 &ndash;&gt;-->
<!--          <van-tabbar-item class="navopt" @click="toCheckbox"-->
<!--          ><van-icon-->
<!--            :name="cus_chc"-->
<!--            :class="barAct == 2 ? 'colorful' : ''"-->
<!--          />价格</van-tabbar-item-->
<!--          >-->
<!--          &lt;!&ndash; 筛选 &ndash;&gt;-->
<!--          <van-tabbar-item class="navopt" @click="toCheckbox"-->
<!--          ><van-icon-->
<!--            :name="cus_chc"-->
<!--            :class="barAct == 2 ? 'colorful' : ''"-->
<!--          />筛选</van-tabbar-item-->
<!--          >-->
<!--        </van-tabbar>-->
<!--        -->
<!--      </van-row>-->
<div class="tabbar1">

      <van-dropdown-menu active-color="#5252cc"	@open="open1">
        <van-dropdown-item v-model="value1" :options="option1" />
      </van-dropdown-menu>
  <van-tabbar class="tabbar2" v-model="barAct" :fixed="false" active-color="#5252cc">
    <!--    销量-->
    <van-tabbar-item class="navopt" @click="sortPop">
      <van-icon
        :name="cus_new"
        :class="barAct == 0 ? 'colorful' : ''"
      />销量
    </van-tabbar-item>
    <!--    价格-->
    <van-tabbar-item class="navopt" @click="sortPop1">
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
                      width="75"
                      height="75"
                      src="https://img01.yzcdn.cn/vant/cat.jpeg"
                    />
<!--                      src=item.productPic-->
<!--                      />-->

                  </van-col>
                  <van-col class="productName" span="8" offset="2">{{item.productName}}</van-col>
                  <van-col class="price" span="6" offset="2">售价:<span class="pricecolor">￥{{item.productPrice}}</span></van-col>
                  <van-col class="stock" span="6" offset="2">库存:{{item.productInventory}}件</van-col>
                  <van-col class="View" span="6" offset="2">{{item.productView}}人浏览</van-col>
                  <van-col  class="button" span="6" offset="4">
                  </van-col>
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
    <van-popup v-model="scrShow" closeable position="right" class="scrpop">
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
    <van-share-sheet v-model="showShare" :options="options"/>
    <TabBar/>
  </div>

</template>

<script>
import qs from 'qs'// axios参数包
import TabBar from "@/components/component/TabBar";
import { Toast } from 'vant';
import CreateContext from "../../component/CreateContext";
import productCreate from "./productCreate";
export default {
  name: "productList",
  data() {
    return {
      ifChoose:'',

      colorful:'#5252cc',
      active1: 0,
      priceStatus:0,
      // priceName: this.priceStatus == 0 ? '-paixu_jiangxu' : '-paixu_shengxu',
      //筛选层
      barAct:3,
      showShare:false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '二维码', icon: 'qrcode' },
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
      // productPic:[],
    //以下为标签栏
      value1: 0,
      value2: 'a',
      value3:'a',
      option1: [
        { text: '综合推荐', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 },
      ],
      option2: [
        { text: '销量', value: 'a' },
        { text: '好评排序', value: 'b' },
        { text: '销量排序', value: 'c' },
      ],
      option3: [
        { text: '价格', value: 'a' },
        { text: '好评排序', value: 'b' },
        { text: '销量排序', value: 'c' },
      ],
    //  以下为筛选数据
      scrShow: true,
      followShow: false,
      // 筛选-跟进人-搜索
      followVal: "",
      // 筛选-标签选择数组
      selectList: [],
      //筛选列表
      newscrList: [],
      scrList: [
        {
          name: "性别",
          class: [
            { name: "男", isSelected: false },
            { name: "女", isSelected: false },
          ],
        },
        {
          name: "年龄范围",
          class: [
            { name: "青少年", isSelected: false },
            { name: "中青年", isSelected: false },
            { name: "中老年", isSelected: false },
          ],
        },
        {
          name: "标签",
          class: [
            { name: "高管客户", isSelected: false },
            { name: "C端客户", isSelected: false },
            { name: "B端客户", isSelected: false },
            { name: "爱酒", isSelected: false },
            { name: "慈善", isSelected: false },
            { name: "科技公司", isSelected: false },
            { name: "红酒", isSelected: false },
            { name: "啤酒", isSelected: false },
            { name: "集团合作客户", isSelected: false },
            { name: "定制酒", isSelected: false },
            { name: "旅游", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "来源",
          class: [
            { name: "手动新建", isSelected: false },
            { name: "高端推荐", isSelected: false },
            { name: "内容营销", isSelected: false },
            { name: "行业活动", isSelected: false },
            { name: "启信宝", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "企微-客户等级",
          class: [
            { name: "一般", isSelected: false },
            { name: "重要", isSelected: false },
            { name: "核心", isSelected: false },
          ],
        },
        {
          name: "企业类型",
          class: [
            { name: "国企", isSelected: false },
            { name: "民企", isSelected: false },
            { name: "中国500强", isSelected: false },
            { name: "世界500强", isSelected: false },
            { name: "上市公司", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "行业分类",
          class: [
            { name: "食品制造业", isSelected: false },
            { name: "酒", isSelected: false },
            { name: "饮料", isSelected: false },
            { name: "茶制造业", isSelected: false },
            { name: "批发零售业", isSelected: false },
            { name: "贸易业", isSelected: false },
            { name: "金融业", isSelected: false },
            { name: "建筑安装业", isSelected: false },
            { name: "房地产业", isSelected: false },
            { name: "交通运输仓储业", isSelected: false },
            { name: "软件信息技术业", isSelected: false },
            { name: "租赁与商业服务业", isSelected: false },
            { name: "住宿和餐饮业", isSelected: false },
            { name: "农副食品加工业", isSelected: false },
            { name: "公共管理与社会保障", isSelected: false },
            { name: "科学研究和技术服务业", isSelected: false },
            { name: "农林牧渔业", isSelected: false },
            { name: "文体旅游和卫生业", isSelected: false },
            { name: "采矿业", isSelected: false },
            { name: "其他制造业", isSelected: false },
            { name: "其他行业", isSelected: false },
          ],
        },
        {
          name: "注册资本",
          class: [
            { name: "200万以下", isSelected: false },
            { name: "500万以下", isSelected: false },
            { name: "1000万以下", isSelected: false },
            { name: "5000万以下", isSelected: false },
            { name: "5000万以上", isSelected: false },
          ],
        },
        {
          name: "员工数量",
          class: [
            { name: "20人以下", isSelected: false },
            { name: "100人以下", isSelected: false },
            { name: "500人以下", isSelected: false },
            { name: "1000人以下", isSelected: false },
            { name: "1000人以上", isSelected: false },
          ],
        },
        {
          name: "跟进阶段",
          class: [
            { name: "新客", isSelected: false },
            { name: "已加微信", isSelected: false },
            { name: "产品介绍", isSelected: false },
            { name: "合作模式洽谈", isSelected: false },
            { name: "签约协议", isSelected: false },
            { name: "已成交", isSelected: false },
            { name: "已打首付款", isSelected: false },
            { name: "阶段性付款", isSelected: false },
            { name: "已打尾款", isSelected: false },
            { name: "多次成交", isSelected: false },
            { name: "已输单", isSelected: false },
            { name: "无效客户", isSelected: false },
          ],
        },
        {
          name: "输单原因",
          class: [
            { name: "价格原因", isSelected: false },
            { name: "合作模式", isSelected: false },
            { name: "产品", isSelected: false },
            { name: "其它", isSelected: false },
          ],
        },
        {
          name: "无效原因",
          class: [
            { name: "其它", isSelected: false },
            { name: "客户无需求", isSelected: false },
            { name: "多次联系不上", isSelected: false },
            { name: "错误手机号码", isSelected: false },
          ],
        },
        {
          name: "商机创建时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "预计成交时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "成交时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "结束时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近跟进阶段",
          class: [
            { name: "新客", isSelected: false },
            { name: "已加微信", isSelected: false },
            { name: "产品介绍", isSelected: false },
            { name: "合作模式洽谈", isSelected: false },
            { name: "签约协议", isSelected: false },
            { name: "已成交", isSelected: false },
            { name: "已打首付款", isSelected: false },
            { name: "阶段性付款", isSelected: false },
            { name: "已打尾款", isSelected: false },
            { name: "多次成交", isSelected: false },
            { name: "已输单", isSelected: false },
            { name: "无效客户", isSelected: false },
          ],
        },
        {
          name: "成交状态",
          class: [
            { name: "未成交", isSelected: false },
            { name: "成交", isSelected: false },
          ],
        },
        {
          name: "客户状态",
          class: [
            { name: "未成交", isSelected: false },
            { name: "成交", isSelected: false },
          ],
        },
        {
          name: "创建时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "分配时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近通话时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近通话状态",
          class: [
            { name: "已接通", isSelected: false },
            { name: "未接通", isSelected: false },
            { name: "未知", isSelected: false },
          ],
        },
        {
          name: "回收时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近旅程时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
      ],

    }
  },
  components: {
    CreateContext,
    TabBar
  },
  methods: {
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
      for (i = 0; i < this.cusList.length; i++) {
        this.cusList[i].isShow = true;
      }
      this.ifChoose = true;
      this.followChsVal = [];
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
              this.scrList[i].name + ":" + this.scrList[i].class[j].name
            );
          }
        }
      }
      this.selectList.push(
        this.followChsVal.name + ":" + this.followChsVal.val
      );
      console.log(this.selectList);

    },
    //以上为筛选内容
    // toFollow(){
    //
    // },

    toSort(){
   this.scrShow = true;
    },
    sortPop1(barAct){
     if(this.priceStatus === 0)
       this.priceStatus = 1;
      else
       this.priceStatus = 0;

    },
    open1(){
      this.barAct=3;
    },
    showShareDialog() {
      this.showShare = true
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
    async onSearch() {
      let url = "/api/product/queryProductByKey";
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
      let url = "/api/product/queryProduct";
      let postData = {
        pageNum: this.pageProps.pageNum++,
        pageSize: this.pageProps.pageSize,
        // orderType: this.active,
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
      let url = "/api/product/deleteProduct";
      let postData = {
        productID: productID
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data
      if(result.code === 200) {
        Toast('产品删除成功');
        this.list=[];
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
//以下为筛选内容
.scrpop {
  width: 90%;
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
  width: 75%;
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
    height: 40px;
  }

.stock{
  margin-top: 5px;
  font-size:12px;
  text-align: right;
  font-weight: lighter;
}
  .price{
    text-align: right;
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
/deep/ .van-row1 .van-col--8{
  // display: flex;
  height:40px;
  font-size:16px;

}


</style>
