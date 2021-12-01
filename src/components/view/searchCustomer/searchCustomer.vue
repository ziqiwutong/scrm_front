<template>
  <!-- Field 是基于 Cell 实现的，可以使用 CellGroup 作为容器来提供外边框。 -->
  <div class="searchRelationship_container">
    <NavBar/>
    <div class="company_logo_block">
      <img class="company_logo" src="@/assets/icon/company_logo.png">
    </div>

    <div class="search1_block">
      <input class="search-input" :placeholder="searchTips" v-model="value" v-on:keyup.enter='sendSearchMessage'/>
    </div>

    <div class="search_button_block">
      <van-button
        class="search_button"
        round
        type="info"
        @click="sendSearchMessage">
        查&nbsp;&nbsp;询
      </van-button>
    </div>
    <TabBar/>
  </div>
</template>

<script>
import NavBar from "../../component/NavBar";
import TabBar from "../../component/TabBar";

export default {
  name: "searchCustomer",
  components: {
    NavBar,
    TabBar
  },
  data() {
    return {
      value: '',
      searchTips: '',
      type: 1
    };
  },
  created() {
    this.$store.commit('updateTabBarActive', 2);
    console.log(this.$route.params);
    if (this.$route.params.type === 1) {
      this.type = 1;
      this.searchTips = '请输入想要查询的企业名...';
    } else {
      this.type = 2;
      this.searchTips = '请输入想要查询的人名...';
    }
  },
  methods: {
    sendSearchMessage() {
      if (this.value.trim().length === 0) {
        this.$toast('查询内容不能为空！');
        return;
      }
      this.$router.push({
        name: 'searchList',
        query: {
          searchMessage: this.value,
          type: this.type
        }
      });
    },
  }
}

</script>

<style lang="less" scoped>
.company_logo_block {
  padding-top: 140px;
  padding-bottom: 60px;
  width: 100vw;
  height: 100px;
  position: relative;

  .company_logo {
    position: absolute;
    width: 220px;
    height: 80px;
    left: 0;
    right: 0;
    margin: auto;
  }
}

.tip {
  width: 60vw;
  font-weight: bolder;
  font-size: small;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}

.search1_block {
  padding-top: 20px;
  height: 40px;
  width: 80%;
  margin-left: 10%;

  .search-input {
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    border: 1px solid #3333cc;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 5px;
  }
}


.search_button_block {
  position: relative;
  padding-top: 80px;
  height: 60px;

  .search_button {
    position: absolute;
    width: 80vw;
    height: 46px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
}

/deep/ .van-button--info {
  color: #fff;
  background-color: #3333cc;
  border: 1px solid #3333cc;
}

/deep/ .van-button--round {
  border-radius: 6px;
}

</style>
