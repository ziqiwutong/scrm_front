<template>
  <div class="orderCreate_container">
    <!--  navBar栏-->
    <van-nav-bar  class="nav-bar"
                  title="新建订单"
                  left-text="返回"
                  left-arrow
                  fixed
                  @click-left="onClickLeft"

    />
    <!--  提交栏-->
    <div class="commit">
      <van-form @submit="onSubmit">
        <van-field
          v-model="productName"
          name="产品名称"
          label="产品名称"
          placeholder="产品名称"
          :rules="[{ required: true, message: '请填写产品名' }]"
        />

        <van-field
          v-model="productPrice"
          type="productPrice"
          name="产品售价"
          label="产品售价"
          placeholder="产品售价"
          :rules="[{ required: true, message: '请填写产品售价' }]"
        />

        <van-field name="productPic" label="产品图片">
          <template #input>
            <van-uploader :after-read="afterRead" v-model="productPic"  multiple/>
          </template>
        </van-field>

        <van-field
          @click="chooseBuyer"
          v-model="orderBuyer"
          readonly
          type="orderBuyer"
          name="买家"
          label="买家"
          placeholder="买家"
          :rules="[{ required: true, message: '请选择买家' }]"
        />

        <van-field
          v-model="orderStaff"
          type="orderStaff"
          name="成交员工"
          label="成交员工"
          placeholder="成交员工"
          :rules="[{ required: false, message: '请填写成交员工' }]"
        />

        <van-field
          v-model="productBuyAmount"
          type="productBuyAmount"
          name="产品购买数量"
          label="产品购买数量"
          placeholder="产品购买数量"
          :rules="[{ required: false, message: '请填写产品购买数量' }]"
        />

        <!--    <van-field-->
        <!--      v-model="orderType"-->
        <!--      type="orderType"-->
        <!--      name="订单状态"-->
        <!--      label="订单状态"-->
        <!--      placeholder="订单状态"-->
        <!--      :rules="[{ required: true, message: '请填写订单状态' }]"-->
        <!--    />-->
        <van-field
          readonly
          clickable
          name="picker"
          :value="orderType"
          label="订单状态"
          placeholder="点击选择订单状态"
          @click="showPicker = true"
        />
        <van-field
          v-model="orderSource"
          type="orderSource"
          name="订单来源"
          label="订单来源"
          placeholder="订单来源"
          :rules="[{ required: true, message: '请填写订单来源' }]"
        />
        <van-field
          v-model="notes"
          type="notes"
          name="备注"
          label="备注"
          placeholder="备注"
          :rules="[{ required: false}]"
        />

        <van-field
          v-model="priceChange"
          type="priceChange"
          name="改价"
          label="改价"
          placeholder="改价"
          :rules="[{ required: false}]"
        />



        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>

    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
<!--    todo  type换成3-->
    <van-popup
      v-model="userShow"
      position="bottom"
      :overlay="false"
      duration="0"
    >
      <AbbCusList
        :type="3"
        v-show="userShow"
        @returnClick="onUserCancel"
        @onCh="onUserAdd"
      />
    </van-popup>


  </div>


</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
import { areaList } from "@vant/area-data";
import {getUrl} from "../../../utils/replaceUrl";
import AbbCusList from "../../component/AbbList";
// import AddForm from "../../component/AddForm";
export default {
  name: "orderCreate",
  components: {
    AbbCusList,
  },

  data() {
    return {
      // showform:false,
      userShow:false,
      testVal:false,
      customerInfo: {
        id: '',
        customerName: ''
      },
      followVal: '',
      followShow: false,
      columns: ['撤销', '待付款', '待收货', '交易成功', '退款成功'],
      showPicker: false,
      orderStatus: '',
      productName: '',
      productPrice: '',
      orderBuyer: '',
      orderType: '',
      orderStaff: '',
      productBuyAmount: '',
      orderSource: '',
      notes: '',
      priceChange: '',
      productPic: [],
      productPic1: '',


      //  以上为新建客户弹出框
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (to, from) {
        //拿到目标参数 to.query.id 去再次请求数据接口
        this.customerInfo.id = to.query.id;
        this.customerInfo.customerName = to.query.customerName;
         this.orderBuyer=to.query.customerName;
      },
    },
  },

  methods: {



    onConfirm(value) {
      this. orderType = value;
      this.showPicker = false;
    },
//
    onUserCancel() {
      this.userShow = false;
    },
    onUserAdd (val) {
      this.customerInfo.name = val.name;
      this.customerInfo.id = val.id;
    },

    onTestCancel(){
      this.testVal = false
    },
    testConsole(val){
      console.log(val)
      this.customerInfo.customerName=val.name;
      this.customerInfo.id=val.id;
      this.orderBuyer=this.customerInfo.customerName;
    },
    returnClick(){
      // this.orderBuyer=this.customerInfo.customerName;
    },
//
    onFollowSearchCancel() {
      this.followVal = '';
    },


      folCancel()
      {
        this.followShow = false;
      },
      chooseBuyer()
      {
        this.userShow = true
      },

      async onSubmit()
      {
        let url = "/api/se/order/addOrder";
        if (this.orderType === '撤销')
          this.orderStatus = '-1';
        if (this.orderType === '代收款')
          this.orderStatus = '0';
        if (this.orderType === '待收货')
          this.orderStatus = '1';
        if (this.orderType === '交易成功')
          this.orderStatus = '2';
        if (this.orderType === '退款成功')
          this.orderStatus = '3';
        let postData = {
          productName: this.productName,
          productPrice: this.productPrice,
          orderBuyer: this.orderBuyer,
          customerID:this.customerInfo.id,
          orderStaff: this.orderStaff,
          productBuyAmount: this.productBuyAmount,
          orderSource: this.orderSource,
          notes: this.notes,
          priceChange: this.priceChange,
          productPic: this.productPic1,
          orderStatus: this.orderStatus,
        }

        const result = (await this.$http.post(url, JSON.stringify(postData), {headers: {"Content-Type": "application/json"}})).data

        if (result.code === 200) {
          Toast('订单创建成功');
          this.$router.push('orderList');
        } else
          Toast('订单创建失败,错误码' + result.code);

      },
      async afterRead(file)
      {
        console.log(file);
        let url = "/fzk/file/pic/base64StrToPic"
        let postData = {
          picBase64Str: file.content,
          picType: 'productImage',
          isCompress:'true'
        }
        const result = (await this.$http.post(url, qs.stringify(postData))).data.data
        this.productPic1 = result;
      },
      onClickLeft(){
      if(this.$route.query.type == 2)
        this.$router.push({
          path: '/perinfor',
          query: {
            id: this.customerInfo.id
          }
        });
       else if(this.$route.query.type == 1)
        this.$router.push('orderList');
      }


  },
}
</script>

<style lang="less" scoped>
.navbar1{
  border-style:none;
  display: flex; /* 弹性布局 */
  margin-top: 10px;
  justify-content: space-between; /* 横向中间自动空间 */
}
/deep/ .nav-bar{
  height: 50px;
  margin-bottom: 5px;
  //border-bottom: 1px solid lightgray;
  .van-nav-bar__content{
    height:50px;
  }
}

.orderCreate_container{
  padding-top: 52px;
}
//以下为弹出框
/deep/.van-dropdown-menu__title {
  color: #1e1c27;
  font-size: 13px;
}
/deep/.van-dropdown-menu__bar {
  box-shadow: unset !important;
}
//搜索框
.nav-search-btn {
  // margin: 5px 2% 5px 0%;
  // padding: 2px;
  margin-top: 5px;
  margin-right: 2%;
  margin-bottom: 5px;
}
.nav-search-box {
  height: 48px;
}
//分割线
.nav-separate {
  margin: 10px 2% 5px 5%;
  opacity: 0.5;
}
//添加按钮
.nav-add-btn {
  margin: 5px 2% 5px 0%;
  // padding: 2px;
}
//最近浏览-选项
.nav-option {
  margin: 5px 2% 10px 2%;
  padding: 0px;
  height: 30px;
  width: 95px;
  background-color: #f5f5f5;
}
.nav-cusnum-font {
  font-size: 10px;
  // margin-top: 5%;
  margin-left: 5%;
  margin-top: 15px;
  color: #bbbcbe;
}
// 标签栏颜色改变
.nav-icon-colorful {
  filter: invert(43%) sepia(65%) saturate(2735%) hue-rotate(208deg)
  brightness(97%) contrast(95%);
}
// 标签栏边距
.nav-tabar {
  margin-top: 2%;
  margin-bottom: 2%;
}
.van-hairline--top-bottom::after,
.van-hairline-unset--top-bottom::after {
  border-width: 0px 0;
}
// 列表容器
.list {
  margin-top: 25px;
}
//列表内容
.list-content {
  margin-bottom: 10px;
}
//客户姓名
.list-content-name {
  font-size: 15px;
}
//客户时间
.list-content-time {
  font-size: 11px;
  color: #6e6f74;
}
.list-content-msg {
  font-size: 12px;
  color: #6e6f74;
  margin-top: 4px;
}
.list-content-tag {
  margin-right: 0.5px;
  margin-left: 3%;
}
//弹出层布局
.screen {
  width: 90%;
}
// 筛选按钮
.screen-btn {
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn {
  background-color: #4876f1;
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}

// 新增筛选按钮-可自适应
.screen-btn2 {
  margin: 5px 2% 10px 0%;
  padding: 5px;
  height: 30px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn2 {
  background-color: #4876f1;
  margin: 5px 2% 10px 0%;
  padding: 5px;
  height: 30px;
  font-size: 12px;
  color: #ffffff;
}
// 新增筛选
// 筛选按钮
.screen-btn1 {
  margin: 5px 2% 10px 0%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn1 {
  background-color: #4876f1;
  margin: 5px 2% 10px 0%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}
.add-van-cell {
  padding: 0;
}
//筛选分类name
.screen-name {
  margin-left: 20px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 6px;
}
//筛选提交按钮
.screen-confirm-btn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
  background-color: #4876f1;
}
//筛选重置按钮
.screen-reset-btn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
}
//多选弹出层
.check {
  height: 100%;
}
//多选列表
.check-list {
  margin-bottom: 10px;
}

.follow-choose {
  margin-left: 10%;
  color: #4876f1;
  font-size: 10pt;
}
//跟进人-取消
.follow-cancel-btn {
  border: none;
}
.follow-newCustomer-btn{
  border: none;
}
//短信模板-导航
.shortmsg-nar {
  margin-top: 20px;
}
//新建用户-标题样式
.add-title {
  background-color: #f8f8f8;
  color: #bbbcbe;
  padding-left: 15px;
  padding-top: 5px;
  height: 30px;
  font-size: 14px;
}
//最近浏览-容器
.browse-container {
  height: 100%;
  width: 100%;
  position: absolute;

  top: 110px;
  z-index: 1;
  overflow: hidden;
}
//最近浏览-内容
.browse-content {
  height: 20%;
  width: 100%;
  position: absolute;
  z-index: 1;
  position: fixed;
}

//最近浏览-阴影
.browse-shady {
  background-color: #232228;
  position: absolute;
  height: 1200px;
  width: 100%;
  top: 180px;
  opacity: 0.8;
  z-index: 0;
  position: fixed;
}
//最近浏览-阴影补充
.browse-shady-other {
  height: 10%;
  width: 100%;
  top: 0%;
  position: absolute;
  z-index: 500;
  // opacity: 0;
  position: fixed;
}
//最近浏览-激活效果
.browse-active-btn {
  color: #4876f1;
}
// 新增-调用手机相册扫描名片
.add-choose-font {
  margin-left: 5%;
  margin-top: 10%;
}
// 新增-手动新增客户
.add-choose-hand-font {
  margin-left: 5%;
  height: 50px;
}
// 新增-页面边距
.add-choose-margin {
  margin-top: 5%;
  margin-left: 20%;
}
.main-fix {
  position: fixed;
  width: 100%;
}

.main {
  margin: 5px 2% 5px 2%;
  padding: 200px;
  border-radius: 15px;
  border: 1px solid #f6f6f6;
  // background: #cc1d60;
}
.list-img-none {
  width: 40px;
  height: 40px;
  background-color: #4876f1;
  border-radius: 50%;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
}
//以下为新建客户


.nav-cusnum-font {
  font-size: 10px;
  // margin-top: 5%;
  margin-left: 5%;
  margin-top: 15px;
  color: #bbbcbe;
}

//客户时间
.list-content-time {
  font-size: 11px;
  color: #6e6f74;
}
.list-content-msg {
  font-size: 12px;
  color: #6e6f74;
  margin-top: 4px;
}
.list-content-tag {
  margin-right: 0.5px;
  margin-left: 3%;
}
//弹出层布局
.screen {
  width: 90%;
}
// 筛选按钮
.screen-btn {
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn {
  background-color: #4876f1;
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}

// 新增筛选按钮-可自适应
.screen-btn2 {
  margin: 5px 2% 10px 0%;
  padding: 5px;
  height: 30px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn2 {
  background-color: #4876f1;
  margin: 5px 2% 10px 0%;
  padding: 5px;
  height: 30px;
  font-size: 12px;
  color: #ffffff;
}
// 新增筛选
// 筛选按钮
.screen-btn1 {
  margin: 5px 2% 10px 0%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}

.active-screen-btn1 {
  background-color: #4876f1;
  margin: 5px 2% 10px 0%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}
.add-van-cell {
  padding: 0;
}
//筛选分类name
.screen-name {
  margin-left: 20px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 6px;
}
//筛选提交按钮
.screen-confirm-btn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
  background-color: #4876f1;
}
//筛选重置按钮
.screen-reset-btn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
}


.follow-choose {
  margin-left: 10%;
  color: #4876f1;
  font-size: 10pt;
}
//跟进人-取消
.follow-cancel-btn {
  border: none;
}

//新建用户-标题样式
.add-title {
  background-color: #f8f8f8;
  color: #bbbcbe;
  padding-left: 15px;
  padding-top: 5px;
  height: 30px;
  font-size: 14px;
}

// 新增-手动新增客户
.add-choose-hand-font {
  margin-left: 5%;
  height: 50px;
}
// 新增-页面边距
.add-choose-margin {
  margin-top: 5%;
  margin-left: 20%;
}
.main-fix {
  position: fixed;
  width: 100%;
}

.main {
  margin: 5px 2% 5px 2%;
  padding: 200px;
  border-radius: 15px;
  border: 1px solid #f6f6f6;
  // background: #cc1d60;
}
.list-img-none {
  width: 40px;
  height: 40px;
  background-color: #4876f1;
  border-radius: 50%;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
  font-size: 15px;
}

</style>
