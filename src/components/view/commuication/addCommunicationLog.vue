<template>
  <div class="clueEdit_container">
    <div class="background">
      <van-button icon="arrow-left" size="40" class="renav" @click="onClickLeft">
      </van-button>
      <div class="title">新增沟通记录</div>
    </div>
    <!--  提交栏-->
    <div class="commit">
      <van-form @submit="onSubmit">
        <van-field
          v-model="customer"
          type="customer"
          name="客户"
          label="客户"
          placeholder="请选择客户"
          :rules="[{ required: true, message: '请选择客户' }]"
          readonly
          @click="userShow=true"
        />
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
          v-model="telephone"
          name="联系电话"
          label="联系电话"
          placeholder="请填写联系电话"
          :rules="[{ required: true, message: '请填写联系电话' }]"
        />
        <van-field
          v-model="companyName"
          name="客户公司"
          label="客户公司"
          placeholder="请填写客户公司"
          :rules="[{ required: true, message: '请填写客户公司' }]"
        />
        <van-field name="radio" label="沟通方式" label-width="6em">
          <template #input>
            <van-radio-group v-model="radio" direction="horizontal" class="clueType">
              <van-radio name="0">线下</van-radio>
              <van-radio name="1">电话</van-radio>
              <van-radio name="2">短信</van-radio>
              <van-radio name="3">微信</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          v-model="communicationTime"
          name="沟通时间"
          label="沟通时间"
          placeholder="沟通时间"
          :rules="[{ required: true, message: '请填写沟通时间，格式如下“2021-09-01 10:30:18”' }]"
        />

        <van-field
          v-model="communicationContent"
          rows="2"
          autosize
          label="沟通内容"
          type="textarea"
          maxlength="50"
          placeholder="请输入沟通内容"
          show-word-limit
        />

        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import AbbCusList from"../../component/AbbCusList.vue";
import { Toast } from 'vant';
export default {
  name: "addCommunicationLog",
  components:{
    AbbCusList,
  },
  data() {
    return {
      userShow:'',
      followVal: "",
      communicationTime: '',
      customer:'',
      telephone:'',
      companyName:'',
      customerId:1,
      communicationContent:'',
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
   // this.customerId=this.$route.query.customerId;
  },
  methods: {
    async onSubmit() {
      let url = "/api/se/communication/addCommunicationLog";
      let postData = {
        customerId: this.customerId,
        customerName:this.customerName,
        telephone:this.telephone,
        customer:this.customer,
        companyName:this.companyName,
        clueResponsible:this.clueResponsible,
        communicationTime:this.communicationTime,
        communicationContent:this.communicationContent,
        communicationWay:this.radio,
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('新建沟通记录成功');
        this.onClickLeft(this.id);
      }
      else
        Toast('新建沟通记录失败,错误码' + result.code);
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
      let url = "/api/cms/user/query";
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
</style>
