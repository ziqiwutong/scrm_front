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
      <van-field
        v-model="boName"
        name="商机名称"
        label="商机名称"
        placeholder="商机名称"
        :rules="[{ required: true, message: '请填写商机名称' }]"
      />
      <van-field
        readonly
        clickable
        name="datetimePicker"
        :value="value"
        label="录入时间"
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
      <van-field name="radio" label="商机状态" label-width="6em">
        <template #input>
          <van-radio-group v-model="radio" direction="horizontal" class="boType">
            <van-radio name="新商机">新商机</van-radio>
            <van-radio name="跟进中">跟进中</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
        v-model="boEditor"
        type="boEditor"
        name="商机录入人"
        label="商机录入人"
        placeholder="商机录入人"
        :rules="[{ required: true, message: '请填写商机录入人' }]"
      />
      <van-field
        v-model="boDiscover"
        type="boDiscover"
        name="商机发现人"
        label="商机发现人"
        placeholder="商机发现人"
        :rules="[{ required: true, message: '请填写商机商机发现人' }]"
      />
      <van-field
        v-model="boResponsible"
        type="boResponsible"
        name="商机责任人"
        label="商机责任人"
        placeholder="商机责任人"
        :rules="[{ required: true, message: '请填写商机商机责任人' }]"
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

export default {
  name: "addBizOpp",
  data() {
    return {
      boName: '',
      boDate: '',
      boEditor:'',
      boDiscover:'',
      boResponsible:'',
      //商机状态单选框
      radio: '',
      value: '',
      dateShow: false,
      dateVal: '',
      // 时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 时间-时间最大值
      maxDate: new Date(2025, 10, 1),
    };
  },
  methods: {
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
.addBo {
  position: absolute;
  top:50px;
}

.boType {
  width:300px;
}
.submit {
  width:80%;
}
</style>

