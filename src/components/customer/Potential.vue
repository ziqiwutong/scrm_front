<template>
    <div>
        <van-search v-model="value" placeholder="请输入搜索关键词" />
         <div class="main">
      <van-grid clickable :column-num="3" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[0]" style="color:#ff8a5c;" :text="textArray[0]"
                       to="/customer"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[1]" style="color:#3585f9;" :text="textArray[1]"
                       to="potential"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[2]" style="color:#3585f9;" :text="textArray[2]"
                       to="potential"/>
      </van-grid>
      <van-grid clickable :column-num="3" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[3]" style="color:#1296db;" :text="textArray[3]"
                       url="/"/>
      </van-grid>
      <van-grid clickable :column-num="3" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[4]" style="color:#e2b127;" :text="textArray[4]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[5]" style="color:#e2b127;" :text="textArray[5]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[6]" style="color:#e2b127;" :text="textArray[6]"
                       url="/"/>               
      </van-grid>
       <van-grid clickable :column-num="3" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[4]" style="color:#e2b127;" :text="textArray[7]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[5]" style="color:#e2b127;" :text="textArray[8]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[6]" style="color:#e2b127;" :text="textArray[9]"
                       url="/"/>               
      </van-grid>
       <van-grid clickable :column-num="3" :border="false">
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[4]" style="color:#e2b127;" :text="textArray[10]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[5]" style="color:#e2b127;" :text="textArray[11]"
                       url="/"/>
        <van-grid-item icon-prefix="icon-third" :icon="iconArray[6]" style="color:#e2b127;" :text="textArray[12]"
                       url="/"/>               
      </van-grid>
    </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
       iconArray: [
        "customer",
        "potential",
        "company",
        "person",
        "relationship",
        "clue",
        "biz",
        "com",
        "share",
        "fenxiao",
        "product",
        "order"
      ],
      textArray: [
        "商会",
        "协会",
        "校友会",
        "微商",
        "企业",
        "事业单位",
        "政府",
        "电商平台",
        "酒吧服务",
        "百货零售",
        "超市零售",
        "酒类经销商",
        "酒庄"
      ],
    };
  },
};
</script>
<style lang="less" scoped>
.container {
  padding-top: 65px;
  background-color: #f6f6f6;
}

.main {
  margin: 5px 2% 5px 2%;
  padding: 2px;
  border-radius: 15px;
  border: 1px solid #f6f6f6;
}

</style>




