<template>
  <!--顶部导航栏-->
  <div class="header">
    <div class="left">
      <div class="userImg">
        <img v-if="hasImg" :src="userImgUrl"/>
        <p v-else="!hasImg">{{ userImgUrl }}</p>
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
      userImgUrl: '',
      hasImg: false,
    }

  },
  mounted() {
    let timer = setInterval(() => {
      if (this.username === '') {
        this.getUserMessage();
      } else {
        clearInterval(timer);
      }
    }, 500);
    this.getUserMessage();
  },
  methods: {
    getUserMessage() {
      // 理论上用户信息应该从vuex里获取，首页已经获取用户信息并将其存入vuex中了的，只不过和用户的还没有打通，所以暂时测不了
      this.username = this.$store.state.userMessage.username
      this.userCompany = this.$store.state.userMessage.userCompany
      this.userImgUrl = this.$store.state.userMessage.userImgUrl
      // 根据返回数据是否有头像决定头像模块显示什么
      if (this.userImgUrl == "") {
        let lastWord = this.username.slice(-1);
        this.userImgUrl = lastWord;
      } else {
        this.hasImg = true;
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

.userImg, img {
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

.userImg p {
  margin-block-start: 0em;
  margin-block-end: 0em;
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
