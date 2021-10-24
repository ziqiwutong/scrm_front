<template>
<div class="orderList_container">
<!--以下为搜索栏-->
 <div class="surf">
   <form action="/">
     <van-search
       v-model="value"
       shape="round"
       background="#e9e9e9"
       show-action
       placeholder="请输入搜索关键词"
       @search="onSearch"
       @cancel="onCancel"
     />
   </form>
 </div>
<!--  以下为标签页切换  -->
  <div class="orderList_tab">
    <van-tabs class="vant-tab-wrap" type="card"  color="#5252cc"  v-model="active" animated>
      <van-tab  title="全部" >
        <div class="content1">内容1</div>
      </van-tab>
      <van-tab  title="待付款">
        <div></div>
      </van-tab>
      <van-tab title="交易成功">
        <div>内容3</div>
      </van-tab>
    </van-tabs>
  </div>

  <TabBar/>
</div>
</template>

<script>
import TabBar from "@/components/component/TabBar";
import { Toast } from 'vant';
export default {
  name: "orderList",
  components: {
    methods: {
      onSearch(val) {
        Toast(val);
      },
      onCancel() {
        Toast('取消');
      },
    },
    TabBar
  }


}
</script>

<style lang="less" scoped>
.orderList_container{
  height:100%;
  background-color: #e9e9e9;
}
.orderList_tab{
  height: 100%;
}
/deep/ .vant-tab-wrap{
  height: 100%;
.van-tabs__wrap{
  width: 65%;
}

}

</style>
