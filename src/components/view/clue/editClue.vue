<template>
  <div class="clueEdit_container">
    <!--  navBar栏-->
    <van-nav-bar  class="nav-bar"
                  title="编辑线索"
                  left-text="返回"
                  left-arrow
                  fixed
                  @click-left="onClickLeft"

    />
    <!--  提交栏-->
    <div class="commit">
      <van-form @submit="onSubmit">
        <van-field
          v-model="clueName"
          name="线索名称"
          label="线索名称"
          placeholder="线索名称"
          :rules="[{ required: true, message: '请填写线索名' }]"
        />

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
            type="date"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @cancel="dateShow = false"
            @confirm="dateConfirm"
          />
        </van-popup>

        <van-field name="radio" label="线索状态" label-width="6em">
          <template #input>
            <van-radio-group v-model="radio" direction="horizontal" class="clueType">
              <van-radio name="新线索">新线索</van-radio>
              <van-radio name="跟进中">跟进中</van-radio>
            </van-radio-group>
          </template>
        </van-field>


        <van-field
          v-model="clueEditor"
          type="clueEditor"
          name="线索录入人"
          label="线索录入人"
          placeholder="线索录入人"
          :rules="[{ required: true, message: '请填写线索录入人' }]"
          readonly
          @click="toAddFollow"
        />
        <van-popup
          v-model="followShow"
          position="bottom"
          :style="{ height: '100%' }"
          :overlay="false"
          duration="0"
        >
          <van-button class="follow-cancel-btn" @click="folCancel">取消</van-button>
          <van-search
            v-model="followVal"
            placeholder="请输入搜索关键词"
            @search="onFollowSearch"
            @cancel="onFollowSearchCancel"
          />
          <van-cell
            v-for="item in followList"
            :key="item.id"
            @click="followConfirm(item)"
          >
            <!-- 跟进人-跟进人信息 -->
            <van-row>
              <!-- 跟进人-跟进人头像 -->
              <van-col span="4"
              ><van-image round width="40" height="40" :src="item.userIcon"
              /></van-col>
              <!-- 跟进人-跟进人姓名 -->
              <van-col span="6" class="list-content-name"
              ><div class="van-ellipsis">
                {{ item.username }}
              </div></van-col
              >
              <!-- 跟进人-跟进人公司信息 -->
              <van-col offset="2" class="list-content-msg">{{
                  item.telephone
                }}</van-col>
            </van-row>
          </van-cell>
        </van-popup>

        <van-field
          v-model="clueDiscover"
          type="clueDiscover"
          name="线索发现人"
          label="线索发现人"
          placeholder="线索发现人"
          :rules="[{ required: true, message: '请填写线索发现人' }]"
          readonly
          @click="toAddDiscover"
        />

        <van-field
          v-model="clueResponsible"
          type="clueResponsible"
          name="线索责任人"
          label="线索责任人"
          placeholder="线索责任人"
          :rules="[{ required: true, message: '请填写线索责任人' }]"
          readonly
          @click="toAddResponsible"
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
import { Toast } from 'vant';
export default {
  name: "editClue",
  data() {
    return {
      followVal: "",
      clueName: '',
      clueDate: '',
      clueEditor:'',
      clueDiscover:'',
      clueResponsible:'',
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
    this.test();
  },

  methods: {
    async test(){
      this.id=this.$route.query.id;
// 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。不需要写fun
      let url = "/api/se/clue/queryClueStatus";
      let postData = {
        clueId:this.id
      }
      const result = (await this.$http.get(url, {params:postData})).data.data;
      // console.log(result[0])
      this.clueName=result[0].clueName;
      this.value=result[0].clueDate;
      this.clueEditor=result[0].clueEditor;
      this.clueDiscover=result[0].clueDiscover;
      this.clueResponsible=result[0].clueResponsible;
      this.radio=result[0].clueStatus;
      this.switchChecked=result[0].businessOpporitunityFlag;
    },
    async onSubmit() {
      let url = "/api/se/clue/editClue";
      let postData = {
        id: this.$route.query.id,
        clueName:this.clueName,
        clueDate:this.value,
        clueEditor:this.clueEditor,
        clueDiscover:this.clueDiscover,
        clueResponsible:this.clueResponsible,
        clueStatus:this.radio,
        businessOpporitunityFlag:this.switchChecked,
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('订单修改成功');
        this.onClickLeft(this.id);
      }
      else
        Toast('订单修改失败,错误码' + result.code);
    },

    onClickLeft(clueId) {
      this.$router.push({
        path: '/clueDetail',
        query: {
          clueId:this.id,
        }
      });
    },
    // 时间-时间录入处理
    dateConfirm(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      this.value = y + "-" + m + "-" + d;
      this.dateShow = false;
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
        this.clueEditor = item.username;
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
  },
}
</script>

<style lang="less" scoped>

/deep/ .nav-bar{
  height: 50px;
  margin-bottom: 5px;
  //bclue-bottom: 1px solid lightgray;
  .van-nav-bar__content{
    height:50px;
  }
}

.clueEdit_container{
  padding-top: 52px;
}

.clueType {
  width:300px;
}
//跟进人-取消
.follow-cancel-btn {
  border: none;
}
</style>
