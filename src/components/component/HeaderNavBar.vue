<template>
  <div class="header">
    <span class="returnIcon" @click="returnClick"></span>
    <span class="return" @click="returnClick">返回</span>
    <span>{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: "HeaderNavBar",
  props:[
    "title"
  ],
  methods:{
    returnClick(){
      this.$emit("returnClick");
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 44px;
  position: fixed;
  text-align: center;
  width: 100vw;
  top: 0px;
  background-color: white;
  z-index: 99;
}

.header span {
  line-height: 44px;
}

.return {
  position: absolute;
  top: 0px;
  left: 30px;
}

.returnIcon {
  position: absolute;
  top: 18px;
  left: 15px;
  border-top: 1px solid;
  border-right: 1px solid;
  width: 8px;
  height: 8px;
  border-color: #5f6368;
  transform: rotate(-135deg);
}
</style>
