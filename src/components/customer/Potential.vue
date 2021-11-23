<template>
  <div>
    <van-nav-bar title="潜在客户" />
    <div class="main">
      <van-grid clickable :column-num="3" :border="false" class="van-grid">
        <van-grid-item
          :icon="shangImg"
          style="color: #ff8a5c"
          :text="textArray[0]"
          @click="toProCusList(textArray[0])"
        />
        <van-grid-item
          :icon="XHImg"
          style="color: #3585f9"
          :text="textArray[1]"
           @click="toProCusList(textArray[1])"
        />
        <van-grid-item
          :icon="XYHImg"
          style="color: #3585f9"
          :text="textArray[2]"
           @click="toProCusList(textArray[2])"
        />
      </van-grid>
      <van-grid clickable :column-num="3" :border="false">
        <van-grid-item
          :icon="WSImg"
          style="color: #1296db"
          :text="textArray[3]"
           @click="toProCusList(textArray[3])"
        />
      </van-grid>

      <van-grid
        clickable
        :column-num="3"
        :border="false"
        class="van-grid-second"
      >
        <van-grid-item
          :icon="qyImg"
          style="color: #e2b127"
          :text="textArray[4]"
         @click="toProCusList(textArray[4])"
        />
        <van-grid-item
          :icon="sydwImg"
          style="color: #e2b127"
          :text="textArray[5]"
          @click="toProCusList(textArray[5])"
        />
        <van-grid-item
          :icon="zfImg"
          style="color: #e2b127"
          :text="textArray[6]"
           @click="toProCusList(textArray[6])"
        />
      </van-grid>

      <van-grid
        clickable
        :column-num="3"
        :border="false"
        class="van-grid-second"
      >
        <van-grid-item
          :icon="dsImg"
          style="color: #e2b127"
          :text="textArray[7]"
          @click="toProCusList(textArray[7])"
        />
        <van-grid-item
          :icon="jbfwImg"
          style="color: #e2b127"
          :text="textArray[8]"
           @click="toProCusList(textArray[8])"
        />
        <van-grid-item
          :icon="bhImg"
          style="color: #e2b127"
          :text="textArray[9]"
           @click="toProCusList(textArray[9])"
        />
      </van-grid>
      <van-grid clickable :column-num="3" :border="false">
        <van-grid-item
          :icon="csImg"
          style="color: #e2b127"
          :text="textArray[10]"
          @click="toProCusList(textArray[10])"
        />
        <van-grid-item
          :icon="glImg"
          style="color: #e2b127"
          :text="textArray[11]"
           @click="toProCusList(textArray[11])"
        />
        <van-grid-item
          :icon="jzImg"
          style="color: #e2b127"
          :text="textArray[12]"
           @click="toProCusList(textArray[12])"
        />
      </van-grid>
    </div>
    <div class="background"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      iconArray: [],
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
        "酒庄",
      ],

      shangImg: require("../../assets/pocusIcon/shang.png"),
      XHImg: require("../../assets/pocusIcon/XH.png"),
      XYHImg: require("../../assets/pocusIcon/XYH.png"),
      WSImg: require("../../assets/pocusIcon/WS.png"),
      qyImg: require("../../assets/pocusIcon/qy.png"),
      sydwImg: require("../../assets/pocusIcon/sydw.png"),
      zfImg: require("../../assets/pocusIcon/zf.png"),
      dsImg: require("../../assets/pocusIcon/ds.png"),
      jbfwImg: require("../../assets/pocusIcon/jbfw.png"),
      bhImg: require("../../assets/pocusIcon/bh.png"),
      csImg: require("../../assets/pocusIcon/cs.png"),
      glImg: require("../../assets/pocusIcon/jl.png"),
      jzImg: require("../../assets/pocusIcon/jz.png"),
    };
  },
  methods: {
    toProCusList(val) {
      // this.$router.push({ name: "perinfor", query: { cuslist: item } });
      console.log(val)
      this.$router.push({path:"/procustomer", query: { type: val } });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  padding-top: 65px;
  background-color: #f6f6f6;
}
.van-grid {
  background-color: #ffffff;
}
.van-grid-second {
  margin-top: 5%;
}
.main {
  // margin: 5px 2% 5px 2%;
  // padding: 2px;
  // border-radius: 15px;
  // border: 1px solid #f6f6f6;
  background-color: #f3f4f8;
  height: 100%;
}
.background {
  background-color: #f6f6f6;
  height: 300px;
}
</style>




