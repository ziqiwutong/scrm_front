<template>
  <div>
    <div class="navbar"  @click="toBoList">
      <van-nav-bar
        title="新建商机"
        left-text="返回"
        left-arrow
      />
    </div>
    <van-form @submit="onSubmit"  class="addBo">
      <!-- 商机模板 -->
      <van-field
        v-model="boName"
        name="商机名称"
        label="商机名称"
        placeholder="请输入商机名称"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />

      <!-- 商机模板 -->
      <van-field
        name="商机模板"
        label="商机模板"
        placeholder="默认模板"
        readonly
      />

      <!-- 商机创建时间 -->
      <van-field
        readonly
        clickable
        name="boDatetimePicker"
        :value="boDate"
        label="商机创建时间"
        placeholder="点击选择时间"
        @click="boDateShow = true"
      />
      <van-popup v-model="boDateShow" position="bottom">
        <van-datetime-picker
          v-model="boDateVal"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="boDateShow = false"
          @confirm="boDateConfirm(boDateVal)"
        />
      </van-popup>

      <!-- 商机金额 -->
      <van-field
        v-model="boAmount"
        name="商机金额"
        type="number"
        label="商机金额"
        placeholder="请输入商机金额"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />

      <!--预计成交时间-->
      <van-field
        readonly
        clickable
        name="boExpectDatetimePicker"
        :value="boExpectDate"
        label="预计成交时间"
        placeholder="点击选择时间"
        @click="boExpectDateShow = true"
      />
      <van-popup v-model="boExpectDateShow" position="bottom">
        123
<!--        <van-datetime-picker-->
<!--          v-model="boExpectDateVal"-->
<!--          type="date"-->
<!--          title="选择年月日"-->
<!--          :min-date="minDate"-->
<!--          :max-date="maxDate"-->
<!--          @cancel="boExpectDateShow = false"-->
<!--          @confirm="boExpectDateConfirm(boExpectDateVal)"-->
<!--        />-->
      </van-popup>

      <!-- 跟进阶段 -->
      <van-field
        readonly
        clickable
        name="datetimePicker"
        :value="boFollowStatus"
        label="跟进阶段"
        placeholder="点击选择跟进阶段"
        @click="followStatusShow = true"
      />
      <van-popup v-model="followStatusShow" position="bottom">

      </van-popup>

      <!-- 提交按钮 -->
      <div style="margin: 16px;" class="submit">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "addBizOpp",
  data() {
    return {
      boName: '',
      boDate: '',         //商机的创建时间
      boDateVal: '',
      boAmount: '',
      boExpectDate: '',   //商机的预计成交的时间
      boExpectDateVal: '',
      boDateShow: false,
      boDateExpectShow: false,
      dateVal: '',
      // 时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 时间-时间最大值
      maxDate: new Date(2025, 10, 1),

      boFollowStatus: false,
      boEditor: '',
    };
  },
  methods: {
    async onLoad() {
      this.boEditor = this.$store.state.userMessage.username;
    },
    async onSubmit() {
      let url = "/api/bo/addBo";
      let postData = {
        // id:this.id;
        boName:this.boName,
        boDate:this.value,
        boEditor:this.boEditor,
        boDiscover:this.boDiscover,
        boResponsible:this.boResponsible,
        boStatus:this.radio,
        businessOpporitunityFlag:this.switchChecked,
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('商机提交成功');
        this.toBoList();
      }
      else
        Toast('商机提交失败,错误码' + result.code);
    },
    toBoList(){
      this.$router.push('/bizOppList');
    },
    // 时间-时间录入处理
    boDateConfirm(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      this.boDate = y + "-" + m + "-" + d;
      this.boDateShow = false;
      Toast(this.boDate);
    },
    boExpectDateConfirm(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      this.boExpectDate = y + "-" + m + "-" + d;
      this.boExpectDateShow = false;
      Toast(this.boExpectDate);
    }
  },
}
</script>

<style lang="less" scoped>

.van-field {
  padding-top: 20px;
}

.submit {
  width:90%;
}
</style>

