<template>
  <!--顶部导航栏-->
  <div class="header">
    <div class="left">
      <div class="userImg">
        <img v-if="hasImg" :src="getUserImgUrl"/>
        <p class="imgText" v-else>{{ getUserImgUrl }}</p>
      </div>
    </div>
    <div class="center">
      <p>{{ getUserName }}</p>
      <p>{{ getUserCompany }}</p>
    </div>
    <div class="right">
      <van-icon name="phone" color="#1886fe" @click="makeCall"/>
      <p>打电话</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "BusinessCard",
  props: [
    "username",
    "userCompany",
    "userImgUrl",
    "userPhone"
  ],
  data() {
    return {
      hasImg: false,
    }
  },
  computed: {
    getUserName() {
      return this.username;
    },
    getUserCompany() {
      return this.userCompany;
    },
    getUserPhone() {
      return this.userPhone;
    },
    getUserImgUrl() {
      let imgUrl;
      if (this.userImgUrl === '') {
        let lastWord = this.getUserName.slice(-1);
        imgUrl = lastWord;
      } else {
        imgUrl = this.userImgUrl
        this.hasImg = true;
      }
      return imgUrl
    }
  },
  methods: {
    makeCall() {
      window.location.href = 'tel:' + this.getUserPhone;
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 44px;
  left: 0;
  z-index: 2;
  height: 60px;
  width: 100%;
  display: inline-flex;
  background-color: #ffffff;
  border-bottom: 1px solid #fafafa;
  z-index: 99;
}

.imgText {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
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
  background-color: #4876f1;
  border: none;
  color: white;
  text-align: center;
  line-height: 40px;
}

.center {
  padding-top: 10px;
}

.center p {
  font-size: 13px;
  color: #5f6368;
  line-height: 20px;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
}

.right {
  position: absolute;
  right: 10px;
  top: 0px;
  padding-top: 10px;
  text-align: center;
}

.right p {
  font-size: 13px;
  color: #5f6368;
  line-height: 20px;
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
}

</style>
