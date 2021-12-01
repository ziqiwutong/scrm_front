<template>
  <!-- Field 是基于 Cell 实现的，可以使用 CellGroup 作为容器来提供外边框。 -->
  <div class="searchRelationship_container">
    <NavBar/>
    <div class="company_logo_block">
      <img class="company_logo" src="../../../assets/company_logo.png">
    </div>

    <p class="tip">请输入双方关系</p>

    <div class="search1_block">
      <van-field
        class="search1"
        v-model="value1"
        left-icon="customer-relationship"
        placeholder="请输入您想要检索的客户/公司"
        border=border
      >
        <van-icon class-prefix="icon-third" slot="left-icon" name="customer-relationship"/>
      </van-field>
    </div>

    <div class="search2_block">
      <van-field
        class="search2"
        v-model="value2"
        left-icon="customer-relationship"
        placeholder="请输入您想要检索的客户/公司"
      >
        <van-icon class-prefix="icon-third" slot="left-icon" name="customer-relationship"/>
      </van-field>
    </div>

    <div class="search_button_block">
      <van-button
        class="search_button"
        round
        type="info"
        @click="sendSearchMessage">
        查询
      </van-button>
    </div>
    <TabBar/>
  </div>
</template>

<script>
import NavBar from "../../component/NavBar";
import TabBar from "../../component/TabBar";

export default {
  name: "searchRelationship",
  components: {
    NavBar,
    TabBar
  },
  data() {
    return {
      value1: '',
      value2: '',
    };
  },
  created() {
    this.$store.commit('updateTabBarActive', 2);
  },
  methods: {
    sendSearchMessage() {
      this.$router.push({
        name:'relationshipDetail',
        query:{
          searchData1: this.value1,
          searchData2: this.value2
        }
      });
    },
  }
}

</script>

<style lang="less" scoped>
.company_logo_block {
  padding-top: 32vw;
  padding-bottom: 20vw;
  width: 100vw;
  height: 20vw;
  position: relative;

  .company_logo {
    position: absolute;
    width: 64%;
    height: 32%;
    left: 0;
    right: 0;
    margin: auto;
  }
}

.tip {
  width: 60vw;
  font-weight: bolder;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.search1_block {
  padding-top: 4vw;
  height: 10vw;
  .search1 {
    width: 70vw;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-bottom: 1px solid grey;
  }
}

.search2_block {
  padding-top: 1vw;
  height: 10vw;
  .search2 {
    width: 70vw;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}

.search_button_block {
  position: relative;
  padding-top: 20vw;
  height: 15vw;

  .search_button {
    position: absolute;
    width: 64vw;
    height: 12vw;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}

</style>
