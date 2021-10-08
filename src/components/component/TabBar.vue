<template>
  <!--底部标题栏-->
  <van-tabbar v-model="active" active-color="#3333cc">
    <van-tabbar-item :icon="tabBarIcon[0].imgUrl" icon-prefix="icon-third">首页</van-tabbar-item>
    <van-tabbar-item :icon="tabBarIcon[1].imgUrl" icon-prefix="icon-third">客户</van-tabbar-item>
    <van-tabbar-item :icon="tabBarIcon[2].imgUrl" icon-prefix="icon-third">应用</van-tabbar-item>
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
}
</script>

<style lang="less" scoped>

</style>
