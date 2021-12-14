<template>
  <div class="container">
    <HeaderNavBar :title="navTitle" @returnClick="returnClick"/>
    <div class="avator">
      <label>头像</label>
      <div class="userImg">
        <img v-if="hasImg" :src="userImgUrl"/>
        <p v-else="!hasImg">{{ userImgUrl }}</p>
      </div>
    </div>
    <van-cell-group class="userList">
      <van-field label="用户名" :value="userName" readonly/>
      <van-field label="公司" :value="userCompany" readonly/>
      <van-field label="联系电话" :value="userPhone" readonly/>
      <van-field label="性别" :value="sex" readonly/>
      <van-field label="邮箱" :value="email" readonly/>
      <van-field label="职位" :value="duty" readonly/>
      <van-field label="部门" :value="deptName" readonly/>
    </van-cell-group>
    <div class="middleDiv"></div>
    <div class="editArea">
      <label>第三方账号</label>
      <label>可编辑</label>
    </div>
    <van-cell-group>
      <van-field autofocus="true" label="微盟ID" v-model="wmId"/>
    </van-cell-group>
    <div class='submitDiv'>
      <van-button  type="primary" block color="#4876f1" @click="submitMsg">提交</van-button>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../component/HeaderNavBar";
import {getUrl} from "../../../utils/replaceUrl";

export default {
  name: "userInfo",
  components: {HeaderNavBar},
  data() {
    return {
      navTitle: '个人中心',
      userName: this.$store.state.userMessage.username,
      userImgUrl: this.$store.state.userMessage.userImgUrl,
      userCompany: this.$store.state.userMessage.userCompany,
      userPhone: this.$store.state.userMessage.userPhone,
      email: this.$store.state.userMessage.email,
      sex: this.$store.state.userMessage.sex,
      duty: this.$store.state.userMessage.duty,
      deptName: this.$store.state.userMessage.deptName,
      wmId: this.$store.state.userMessage.wmId,
      hasImg: false,
    }
  },
  mounted() {
    // 根据返回数据是否有头像决定头像模块显示什么
    if (this.userImgUrl == "") {
      let lastWord = this.userName.slice(-1);
      this.userImgUrl = lastWord;
    } else {
      this.hasImg = true;
    }
  },
  methods: {
    returnClick() {
      this.$router.push('/home');
    },
    async submitMsg() {
      let url = JSON.parse(getUrl()).userInfo.saveAppendInfo;
      let postData = {
        id: this.$store.state.userMessage.userId,
        weimobId: this.wmId
      }
      const result = (await this.$http.post(url, postData)).data
      if (result.code === 200) {
        this.$store.commit('updateWmId', this.wmId);
        this.$toast('修改成功！');
        this.$router.push('/home');
      } else {
        this.$toast('修改失败，请再次尝试！');
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  overflow: auto;
}

.avator {
  width: 100vw;
  margin-top: 50px;
  display: inline-flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 10px;

  label {
    line-height: 40px;
  }
}

.userImg {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #4876f1;
  text-align: center;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.userImg p {
  color: white;
  line-height: 40px;
  font-size: 1.2rem;
  margin-block-start: 0em;
  margin-block-end: 0em;
}

.middleDiv {
  background-color: #fafafa;
  height: 10px;
  width: 100vw;
}

.editArea {
  width: 100vw;
  padding: 10px;
  display: inline-flex;
  box-sizing: border-box;
  justify-content: space-between;
  border-bottom: 1px solid #fafafa;
}

.submitDiv{
  margin-top: 10vh;
  box-sizing: border-box;
  width: 100vw;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
