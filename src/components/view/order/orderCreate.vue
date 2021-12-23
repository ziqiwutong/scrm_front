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
      <van-form @submit="onSubmit" ref="submit1">


<!--        <van-field-->
<!--          v-model="originPrice"-->
<!--          name="订单原价"-->
<!--          label="订单原价"-->
<!--          placeholder="订单原价"-->
<!--          :rules="[{ required: false, message: '请填写订单变动价格' },{ pattern, message: '请输入正确内容' }]"-->
<!--        />-->
<!--        <van-field-->
<!--          v-model="changePrice"-->
<!--          name="变动价格"-->
<!--          label="变动价格"-->
<!--          placeholder="变动价格"-->
<!--          :rules="[{ required: false, message: '请填写订单变动价格' },{ pattern, message: '请输入正确内容' }]"-->
<!--        />-->

<!--        <van-field-->
<!--          v-model="lastPrice"-->
<!--          name="最终价格"-->
<!--          label="最终价格"-->
<!--          placeholder="最终价格"-->
<!--          :rules="[{ required: false, message: '请填写订单最终价格' },{ pattern, message: '请输入正确内容' }]"-->
<!--        />-->

        <van-field
          v-model="receivedAmount"
          name="实收金额"
          label="实收金额"
          placeholder="实收金额"
          :rules="[{ required: false, message: '请填写订单实收金额' },{ pattern, message: '请输入正确内容' }]"
        />
        <van-field
          v-model="saleChannel"
          name="渠道类型"
          label="渠道类型"
          placeholder="渠道类型"
          :rules="[{ required: false, message: '请填写订单渠道类型' }]"
        />

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



        <van-field
          v-model="orderStaff"
          type="orderStaff"
          name="成交员工"
          label="成交员工"
          placeholder="成交员工"
          :rules="[{ required: false, message: '请填写成交员工' }]"
        />

        <van-field
          readonly
          clickable
          name="picker"
          :value="orderType"
          label="订单状态"
          placeholder="点击选择订单状态"
          @click="showPicker = true"
          :rules="[{ required: true, message: '请填写订单状态' }]"
        />
        <van-field
          v-model="orderSource"
          type="orderSource"
          name="订单来源"
          label="订单来源"
          placeholder="订单来源"
          :rules="[{ required: false, message: '请填写订单来源' }]"
        />
        <van-field
          @click="addProduct"
          v-model="addProduct1"
          readonly
          type="addProduct"
          name="产品列表"
          label="产品列表"
          placeholder="点击添加产品"
          :rules="[{ required: false, message: '请选择买家' }]"
        />

      </van-form>
      <!--以下为产品表单-->
      <div class="productList">
        <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i"  :title="item">
          <van-row class="van-row1">
            <div >
              <van-col span="5" offset="1">
                <van-image
                  width="100%"
                  height="60px"
                  :src=item.productImage
                />
              </van-col>
              <van-col class="productName" span="11" offset="2"><div class="van-ellipsis">{{item.productName}}</div></van-col>
              <van-col class="price" span="5" offset="0"><span class="pricecolor">￥{{item.lastPrice}}</span></van-col>
              <van-col class="stock" span="4" offset="13">×{{item.productAmount}}</van-col>
              <!--                  <van-col  class="button" span="6" offset="4">-->
              <!--                  </van-col>-->
            </div>
          </van-row>
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button" />
          </template>
        </van-swipe-cell>
      </div>
      <!---->
      <div style="margin: 16px;">
        <van-button round block @click="submit3" type="info" native-type="submit">提交</van-button>
      </div>
    </div>

    <van-popup v-model="showPicker" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
<!--以下为产品列表弹窗-->
    <van-popup
      v-model="productShow"
      position="bottom"
      :style="{ height: '100%' }"
      :overlay="false"
      duration="0"
    >
      <van-button class="product-cancel-btn" @click="folCancel">取消</van-button>
      <van-search
        v-model="productVal"
        placeholder="请输入搜索关键词"
        @search="onProductSearch"
        @cancel="onProductSearchCancel"
      />
      <van-cell  class="van-cell"
        v-for="item in productList"
        :key="item.id"
        @click="productConfirm(item)"
      >
        <!-- 跟进人-跟进人信息 -->
        <van-row class="van-row2">
          <van-col span="5" offset="1">
            <van-image
              width="100%"
              height="60px"
              :src=item.productImage
            />
          </van-col>
          <van-col class="productName" span="11" offset="2"><div class="van-ellipsis">{{item.productName}}</div></van-col>
          <van-col class="price" span="5" offset="0"><span class="pricecolor">￥{{item.productPrice}}</span></van-col>
          <van-col class="stock1" span="8" offset="10">库存{{item.productInventory}}件</van-col>
        </van-row>
      </van-cell>
    </van-popup>

    <van-dialog  @confirm="diaConfirm" v-model="showchoose" :title=this.productToPush.productName show-cancel-button>
     <div style="width: 100%;text-align: center;margin-top: 5px">原价￥{{this.productToPush.originPrice}}</div>
      <div style=" display: flex; margin-bottom: 5px; margin-top: 10px">
       <span style=" margin-left: 40px; margin-right: 40px;  width:30%;">请选择数量</span>
      <van-stepper   v-model="value1" integer />

     </div>
      <div style="margin-left:25px">
        <van-field
          v-model="productChangePrice"
          name="产品变动价格"
          label="产品变动价格"
          placeholder="请填写产品变动价格"
          :rules="[{ required: false, message: '请填写订单变动价格' },{ pattern, message: '请输入正确内容' }]"
        />
      </div>
    </van-dialog>
  </div>


</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
import { areaList } from "@vant/area-data";
import {getUrl} from "../../../utils/replaceUrl";
import AbbCusList from "../../component/AbbCusList";
// import AddForm from "../../component/AddForm";
export default {
  name: "orderCreate",
  components: {
    AbbCusList,
  },

  data() {
    return {
      productChangePrice:'',
      pName:'',
      value1:1,
      // title1:this.productToPush.productName+'￥'+this.productToPush.originPrice,
      showchoose:false,
      list:[
        // {id:1,productImage: 'https://image-c.weimobwmc.com/saas-wxbiz/35b9afaac0174df0af99e62f8da64f1e.png', productAmount: 1, originPrice: 99,  productChangePrice:'', productName: "必炫·浓香型白酒"},
        // {id:2,productImage: 'https://image-c.weimobwmc.com/saas-wxbiz/35b9afaac0174df0af99e62f8da64f1e.png', productAmount: 1, originPrice: 99,  productChangePrice:'', productName: "必炫·浓香型白酒"},
        // {id:3,productImage: 'https://image-c.weimobwmc.com/saas-wxbiz/35b9afaac0174df0af99e62f8da64f1e.png', productAmount: 1, originPrice: 99,   productChangePrice:'',productName: "必炫·浓香型白酒"},
        // {id:4,productImage: 'https://image-c.weimobwmc.com/saas-wxbiz/35b9afaac0174df0af99e62f8da64f1e.png', productAmount: 1, originPrice: 99,  productChangePrice:'', productName: "必炫·浓香型白酒"},
        // {id:5,productImage: 'https://image-c.weimobwmc.com/saas-wxbiz/35b9afaac0174df0af99e62f8da64f1e.png', productAmount: 1, originPrice: 99,  productChangePrice:'', productName: "必炫·浓香型白酒"},
        // {id:6,productImage: 'https://image-c.weimobwmc.com/saas-wxbiz/35b9afaac0174df0af99e62f8da64f1e.png', productAmount: 1, originPrice: 99,  productChangePrice:'',productName: "必炫·浓香型白酒"}
      ],
       productToPush: {
         id: '',
         originPrice: '',
         productImage: '',
         productName: '',
         productAmount: '',
         changePrice:'',
         lastPrice:'',
         // receivedAmount:'',
         // orderNotes:'',
       },
      // showform:false,
      userShow:false,
      testVal:false,
      customerInfo: {
        id: '',
        customerName: ''
      },
      submitCount:0,
      productVal: '',
      productShow: false,
      columns: ['撤销', '待付款', '待收货', '交易成功', '退款成功'],
      showPicker: false,
      orderStatus: '',
      changePrice: '',
      originPrice: '',
      lastPrice:'',
      receivedAmount:'',
      saleChannel:'',
      pattern:/\d/,
      addProduct1:'',
      orderBuyer: '',
      orderType: '',
      orderStaff: '',
      productBuyAmount: '',
      orderSource: '',
      productPic: [],
      productPic1: '',


      //  以下为产品列表
      productPageProps:{
        pageNum: 1,
        pageSize: 10
      },
      productList:[]
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler: function (to, from) {
        this.customerInfo.id = to.query.id;
        this.customerInfo.customerName = to.query.customerName;
         this.orderBuyer=to.query.customerName;
      },
    },
  },
  // mounted() {
  //   this.$refs.submit1.submit();
  // },
  methods: {

    submit3(){
      this.$refs.submit1.submit()
    },
    diaConfirm(){
      this.productToPush.productAmount=this.value1;
      console.log(this.list, 'list改变前');
      if(this.productChangePrice === '') this.productChangePrice=0;
      if(parseInt(this.productChangePrice)+parseInt(this.productToPush.originPrice) < 0)
        this.$toast('变动价格低于原价，请重新选择')
      else {
        this.list.push({
          productId: this.productToPush.id,
          originPrice: parseInt(this.productToPush.originPrice),
          changePrice: parseInt(this.productChangePrice),
          lastPrice: parseInt(this.productChangePrice) + parseInt(this.productToPush.originPrice),
          productName: this.productToPush.productName,
          productImage: this.productToPush.productImage,
          productAmount: parseInt(this.productToPush.productAmount),
          orderNotes: ''
        });
        console.log(this.list, 'list改变后');
        this.showchoose = false;
        this.productShow = false;
      }
    },
    showPopup(){
      this.showpop=true;
    },
    onConfirm(value) {
      this. orderType = value;
      this.showPicker = false;
    },
//
    onUserCancel() {
      this.userShow = false;
    },
    onUserAdd (val) {
      console.log(val)
      this.customerInfo.customerName = val.name;
      this.customerInfo.id = val.id;
      this.orderBuyer=this.customerInfo.customerName;
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

    onproductSearchCancel() {
      this.productVal = '';
    },


      folCancel()
      {
        this.productShow = false;
      },
      chooseBuyer()
      {
        this.userShow = true
      },

      async onSubmit()
      {
         if(this.submitCount++ ===0) {
           console.log(1);
           console.log(this.orderBuyer);
           let url = "/api/se/order/insert";
           if (this.orderType === '撤销')
             this.orderStatus = -1;
           if (this.orderType === '待付款')
             this.orderStatus = 0;
           if (this.orderType === '待收货')
             this.orderStatus = 1;
           if (this.orderType === '交易成功')
             this.orderStatus = 2;
           if (this.orderType === '退款成功')
             this.orderStatus = 3;
           let changePrice = 0;
           let lastPrice = 0;
           let originPrice = 0;
           for (let i = 0; i < this.list.length; i++) {
             originPrice += this.list[i].originPrice * this.list[i].productAmount;
             changePrice += this.list[i].changePrice * this.list[i].productAmount;
             lastPrice += this.list[i].lastPrice * this.list[i].productAmount;
           }
           let postData = {
             customerId: this.customerInfo.id,
             customerName: this.orderBuyer,
             orderStaff: this.orderStaff,
             originPrice: originPrice,
             changePrice: changePrice,
             lastPrice: lastPrice,
             saleChannel: this.saleChannel,
             receivedAmount: this.receivedAmount,
             orderSource: this.orderSource,
             orderStatus: this.orderStatus,
             productList: this.list
           }
           const result = (await this.$http.post(url, JSON.stringify(postData), {headers: {"Content-Type": "application/json"}})).data

           if (result.code === 200) {
             Toast('订单创建成功');
             this.$router.push('orderList');
           } else
             Toast('订单创建失败,错误码' + result.code);
         }
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
      if(this.$route.query.type == 2) {
        this.$router.replace({
          path: '/perinfor',
          query: {
            id: this.customerInfo.id
          }
        });
      this.$router.go(-1);
      }
       else
        this.$router.push('orderList');
      },
    beforeClose({position, instance}) {
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
         for(let i=0;i<this.list.length;i++){
           if(instance.$attrs.title.id === this.list[i].id)
             this.list.splice(i, 1);
           Toast('产品删除成功');
         }
            console.log(this.list)
          });
          break;
      }
    },
    addProduct(){
      this.getProductList();
    this.productShow=true;
    },
//以下为列表
    // 产品搜素
    onProductSearch() {
      this.productList = [];
      this.productPageProps.pageNum = 1;
      this.getProductList();
    },
    // 产品搜索取消
    onProductSearchCancel() {
      this.productVal = "";
      this.productList = [];
      this.productPageProps.pageNum = 1;
      this.getProductList();
    },
  async  getProductList(){
    let url = "/api/se/product/query";
    let postData = {
      currentPage: this.productPageProps.pageNum++,
      pageCount: this.productPageProps.pageSize,
      like_productName:this.productVal
    }
    const result = (await this.$http.get(url,{params:postData})).data.data;
    if (result.length == 0) {
      // 已加载全部数据
      this.finished = true;
      Toast('已加载全部数据！');
    }
    for (let i = 0; i < result.length; i++) {
      this.productList.push(result[i]);
    }
    console.log(this.list);
    // 加载状态结束
    this.loading = false;
    },
    productConfirm(item){
      this.value1=1;
      this.productChangePrice='';
      this.productToPush.productName=item.productName;
      this.productToPush.id=item.id;
      this.productToPush.productImage=item.productImage;
      this.productToPush.originPrice=item.productPrice;
      this.showchoose=true;

      console.log(2)
      // this.list.push({})
    }
  },
}
</script>

<style lang="less" scoped>
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
.productList{
  background-color: #F3F4F8;
  margin-bottom: 10px;
  max-height:400px;
  overflow: auto
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
    font-size: 14px;
  }
  .stock{
    margin-top: 15px;
    font-size: 14px;
  }
  .productName{
    .van-ellipsis{
      font-size: 1rem;
    }
    //height: 40px;
  }
}
/deep/ .van-cell{
  //background-color: whitesmoke;
}
/deep/ .van-row2 {
  //justify-content: center;
  //background-color: white;
  border-bottom: 1px solid lightgray;
  //padding-top: 7px;
  ////margin-bottom: 4px;
  //padding-left: 8px;
  //padding-right: 8px;
  //border-radius: 5px;

  .price{
    text-align: right;
    font-size: 14px;
  }
  .stock1 {
    margin-top: 15px;
    font-size: 14px;
    text-align: right;
  }
}
/deep/ .nav-bar{
  height: 50px;
  margin-bottom: 5px;
  //border-bottom: 1px solid lightgray;
  .van-nav-bar__content{
    height:50px;
  }
}
.delete-button{
  height:100%;
}
.orderCreate_container{
  padding-top: 52px;
}

</style>
