<template>
  <!--底部标题栏-->
  <van-tabbar v-model="active" active-color="#4876f1">
    <van-tabbar-item :icon="tabBarIcon[0].imgUrl" icon-prefix="icon-third" @click="toHome">首页</van-tabbar-item>
    <van-tabbar-item :icon="tabBarIcon[1].imgUrl" icon-prefix="icon-third" @click="toCustomer">客户</van-tabbar-item>
    <van-tabbar-item :icon="tabBarIcon[2].imgUrl" icon-prefix="icon-third" @click="toApplication">应用</van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "TabBar",
  data(){
    return{
      active:0,
      tabBarIcon:[
        {imgUrl:"home"},
        {imgUrl:"kehu"},
        {imgUrl:"application"}
      ]
    }
  },
  created() {
    this.active = this.$store.state.tabBarActive;
  },
  methods:{
    toHome(){
      this.$router.push("/home")
    },
    toCustomer(){
      this.$router.push("/customer")
    },
    toApplication(){
      this.$router.push("/contextShareList")
    }
  }
}
</script>

<style lang="less" scoped>
.van-tabbar{
  border-top: 1px solid #f7f8fa;
  z-index: 100;
}
</style>
