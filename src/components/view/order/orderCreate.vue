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
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
import { areaList } from "@vant/area-data";
import {getUrl} from "../../../utils/replaceUrl";
export default {
  name: "orderCreate",
  data() {
    return {
      pageProps: {
        pageNum: 1,
        pageSize: 10
      },
      list:[],
      customerInfo:{
        id:'',
        customerName:''
      },
      loading: false,
      finished: false,
      followVal:'',
      followShow:false,
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
      productPic1:'',


    //  以上为新建客户弹出框
    };
  },
  methods: {
    newCustomer(){
      this.showform=true;
    },
    onFollowSearchCancel(){
      this.followVal ='';
    },
    async onFollowSearch(){
      let url = "/api/se/customer/query";
      this.list=[];
      this.pageProps.pageNum=1;
      this.pageProps.pageSize=10;
      let postData = {
        currentPage: this.pageProps.pageNum++,
        pageCount: this.pageProps.pageSize,
        like_customerName:this.followVal
      }
      const result = (await this.$http.get(url, {params: postData})).data.data
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
    followConfirm(item) {
      this.customerInfo.id=item.id;
      this.customerInfo.customerName=item.customerName;
      this.orderBuyer=item.customerName;
      this.followShow=false;
    },
    folCancel(){
      this.followShow=false;
    },
    chooseBuyer(){
      // console.log(1)
      this.followShow=true
      this.onLoad();
    },
    // async onLoad(){
    //   let url = "/api/se/customer/query";
    //   let postData = {
    //     currentPage: this.pageProps.pageNum++,
    //     pageCount: this.pageProps.pageSize,
    //   }
    //   const result = (await this.$http.get(url, {params: postData})).data.data
    //   if (result.length == 0) {
    //     // 已加载全部数据
    //     this.finished = true;
    //     Toast('已加载全部数据！');
    //   }
    //   for (let i = 0; i < result.length; i++) {
    //     this.list.push(result[i]);
    //   }
    //   // console.log(this.list);
    //   // 加载状态结束
    //   this.loading = false;
    // },
    // onConfirm(value) {
    //   this. orderType = value;
    //   this.showPicker = false;
    // },
    async onSubmit() {
      let url = "/api/se/order/addOrder";
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
      let postData = {
        productName: this.productName,
        productPrice: this.productPrice,
        orderBuyer: this.orderBuyer,
        orderStaff:this.orderStaff,
        productBuyAmount: this.productBuyAmount,
        orderSource:this.orderSource,
        notes:this.notes,
        priceChange:this.priceChange,
        productPic: this.productPic1,
        orderStatus:this.orderStatus,
      }

      const result = (await this.$http.post(url,JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('订单创建成功');
        this.$router.push('orderList');
      }
      else
        Toast('订单创建失败,错误码' + result.code);

    },
    async afterRead(file) {
      let url="/fzk/file/pic/base64StrToPic"
      let postData = {
        picBase64Str: file.content.substring(22),
        picFormat:'png',
        picType: 'productImage',
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      this.productPic1= result;
    },
    onClickLeft() {
      this.$router.push('orderList');
    },



// //以下为新建客户
//     // 新建客户-弹窗
//     formClick() {
//       this.showform = !this.showform;
//       // 客户类型保持一致
//       this.addList.customerType = "个人客户";
//     },
//     // 新建客户-单选限定
//     cutTabClickOnly(item, index) {
//       // 特殊处理客户类型没有单选
//       if (item.name == "客户类型") {
//         for (let i = 0; i < item.class.length; i++) {
//           if (i == index) {
//             item.class[i].isSelected = true;
//           } else {
//             item.class[i].isSelected = false;
//           }
//         }
//       } else {
//         // 点击高亮逻辑
//         for (let i = 0; i < item.class.length; i++) {
//           if (i == index) {
//             item.class[i].isSelected = !item.class[i].isSelected;
//           } else {
//             item.class[i].isSelected = false;
//           }
//         }
//       }
//       let empt = true;
//       let key = item.name;
//       // 单类选择逻辑
//       for (let j = 0; j < item.class.length; j++) {
//         if (item.class[j].isSelected == true) {
//           empt = false;
//           let val = item.class[j].name;
//           // 读取当前类别名和选中值，处理选中值在当前类别中仅能亮一个
//           this.onSubmitVal(key, val);
//         }
//       }
//       // 处理点击取消高亮
//       if (empt && key != "客户类型") {
//         let val = "";
//         this.onSubmitVal(key, val);
//       }
//     },
//     // 新建客户-单选处理
//     onSubmitVal(key, val) {
//       if (key == "性别") this.addList.sex = val;
//       if (key == "年龄范围") this.addList.ageRange = val;
//       if (key == "来源") this.addList.origin = val;
//       if (key == "客户等级") this.addList.customerLevel = val;
//       if (key == "企业类型") this.addList.companyType = val;
//       if (key == "行业分类") this.addList.industry = val;
//       if (key == "注册资本") this.addList.registeredCapital = val;
//       if (key == "员工数量") this.addList.companySize = val;
//       if (key == "客户类型") {
//         this.addList.customerType = val;
//         console.log(this.addList.customerType);
//       }
//     },
//     // 新建客户-头像-大小限制
//     onOversize(file) {
//       console.log(file);
//       Toast("文件大小不能超过 500kb");
//     },
//     getCurrentTime() {
//       //获取当前时间并打印
//       let time;
//       let yy = new Date().getFullYear();
//       let mm = new Date().getMonth() + 1;
//       let dd = new Date().getDate();
//       time = yy + "-" + mm + "-" + dd;
//       this.addList.enterPoolDate = time;
//     },
//     // 新建客户-生日时间-弹窗
//     toDate() {
//       this.dateShow = true;
//       this.addDateType = "生日";
//     },
//     // 新建客户-公司时间时间-弹窗
//     toDate1() {
//       this.dateShow = true;
//       this.addDateType = "成立日期";
//     },
//     // 新建客户-客户状态确认
//     onCusStaConfirm(value) {
//       console.log(value);
//       this.addCusStaShow = false;
//       this.addList.customerStatus = value;
//     },
//     // 新建客户-时间-时间录入处理
//     dateConfirm(val) {
//       var y = val.getFullYear();
//       var m = val.getMonth() + 1;
//       m = m < 10 ? "0" + m : m;
//       var d = val.getDate();
//       d = d < 10 ? "0" + d : d;
//       const time = y + "-" + m + "-" + d;
//       if (this.addDateType == "生日") this.addList.birthday = time;
//       else if (this.addDateType == "成立日期")
//         this.addList.establishDate = time;
//       this.dateShow = false;
//       this.addDateType = "";
//     },
//     // 新建客户-时间-取消
//     dateCancel() {
//       this.dateShow = false;
//     },
//     // 新建客户-地区弹窗-获取地址信息
//     onConfirm1(values) {
//       this.addList.city = values
//         .filter((item) => !!item)
//         .map((item) => item.name)
//         .join("/");
//       this.showArea = false;
//     },
//     onScrConfirm(values) {
//       this.scrCity = values
//         .filter((item) => !!item)
//         .map((item) => item.name)
//         .join("/");
//       this.ifAreaChoose = false;
//       this.showScrArea = false;
//     },
//     // 新建客户-返回
//     onClickAddRe() {
//       this.showform = false;
//     },
//     // 新建客户-保存
//     onClickAddSave() {
//       this.showform = false;
//       this.onClickSumbmit();
//     },
//     // 新建客户-提交
//     async onClickSumbmit() {
//       if (this.addList.customerName == "") {
//         Toast("请输入用户名");
//       } else {
//         let i, j;
//         for (i = 0; i < this.addLabelList.length; i++) {
//           for (j = 0; j < this.addLabelList[i].class.length; j++) {
//             if (this.addLabelList[i].class[j].isSelected == true) {
//               this.addLabelList[i].class[j].isSelected = false;
//             }
//           }
//         }
//         this.getCurrentTime();
//         // 客户类型选择高亮
//         this.addLabelList[8].class[0].isSelected = true;
//
//         // 提交文件不为空
//         if (this.uploader != "") {
//           let str = this.uploader[0].content;
//           let type = this.uploadPicType(str);
//           // this.uploadCusIcon(str, type, type.length);
//           let url = "/api/file/pic/base64StrToPic";
//           let picture;
//           if (type.length == 3) {
//             picture = str.slice(22);
//           } else if (type.length == 4) {
//             picture = str.slice(23);
//           }
//           console.log(picture);
//           let params = new FormData();
//           params.append("picBase64Str", picture);
//           params.append("picFormat", type);
//           params.append("picType", "customerIcon");
//           await this.$http
//             .post(url, params, {
//               headers: { "Content-Type": "application/x-www-form-urlencoded" },
//             })
//             .then((res) => {
//               console.log(res.data.data);
//               this.addList.customerIcon = res.data.data;
//             });
//         }
//
//         // 传输
//         if (this.addList.customerType == "个人客户") {
//           this.addList.customerType = 0;
//         } else {
//           this.addList.customerType = 1;
//         }
//
//         if (
//           this.addList.customerStatus == "未分配" ||
//           this.addList.customerStatus == "潜在客户"
//         ) {
//           this.addList.followStaffId = "";
//           this.addList.followStaffName = "";
//         }
//         // 客户不是潜在客户
//         this.addList.potential = 0;
//
//         function removeEmptyField(obj) {
//           var newObj = {};
//           if (typeof obj === "string") {
//             obj = JSON.parse(obj);
//           }
//           if (obj instanceof Array) {
//             newObj = [];
//           }
//           if (obj instanceof Object) {
//             for (var attr in obj) {
//               // 属性值不为'',null,undefined才加入新对象里面(去掉'',null,undefined)
//               if (
//                 obj.hasOwnProperty(attr) &&
//                 obj[attr] !== "" &&
//                 obj[attr] !== null &&
//                 obj[attr] !== undefined
//               ) {
//                 if (obj[attr] instanceof Object) {
//                   // 空数组或空对象不加入新对象(去掉[],{})
//                   if (
//                     JSON.stringify(obj[attr]) === "{}" ||
//                     JSON.stringify(obj[attr]) === "[]"
//                   ) {
//                     continue;
//                   }
//                   // 属性值为对象,则递归执行去除方法
//                   newObj[attr] = removeEmptyField(obj[attr]);
//                 } else if (
//                   typeof obj[attr] === "string" &&
//                   ((obj[attr].indexOf("{") > -1 &&
//                       obj[attr].indexOf("}") > -1) ||
//                     (obj[attr].indexOf("[") > -1 &&
//                       obj[attr].indexOf("]") > -1))
//                 ) {
//                   // 属性值为JSON时
//                   try {
//                     var attrObj = JSON.parse(obj[attr]);
//                     if (attrObj instanceof Object) {
//                       newObj[attr] = removeEmptyField(attrObj);
//                     }
//                   } catch (e) {
//                     newObj[attr] = obj[attr];
//                   }
//                 } else {
//                   newObj[attr] = obj[attr];
//                 }
//               }
//             }
//           }
//           return newObj;
//         }
//         this.addList = removeEmptyField(this.addList);
//         console.log(this.addList);
//         let url = "/api/se/customer/insert";
//         let postData = this.addList;
//         const result = (await this.$http.post(url, postData)).data;
//         if (result.code == "200") {
//           Toast("成功添加客户");
//           console.log(result.data);
//           this.newCusRelation(result.data.id, "进入客户池");
//         }
//         this.addList = this.addListTemp;
//         this.uploader = [];
//         this.showform = false;
//         this.cusList = [];
//         this.finished = false;
//         this.pageProps.pageNum = 1;
//         this.onLoad();
//       }
//     },
//     // 新建客户-头像格式判断
//     uploadPicType(str) {
//       if (str.slice(11, 14) == "png") {
//         return "png";
//       }
//       if (str.slice(11, 14) == "svg") {
//         return "svg";
//       }
//       if (str.slice(11, 14) == "bmp") {
//         return "bmp";
//       }
//       if (str.slice(11, 14) == "ico") {
//         return "ico";
//       }
//       if (str.slice(11, 14) == "jpg") {
//         return "jpg";
//       }
//       if (str.slice(11, 15) == "jpeg") {
//         return "jpeg";
//       }
//       if (str.slice(11, 15) == "tiff") {
//         return "tiff";
//       }
//
//       return "wrong";
//     },
//     //获取用户列表
//     async getUserList() {
//       let url = "/api/cms/user/query";
//       if (this.followVal != "") {
//         url += "?name=" + this.followVal;
//       }
//       const res = await this.$http.get(url, {
//         params: {
//           currentPage: this.followPageProps.pageNum,
//           pageCount: this.followPageProps.pageSize,
//         },
//       });
//
//       let userNum = res.data.totalCount;
//       for (let i = 0; i < this.followPageProps.pageSize; i++) {
//         this.followList.push(res.data.data[i]);
//         if (this.followList.length >= userNum) {
//           this.finished = true;
//           this.followPageProps.pageNum = 1;
//           break;
//         }
//       }
//       if (this.followList.length >= userNum) this.finished = true;
//       else {
//         console.log(this.followList.length);
//         this.followPageProps.pageNum++;
//         this.getUserList();
//       }
//
//       console.log(this.followList);
//     },
//     toAddFollow(){
//       this.followShow1=true;
//       this.userType=3;
//       this.followList=[];
//       this.getUserList();
//     },
//     // 跟进人-页面取消
//     folCancel1() {
//       this.followShow1 = false;
//     },
//     // 跟进人搜素
//     onFollowSearch1() {
//       this.followList = [];
//       this.followPageProps.pageNum = 1;
//       this.getUserList();
//     },
//     // 跟进人搜索取消
//     onFollowSearchCancel1() {
//       this.followVal1 = "";
//       this.followList = [];
//       this.followPageProps.pageNum = 1;
//       this.getUserList();
//     },
//     // 跟进人-选择
//     followConfirm1(item) {
//       this.followShow1 = false;
//       // 筛选-跟进人
//       if (this.userType == 0) {
//         this.followChsVal.val = item.username;
//         this.followChsVal.id = item.id;
//         this.ifChoose = false;
//       }
//       // 筛选-商机负责人
//       else if (this.userType == 1) {
//         this.oppoChsVal.val = item.username;
//         this.oppoChsVal.id = item.id;
//         this.ifoppoChoose = false;
//       }
//       // 筛选-创建人
//       else if (this.userType == 2) {
//         this.bulidChsVal.val = item.username;
//         this.oppoChsVal.id = item.id;
//         this.ifbulidChoose = false;
//       }
//       // 新建-跟进人
//       else if (this.userType == 3) {
//         this.addList.followStaffName = item.username;
//         this.addList.followStaffId = item.id;
//       }
//     },
//
//     // 新建客户-客户状态-取消
//     onCusStaCancel() {
//       this.addCusStaShow = false;
//     },
//     // 客户关系-新建
//     async newCusRelation(id, type) {
//       let url = "/api/se/customer/relation/insert";
//       console.log(id);
//       console.log(type);
//       const result = await this.$http.post(url, {
//         customerId: id,
//         relationType: type,
//       });
//       if (result.data.code == "200") {
//         Toast("操作成功");
//       }
//     },
//     // 筛选-跟进人列表-弹窗
//     toFollow() {
//       this.followShow1 = true;
//       this.userType = 0;
//       this.followList = [];
//       this.getUserList();
//     },

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
