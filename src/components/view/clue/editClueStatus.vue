<template>
  <div class="clueEdit_container">
    <!--  navBar栏-->
    <van-nav-bar  class="nav-bar"
                  title="编辑线索更新"
                  left-text="返回"
                  left-arrow
                  fixed
                  @click-left="onClickLeft"

    />
    <!--  提交栏-->
    <div class="commit">
      <van-form>
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
        <!--提交-->
        <div class="submit">
          <van-button round size="normal" type="info" @click="Submit">提交更新</van-button>
        </div>
        <!--删除更新-->
        <div class="deleteUpdate">
          <van-button plain round size="normal" type="info" @click="clueDelete">删除更新</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import { Toast } from 'vant';
export default {
  name: "editClueStatus",
  data() {
    return {
      clueNotes: '',
      clueEditor:'',
    };
  },
  created () {
    this.test();
  },
  methods: {
    async test(){
      this.id=this.$route.query.id;
// 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。不需要写fun
      let url = "/api/clue/queryClueEditStatus";
      let postData = {
        id:this.id
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
      console.log(result);
      this.clueNotes=result.clueNotes;
      this.clueEditor=result.clueEditor;
      this.clueId=result.clueId;
    },
    async Submit() {
      let url = "/api/clue/editClueStatus";
      let postData = {
        clueId:this.clueId,
        id:this.id,
        clueNotes:this.clueNotes,
        clueEditor:this.clueEditor,
      }
      const result = (await this.$http.post(url, JSON.stringify(postData),{headers: {"Content-Type": "application/json" } })).data

      if(result.code === 200) {
        Toast('更新提交成功');
        this.onClickLeft(this.id);
      }
      else
        Toast('更新提交失败,错误码' + result.code);
    },
    async clueDelete() {
      let url = "/api/clue/deleteClueStatus";
      let postData = {
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
    onClickLeft(clueId) {
      this.$router.push({
        path: '/clueDetail',
        query: {
          clueId:this.clueId,
        }
      });
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
.submit {
  position: absolute;
  top: 200px;
  left: 40px;
}

.deleteUpdate {
  position: absolute;
  top: 200px;
  left: 250px;
}
</style>
