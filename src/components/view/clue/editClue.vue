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
        />

        <van-field
          v-model="clueDiscover"
          type="clueDiscover"
          name="线索发现人"
          label="线索发现人"
          placeholder="线索发现人"
          :rules="[{ required: true, message: '请填写线索发现人' }]"
        />

        <van-field
          v-model="clueResponsible"
          type="clueResponsible"
          name="线索责任人"
          label="线索责任人"
          placeholder="线索责任人"
          :rules="[{ required: true, message: '请填写线索责任人' }]"
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
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
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
</style>
