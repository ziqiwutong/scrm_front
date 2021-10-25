<template>
  <!-- Field 是基于 Cell 实现的，可以使用 CellGroup 作为容器来提供外边框。 -->
  <div class="searchRelationship_container">
    <NavBar/>
    <p class="tip">请输入双方关系</p>
    <div class="search1">
      <van-cell-group>
        <van-field v-model="value" label="图标" placeholder="请输入您想要检索的客户/公司"/>
      </van-cell-group>
    </div>
    <div class="search2">
      <van-cell-group>
        <van-field v-model="value" label="图标" placeholder="请输入您想要检索的客户/公司"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import NavBar from "../../component/NavBar";

export default {
  name: "searchRelationship",
  components: {NavBar}
}
</script>

<style lang="less" scoped>
.tip {
  padding-top: 330px;
  padding-left: 10px;
  font-size: 14px;
}
.search1 {
  padding-top: 10px;
}

.search2 {
  padding-top: 10px;
}
</style>
