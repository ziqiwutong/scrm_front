<template>
  <div class="clueEdit_container">
    <div class="background">
      <van-button icon="arrow-left" size="40" class="renav" @click="onClickLeft">
      </van-button>
      <div class="title">编辑沟通记录</div>
    </div>
    <!--  提交栏-->
    <div class="commit">
      <van-form >
<!--        <van-field-->
<!--          v-model="customer"-->
<!--          type="customer"-->
<!--          name="客户"-->
<!--          label="客户"-->
<!--          placeholder="请选择客户"-->
<!--          :rules="[{ required: true, message: '请选择客户' }]"-->
<!--          readonly-->
<!--          @click="userShow=true"-->
<!--        />-->
<!--        <van-popup-->
<!--          v-model="userShow"-->
<!--          position="bottom"-->
<!--          :overlay="false"-->
<!--          duration="0"-->
<!--          >-->
<!--          <AbbCusList-->
<!--          :type="3"-->
<!--          v-show="userShow"-->
<!--          @returnClick="onUserCancel"-->
<!--          @onCh="onUserAdd"-->
<!--          />-->
<!--          </van-popup>-->
<!--        <van-field-->
<!--          v-model="telephone"-->
<!--          name="联系电话"-->
<!--          label="联系电话"-->
<!--          placeholder="请填写联系电话"-->
<!--          :rules="[{ required: true, message: '请填写联系电话' }]"-->
<!--        />-->
<!--        <van-field-->
<!--          v-model="companyName"-->
<!--          name="客户公司"-->
<!--          label="客户公司"-->
<!--          placeholder="请填写客户公司"-->
<!--          :rules="[{ required: true, message: '请填写客户公司' }]"-->
<!--        />-->
        <van-field name="radio" label="沟通方式" label-width="6em">
          <template #input>
            <van-radio-group v-model="radio" direction="horizontal" class="clueType">
              <van-radio name="线下沟通">线下</van-radio>
              <van-radio name="打电话">电话</van-radio>
              <van-radio name="发短信">短信</van-radio>
              <van-radio name="发微信">微信</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          readonly
          clickable
          name="datetimePicker"
          :value="value"
          label="时间选择"
          placeholder="点击选择时间"
          @click="dateShow = true"
        />
        <van-popup v-model="dateShow" position="bottom">
          <van-datetime-picker
            v-model="dateVal"
            type="datetime"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="dateShow = false"
            @confirm="dateConfirm"
          />
        </van-popup>
        <van-field
          v-model="relationDetail"
          rows="2"
          autosize
          label="沟通内容"
          type="textarea"
          maxlength="50"
          placeholder="请输入沟通内容"
          show-word-limit
        />

        <div class="button-block">
          <van-button round class="button-edit-bo" type="info" @click="Submit">提交记录</van-button>
          <van-button plain round  class="button-delete-bo" type="info" @click="clueDelete">删除记录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
import AbbCusList from"../../component/AbbCusList.vue";
export default {
  name: "addCommunicationLog",
  components:{
    AbbCusList,
  },
  data() {
    return {
      userShow:'',
      id:'',
      cuslist:[],
      followVal: "",
      communicationTime: '',
      customer:'',
      telephone:'',
      companyName:'',
      customerId:1,
      relationType:1,
      relationDetail:'',
      //线索状态单选框
      radio: '',
      //转换成商机按钮
      switchChecked: '',
      value: '',
      dateShow: false,
      dateVal: '',
      // 时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 时间-时间最大值
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      followShow: false,
      // 筛选-跟进人列表
      followList: [],
      // 跟进人加载-分页
      followPageProps: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  created () {
    this.cuslist = this.$route.query.cuslist;
    this.test();
    console.log(this.cuslist)
  },

  methods: {
    async test(){
      this.id=this.$route.query.id;
      let temp = this.cuslist.id;
// 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。不需要写fun
      let url = "/api/se/communication/queryCustomerRelationDetail";
      let postData = {
        id:this.id,
        // customerId:temp,
        // relationType:this.relationType,
      }
      const result = (await this.$http.get(url, {params:postData})).data.data;
      console.log(result);
      var a= result.communicationTime;
      var b =a.lastIndexOf(':');
      a=a.substring(0,b);
      // this.customer=result.customerName;
      // this.telephone=result.telephone;
      // this.companyName=result.belongCompany;
      this.radio=result.relationType;
      this.value=a;
      this.relationDetail=result.relationDetail;
    },
    async Submit() {
      let url = "/api/se/communication/editCustomerRelation";
      let postData = {
        customerId:this.cuslist.id,
        id: this.id,
        // customerName:this.customerName,
        // telephone:this.telephone,
        relationType:this.radio,
        relationDetail:this.relationDetail,
        communicationTime:this.value+":"+"00",
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('订单修改成功');
        this.onClickLeft(this.id);
      }
      else
        Toast('订单修改失败,错误码' + result.code);
    },

    async clueDelete() {
      let url = "/api/se/communication/deleteCustomerRelation";
      let postData = {
        // relationType:this.radio,
        // customerId:this.cuslist.id,
        id:this.id,
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data;
      if(result.code === 200) {
        Toast('更新删除成功');
        this.onClickLeft(this.id);
      }
      else
        Toast('更新删除失败,错误码' + result.code);
    },
    onClickLeft() {
      this.$router.push({ name: "communicationDetail", query: { cuslist: this.$route.query.cuslist } });
    },
    toAddFollow() {
      this.userType = 0;
      this.followShow = true;
      this.followList = [];
      this.getUserList();
    },
    toAddDiscover() {
      this.userType = 1;
      this.followShow = true;
      this.followList = [];
      this.getUserList();
    },
    toAddResponsible() {
      this.userType = 2;
      this.followShow = true;
      this.followList = [];
      this.getUserList();
    },
    // 跟进人搜索
    onFollowSearch() {
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.getUserList();
    },
    // 跟进人搜索取消
    onFollowSearchCancel() {
      this.followVal = "";
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.getUserList();
    },
    folCancel() {
      this.followShow = false;
      this.userType=""
    },
    // 跟进人-选择
    followConfirm(item) {
      this.followShow = false;
      // 筛选-跟进人
      if (this.userType == 0) {
        this.customer = item.username;
        this.ifChoose = false;
      }
      // 筛选-商机负责人
      else if (this.userType == 1) {
        this.clueDiscover = item.username;
        this.ifoppoChoose = false;
      }
      // 筛选-创建人
      else if (this.userType == 2) {
        this.clueResponsible = item.username;
        this.ifbulidChoose = false;
      }
    },
    // 获取用户消息
    async getUserList() {
      let url = "/api/se/cms/user/query";
      if (this.followVal != "") {
        url += "?name=" + this.followVal;
      }
      const res = await this.$http.get(url, {
        params: {
          currentPage: this.followPageProps.pageNum,
          pageCount: this.followPageProps.pageSize,
        },
      });

      let userNum = res.data.totalCount;
      for (let i = 0; i < this.followPageProps.pageSize; i++) {
        this.followList.push(res.data.data[i]);
        if (this.followList.length >= userNum) {
          this.finished = true;
          this.followPageProps.pageNum = 1;
          break;
        }
      }
      if (this.followList.length >= userNum) this.finished = true;
      else {
        console.log(this.followList.length);
        this.followPageProps.pageNum++;
        this.getUserList();
      }

      console.log(this.followList);
    },
    //组件关闭后的处理函数
    onUserCancel(){
      this.userShow =false;
    },
//点击相应用户后的点击处理事件，返回val，包括用户的id和name
    onUserAdd (val){
      this.customer=val.name;
    },
    // 时间-时间录入处理
    dateConfirm(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var h = date.getHours();
      var min =date.getMinutes();
      // var s =date.getSeconds();
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      h = h < 10 ? "0" +h :h;
      min =min <10 ? "0"+ min:min;
      // s =s <10 ? "0"+s:s;
      // this.value = y + "-" + m + "-" + d +" "+h+":"+min+":"+s;
      this.value = y + "-" + m + "-" + d +" "+h+":"+min;
      this.dateShow = false;
    },
  },
}
</script>

<style lang="less" scoped>

.background {
  background-color: #4881F2;
  width: 100%;
  height: 44px;
  //对象可层叠
  position: absolute;
  z-index: 1;
  top:0px;
}
.commit {
  position: absolute;
  top:50px;
  width:100%;
}


.renav {
  position: absolute;
  background-color: #4881F2;
  color: #ffffff;
  border: none;
  top: 14px;
  left:15px;
  height: 20px;
  z-index: 130;
}
.title {
  position: absolute;
  top: 10px;
  left:150px;
  color: #ffffff;
  font-size: 18px;
}
.clueEdit_container{
  padding-top: 52px;
}

.clueType {
  width:280px;
}
//跟进人-取消
.follow-cancel-btn {
  border: none;
}
.button-block {
  margin-left: 6%;
  width: 88%;
  display: flex;
  padding-bottom: 4vw;
  justify-content: space-between;
  padding-top: 4vw;
}

.button-edit-bo {
  height: 13vw;
  width: 40vw;
}

.button-delete-bo {
  height: 13vw;
  width: 40vw;
}
</style>

