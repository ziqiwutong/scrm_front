<template>
  <!--顶部导航栏-->
  <div class="header">
    <div class="left">
      <div class="userImg">
        {{ userImgUrl }}
      </div>
    </div>
    <div class="center">
      <p>{{ username }}</p>
      <p>{{ userCompany }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      username: '',
      userCompany: '',
      userImgUrl: ''
    }
  },
  created: function () {
    this.getUserMessage();
  },
  methods: {
    async getUserMessage() {
      // 当vuex中没有用户信息时才去请求，减少网络请求的次数
      if (this.$store.state.userMessage.username == "") {
        let url = "/api/doLogin";
        const result = (await this.$http.get(url)).data.data
        this.username = result.username;
        this.userCompany = result.userCompany;
        this.userImgUrl = result.userImgUrl;
        this.$store.commit("updateUserMessage", result);
      } else {
        this.username = this.$store.state.userMessage.username
        this.userCompany = this.$store.state.userMessage.userCompany
        this.userImgUrl = this.$store.state.userMessage.userImgUrl
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #3333cc;
  height: 60px;
  width: 100%;
  display: inline-flex;
}

.left {
  width: 60px;
  position: relative;
}

.userImg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  background-color: #6600ff;
  color: white;
  text-align: center;
  line-height: 40px;
}

.center {
  padding-top: 10px;
}

.center p {
  font-size: 13px;
  color: white;
  line-height: 20px;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
}

</style>
