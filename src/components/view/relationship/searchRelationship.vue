<template>
  <!-- Field 是基于 Cell 实现的，可以使用 CellGroup 作为容器来提供外边框。 -->
  <div class="searchRelationship_container">
    <NavBar/>
    <div class="company_logo_block">
      <img class="company_logo" src="./company_logo.png">
    </div>

    <p class="tip">请输入双方关系</p>

    <div class="search1">
      <div class="search1_left">
        <van-icon class-prefix="icon-third" name="person"/>
      </div>
      <div class="search1_right">
        <van-field v-model="value1" placeholder="请输入您想要检索的客户/公司"/>
      </div>
    </div>

    <div class="search2">
      <div class="search2_left">
        <van-icon class-prefix="icon-third" name="person"/>
      </div>
      <div class="search2_right">
        <van-field v-model="value2" placeholder="请输入您想要检索的客户/公司"/>
      </div>
    </div>

    <div class="search_button_block">
      <van-button
        class="search_button"
        round
        type="info"
        @click="sendSearchMessage">
        查询关系
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
          searchData1: '123',
          searchData2: 'htt'
        }
      });
    },
  }
}

</script>

<style lang="less" scoped>
.company_logo_block {
  padding-top: 300px;
  width: 100vw;
  height: 60px;
  position: relative;

  .company_logo {
    position: absolute;
    width: 220px;
    height: 80px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}

.tip {
  padding-left: 60px;
  font-weight: bolder;
}

.search1 {
  padding-top: 20px;
  height: 40px;
  .search1_left {
    width: 5%;
    float: left;
    padding-top: 12px;
    padding-bottom: 10px;
    padding-left: 60px;
  }

  .search1_right {
    width: 60%;
    float: left;
  }
}

.search2 {
  padding-top: 20px;
  height: 40px;
  .search2_left {
    width: 5%;
    float: left;
    padding-top: 12px;
    padding-bottom: 10px;
    padding-left: 60px;
  }

  .search2_right {
    width: 60%;
    float: left;
  }
}

.search_button_block {
  margin-top: 60px;
  width: 100vw;
  height: 60px;
  position: absolute;

  .search_button {
    position: absolute;
    width: 180px;
    height: 50px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}

</style>
