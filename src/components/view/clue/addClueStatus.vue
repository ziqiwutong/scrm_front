<template>
  <div>
    <div class="navbar"  @click="toClueDetail">
      <van-nav-bar
        title="新建线索更新"
        left-text="返回"
        left-arrow
      />
    </div>
    <van-form @submit="onSubmit"  class="addClueStatus">
      <van-field
        v-model="clueNotes"
        name="线索更新记录"
        label="线索更新记录"
        placeholder="线索更新记录"
        :rules="[{ required: true, message: '线索更新记录' }]"
      />
      <van-field
        v-model="clueEditor"
        type="clueEditor"
        name="更新录入人"
        label="更新录入人"
        placeholder="更新录入人"
        :rules="[{ required: true, message: '请填写更新录入人' }]"
      />
      <div style="margin: 16px;"  class="submit">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

import { Toast } from 'vant';

<script>
import {Toast} from "vant";

export default {
  name: "addClueStatus",
  data() {
    return {
      clueEditor:'',
      clueNotes: '',
      id:'',
    };
  },
  created() {
    this.clueId = this.$route.query.clueId;
  },
  methods: {
    async onSubmit() {
      let url = "/api/clue/addClueStatus";
      let postData = {
        clueId:this.$route.query.clueId,
        clueEditor:this.clueEditor,
        clueNotes:this.clueNotes,
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('线索更新提交成功');
        this.toClueDetail(this.id);
      }
      else
        Toast('线索更新提交失败,错误码' + result.code);
    },
    toClueDetail(){
      this.$router.push({
        path: '/clueDetail',
        query: {
          clueId:this.clueId,
        }
      });
    }
  },
}
</script>

<style lang="less" scoped>
.addClueStatus {
  position: absolute;
  top:50px;
}
.submit {
  position: absolute;
  top:100px;
  left:20px;
  width: 100%;
}
</style>
