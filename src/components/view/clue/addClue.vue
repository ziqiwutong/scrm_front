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
        v-model="cluename"
        name="线索名称"
        label="线索名称"
        placeholder="线索名称"
        :rules="[{ required: true, message: '请填写线索名称' }]"
      />
      <van-field
        v-model="cluedate"
        type="cluedate"
        name="线索时间"
        label="线索时间"
        placeholder="线索时间"
        :rules="[{ required: true, message: '请填写线索时间' }]"
      />
      <van-field name="radio" label="线索状态" label-width="4em">
        <template #input>
          <van-radio-group v-model="radio" direction="horizontal">
            <van-radio name="1">新线索</van-radio>
            <van-radio name="2">跟进中</van-radio>
            <van-radio name="3">转换为商机</van-radio>
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
      />
      <van-field
        v-model="clueDiscover"
        type="clueDiscover"
        name="线索发现人"
        label="线索发现人"
        placeholder="线索发现人"
        :rules="[{ required: true, message: '请填写线索线索发现人' }]"
      />
      <van-field
        v-model="clueResponsible"
        type="clueResponsible"
        name="线索责任人"
        label="线索责任人"
        placeholder="线索责任人"
        :rules="[{ required: true, message: '请填写线索线索责任人' }]"
      />
      <van-field name="switch" label="是否转换成商机" label-width="7em">
        <template #input>
          <van-switch v-model="switchChecked" size="20" />
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

import { Toast } from 'vant';

<script>
export default {
  name: "addClue",
  data() {
    return {
      cluename: '',
      cluedate: '',
      clueEditor:'',
      clueDiscover:'',
      clueResponsible:'',
      //线索状态单选框
      radio: '1',
      //转换成商机按钮
      switchChecked: false,
    };
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values);
    },
    toClueList(){
      this.$router.push('/clueList');
    }
  },
}
</script>

<style lang="less" scoped>
.addclue {
  position: absolute;
  top:50px;
}
</style>
