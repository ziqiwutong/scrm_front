<template>
  <div class="orderEdit_container">
    <!--  navBar栏-->
    <van-nav-bar  class="nav-bar"
                  title="编辑订单"
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
          :rules="[{ required: true, message: '请填写成交员工' }]"
        />

        <van-field
          v-model="productBuyAmount"
          type="productBuyAmount"
          name="产品购买数量"
          label="产品购买数量"
          placeholder="产品购买数量"
          :rules="[{ required: true, message: '请填写产品购买数量' }]"
        />

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
    <AbbList :type=2 v-show="testVal" @returnClick="onTestCancel"
             @onCh="testConsole"/>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
import AbbList from "../../component/AbbList";
export default {
  name: "orderEdit",
  components: {
    AbbList,
  },
  data() {
    return {
      testVal:false,
      customerInfo: {
        id: '',
        customerName: ''
      },
      columns: ['撤销', '待付款', '待收货', '交易成功', '退款成功'],
      showPicker: false,
      orderStatus:'',
      productName: '',
      productPrice: '',
      orderBuyer: '',
      orderType:'',
      orderStaff:'',
      productBuyAmount:'',
      orderSource:'',
      notes:'',
      priceChange:'',
      productPic: [],
      productPic1:''
    };
  },
  created () {
    this.test();
  },
  methods: {
    chooseBuyer()
    {
      // console.log(1)
      this.testVal = true
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
    async afterRead(file) {
      let url="/fzk/file/pic/base64StrToPic"
      let postData = {
        picBase64Str: file.content,
        picType: 'productImage',
        isCompress:'false'
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      this.productPic1= result;
    },
    onConfirm(value) {
      this. orderType = value;
      this.showPicker = false;
    },
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
      // this.orderStatus='-1';
      this.orderStatus=result.orderType;
        if(this.orderStatus === -1)
          this.orderType = '撤销'
      if(this.orderStatus === 0)
        this.orderType = '代收款'
      if(this.orderStatus === 1)
        this.orderType = '待收货'
      if(this.orderStatus === 2)
        this.orderType = '交易成功'
      if(this.orderStatus === 3)
        this.orderType = '退款成功'
    },
    async onSubmit() {
      if(this.orderType === '撤销')
        this.orderStatus='-1';
      if(this.orderType === '代收款')
        this.orderStatus='0';
      if(this.orderType === '待收货')
        this.orderStatus='1';
      if(this.orderType === '交易成功')
        this.orderStatus='2';
      if(this.orderType === '退款成功')
        this.orderStatus='3';
      let url = "/api/se/order/editOrder";
      let postData = {
        orderID:this.orderID,
        productName: this.productName,
        productPrice: this.productPrice,
        orderBuyer: this.orderBuyer,
        customerID:this.customerInfo.id,
        orderStaff:this.orderStaff,
        productBuyAmount: this.productBuyAmount,
        orderSource:this.orderSource,
        notes:this.notes,
        priceChange:this.priceChange,
        productPic: this.productPic1,
        orderType:this.orderStatus,
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('订单修改成功');
        this.onClickLeft(this.orderID);
      }
      else
        Toast('订单修改失败,错误码' + result.code);
    },

    onClickLeft(orderID) {
      this.$router.push({
        path: '/orderDetail',
        query: {
          orderID: this.orderID
        }
      });
    },

  },
}
</script>

<style lang="less" scoped>

/deep/ .nav-bar{
  height: 50px;
  margin-bottom: 5px;
  //border-bottom: 1px solid lightgray;
  .van-nav-bar__content{
    height:50px;
  }
}

.orderEdit_container{
  padding-top: 52px;
}
</style>
