<template>
  <div>
    <div class="navbar"  @click="toClueList">
      <van-nav-bar
        title="新建线索"
        left-text="返回"
        left-arrow
      />
    </div>
    <van-form @submit="onSubmit"  class="addclue">
      <van-field
        v-model="clueName"
        name="线索名称"
        label="线索名称"
        placeholder="线索名称"
        :rules="[{ required: true, message: '请填写线索名称' }]"
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
        @click="onChooseUserType"
      />
      <van-popup
      v-model="followShow"
      position="bottom"
      :style="{height:'100%'}"
      :overlay="false"
      duration="0"
      >
      <AbbList
      :type="1"
      v-show="followShow"
      @returnClick="onFollowCancel"
      @onCh="onFollowAdd"
      />
      </van-popup>
      <van-field
        v-model="clueDiscover"
        type="clueDiscover"
        name="线索发现人"
        label="线索发现人"
        placeholder="线索发现人"
        :rules="[{ required: true, message: '请填写线索线索发现人' }]"
        readonly
        @click="onChooseUserType1"
      />
      <van-field
        v-model="clueResponsible"
        type="clueResponsible"
        name="线索责任人"
        label="线索责任人"
        placeholder="线索责任人"
        :rules="[{ required: true, message: '请填写线索线索责任人' }]"
        readonly
        @click="onChooseUserType2"
      />
      <div style="margin: 16px;" class="submit">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

import { Toast } from 'vant';

<script>
import {Toast} from "vant";
import AddForm from "../../component/AddForm";
import AbbList from "../../component/AbbList";
export default {
  name: "addClue",
  components:{
    AddForm,
    AbbList,
  },
  data() {
    return {
      userType:'',
      clueName: '',
      clueDate: '',
      clueEditor:'',
      clueDiscover:'',
      clueResponsible:'',
      //线索状态单选框
      radio: '',
      value: '',
      val: '',
      name: '',
      dateShow: false,
      dateVal: '',
      // 时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 时间-时间最大值
      maxDate: new Date(2025, 10, 1),
      //时间-现在时间
      currentDate: new Date(),
      followShow: false,
    };
  },
  methods: {
    async onSubmit() {
      let url = "/api/se/clue/addClue";
      let postData = {
        // id:this.id;
        clueName:this.clueName,
        clueDate:this.value,
        clueEditor:this.clueEditor,
        clueDiscover:this.clueDiscover,
        clueResponsible:this.clueResponsible,
        clueEditorId:this.clueEditorId,
        clueDiscoverId:this.clueDiscoverId,
        clueResponsibleId:this.clueResponsibleId,
        clueStatus:this.radio,
        bizOppFlag:false,
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('线索提交成功');
        this.toClueList();
      }
      else
        Toast('线索提交失败,错误码' + result.code);
    },
    toClueList(){
      this.$router.push('/clueList');
    },
    onChooseUserType(){
      this.followShow=true;
     this.userType = 1;
    },
    onChooseUserType1(){
      this.followShow=true;
      this.userType = 2;
    },
    onChooseUserType2(){
      this.followShow=true;
      this.userType = 3;
    },
    onFollowCancel(){
      this.followShow=false;
    },
    onFollowAdd(val){
      if(this.userType==1)
      {
        this.clueEditor=val.name;
        this.clueEditorId=val.id;
      }
      if(this.userType==2)
      {
        this.clueDiscover=val.name;
        this.clueDiscoverId=val.id;
      }
      if(this.userType==3)
      {
        this.clueResponsible=val.name;
        this.clueResponsibleId=val.id;
      }
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
  },
}
</script>

<style lang="less" scoped>
.addclue {
  position: absolute;
  top:50px;
}

.clueType {
  width:300px;
}
.submit {
  width:80%;
}
</style>
