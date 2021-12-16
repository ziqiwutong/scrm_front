<template>
  <div class="orderCreate_container">
    <!--  navBar栏-->
    <van-nav-bar  class="nav-bar"
                  title="编辑产品"
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
          name="产品价格"
          label="产品价格"
          placeholder="产品价格"
          :rules="[{ required: true, message: '请填写产品价格' }]"
        />

        <van-field
          v-model="retailPrice"
          type="retailPrice"
          name="产品零售价"
          label="产品零售价"
          placeholder="产品零售价"
          :rules="[{ required: false, message: '请填写产品零售价' }]"
        />

        <van-field
          v-model="wholesalePrice"
          type="wholesalePrice"
          name="产品批发价"
          label="产品批发价"
          placeholder="产品批发价"
          :rules="[{ required: false, message: '请填写产品批发价' }]"
        />

        <van-field name="productPic" label="产品图片">
          <template #input>
            <van-uploader :after-read="afterRead" v-model="productPic" />
          </template>
        </van-field>

        <van-field
          v-model="productInventory"
          type="productInventory"
          name="产品库存"
          label="产品库存"
          placeholder="产品库存"
          :rules="[{ required: false, message: '请填写产品库存' }]"
        />

        <van-field
          v-model="productType"
          type="productType"
          name="产品类型"
          label="产品类型"
          placeholder="产品类型"
          :rules="[{ required: false, message: '请填写产品类型' }]"
        />

        <van-field
          v-model="productCertificate"
          type="productCertificate"
          name="产品资质"
          label="产品资质"
          placeholder="产品资质"
          :rules="[{ required: false, message: '请填写产品资质' }]"
        />

        <!--        <van-field-->
        <!--          v-model="productCertificate"-->
        <!--          type="productCertificate"-->
        <!--          name="产品链接"-->
        <!--          label="产品链接"-->
        <!--          placeholder="产品链接"-->
        <!--          :rules="[{ required: true, message: '请填写产品链接' }]"-->
        <!--        />-->


        <van-field
          v-model="priceDescribe"
          rows="1"
          autosize
          label="价格描述"
          type="textarea"
          placeholder="请输入价格描述"
        />

        <van-field
          v-model="brandIntro"
          rows="1"
          autosize
          label="品牌信息"
          type="textarea"
          placeholder="请输入品牌信息"
        />

        <van-field
          v-model="productIntro"
          rows="1"
          autosize
          label="产品介绍"
          type="textarea"
          placeholder="请输入产品介绍"
        />

<!--        <van-field-->
<!--          v-model="notes"-->
<!--          rows="1"-->
<!--          autosize-->
<!--          label="备注"-->
<!--          type="textarea"-->
<!--          placeholder="请输入备注"-->
<!--        />-->



        <!--        <van-field name="productQr" label="产品二维码">-->
        <!--          <template #input>-->
        <!--            <van-uploader v-model="productQr" />-->
        <!--          </template>-->
        <!--        </van-field>-->


        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
export default {
  name: "productEdit",
  data() {
    return {
      //客户表弹出框
      followShow:'',

      productName: '',
      productPrice: '',
      productInventory: '',
      productType:'',
      productCertificate:'',
      // notes:'',
      productPic:[

      ],
      retailPrice:'',
      wholesalePrice:'',
      priceDescribe:'',
      productIntro:'',
      brandIntro:'',
      productPic1:''
    };
  },
  created () {
    this.test();
  },
  methods: {
    async test(){
      this.productID=this.$route.query.productID;
// 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。不需要写fun
      let url = "/api/se/product/queryById";
      let postData = {
        id:this.productID
      }
      const result = (await this.$http.get(url,{params:postData})).data.data;
      // for (let i = 0; i < result.length; i++) {
      //   this.list.push(result[i]);
      // }
        this.productName=result.productName;
        this.productPrice=result.productPrice;
        this.productInventory=result.productInventory;
        this.productType=result.typeName;
        this.productCertificate=result.certificate;
        // this.notes=result.notes;
        // this.productPic1=result.productImage;
         this.productPic.push({url: result.productImage});
        console.log(this.productPic[0])
      this.productPic1=result.productImage;
        this.retailPrice=result.retailPrice;
        this.wholesalePrice=result.wholesalePrice;
        this.priceDescribe=result.priceDescribe;
        this.productIntro=result.productIntro;
        this.brandIntro = result.brand;

    },
    async onSubmit() {
      let url = "/api/se/product/update";
      let postData = {
        productName: this.productName,
        productPrice: this.productPrice,
        productInventory: this.productInventory,
        typeName:this.productType,
        certificate: this.productCertificate,
        id:this.productID,
        priceChange:this.priceChange,
        productImage: this.productPic1,
        retailPrice:this.retailPrice,
        wholesalePrice:this.wholesalePrice,
        priceDescribe:this.priceDescribe,
        productIntro:this.productIntro,
        brand:this.brandIntro
      }
      const result = (await this.$http.post(url,JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('产品修改成功');
        this.$router.push('productList');
      }
      else
        Toast('产品修改失败,错误码' + result.code);

    },
    async afterRead(file) {
      let url="/fzk/file/pic/base64StrToPic"
      let postData = {
        picBase64Str: file.content,
        picType: 'productImage',
        isCompress:'false'
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
       this.productPic1=result;
    },
    onClickLeft() {
      this.$router.push({
        name: 'articleDetail',
        query: {
          articleid: this.$route.query.articleid,
          shareid: this.$route.query.shareid,
          wmid: this.$route.query.wmid,
          ifshowshareman: this.$route.query.ifshowshareman,
          source:this.$route.query.source,
          productid:this.$route.query.productID
        }
      });
    },

  },
}
</script>

<style lang="less" scoped>
/deep/ .van-nav-bar__left{
  font-size: 1rem;
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
</style>
