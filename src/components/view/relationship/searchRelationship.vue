<template>
  <!-- Field 是基于 Cell 实现的，可以使用 CellGroup 作为容器来提供外边框。 -->
  <div class="searchRelationship_container">
    <NavBar/>
    <div class="company-logo-block">
      <img class="company-logo" src="../../../assets/icon/company_logo.png">
    </div>

    <p class="tip">请输入查询双方公司全称</p>

    <div class="search-block">
      <el-autocomplete
        class="search"
        v-model="value1"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入您想要检索的公司全称"
        @input="onEditChange()"
        @select="handleSelect()">
        <i
          slot="prefix"
          class="icon-third-customer-relationship"
        />
      </el-autocomplete>
    </div>

    <div class="search-block">
      <el-autocomplete
        class="search"
        v-model="value2"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入您想要检索的公司全称"
        @input="onEditChange()"
        @select="handleSelect()">
        <i
          slot="prefix"
          class="icon-third-customer-relationship"
        />
      </el-autocomplete>
    </div>


    <div class="search-button-block">
      <van-button
        class="search-button"
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
import {getUrl} from "../../../utils/replaceUrl";
import Customer from "../../customer/procustomer";
import {Toast} from "vant";
import {debounce} from "../../../utils/debounce";

export default {
  name: "searchRelationship",
  components: {
    Customer,
    NavBar,
    TabBar
  },
  data() {
    return {
      value1: '',
      value2: '',

      ifEdit: false,

      //搜索自动补全防抖 储存计时器用的
      timer: '',

    };
  },

  created() {
    this.$store.commit('updateTabBarActive', 2);
  },

  methods: {
    sendSearchMessage() {
      if (this.value1 !== "" && this.value2 !== "") {
        this.$router.push({
          name:'relationshipDetail',
          query:{
            searchData1: this.value1,
            searchData2: this.value2
          }
        });
      } else {
        Toast("请正确输入查询公司信息");
      }
    },


    //搜索框模糊查询
    querySearchAsync(queryString, cb) {
      if (queryString !== "" && this.ifEdit === true) {
        //防抖
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(async () => {

          //执行的内容，向后端查询企业
          let callBackArr = []; // 准备一个空数组，此数组是最终返给输入框的数组

          //向服务器模糊查询关键字对应的企业列表
          let url = JSON.parse(getUrl()).searchCustomer.company;
          let getData = {
            keyword: queryString
          }
          const result = (await this.$http.get(url, {params: getData})).data.data
          console.log(result);

          if (result.length > 0) {
            if (result[0].length > 0) {
              callBackArr.push({"value": result[0].customerName});
            }

            if (result[1].length > 0) {
              let data = result[1];
              for (let i = 0; i < data.length; i++) {
                callBackArr.push({"value": data[i].name});
              }
            }
          } else {
            cb([{value: "暂无数据"}]);
          }

          cb(callBackArr)

        }, 1000)
      }
    },

    /*
    因为启信宝是按次数收费的，这里的两个函数和ifEdit变量是为了节省使用次数
    当用户输入内容改变时会使ifEdit变成true，“内容不为空” 且 “ifEdit为true”时才会模糊查询
    当用户选择时，输入内容会变化，如果没有ifEdit又会触发一次模糊查询，不仅用户体验不好，同时浪费了启信宝的次数
     */
    handleSelect() {
      this.ifEdit = false;
    },

    onEditChange() {
      this.ifEdit = true;
    }
  }
}

</script>

<style lang="less" scoped>
.company-logo-block {
  padding-top: 25vw;
  padding-bottom: 15vw;
  width: 100vw;
  height: 20vw;
  position: relative;

  .company-logo {
    position: absolute;
    width: 50vw;
    height: 20vw;
    left: 0;
    right: 0;
    margin: auto;
  }
}

.tip {
  width: 80vw;
  padding-left: 10vw;
  font-weight: bold;
  font-size: 18px;
}


.search-block {
  padding-top: 4vw;
  height: 10vw;
  display: inline-flex;

  .search {
    width: 80vw;
    border: none;
    padding-left: 10vw;

    i {
      font-size: 6vw;
    }

    /deep/ .el-input__prefix {
      top: 2vw;
    }

    /deep/ .el-input__inner {
      padding-left: 14vw;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #f2efef;
    }
  }
}

.search-button-block {
  position: relative;
  margin-top: 16vw;
  height: 15vw;


  .search-button {
    position: absolute;
    width: 86vw;
    height: 13vw;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    font-size: 16px;
  }
}

/deep/.van-button--info {
  color: #fff;
  background-color: #3333cc;
  border: 1px solid #3333cc;
}

</style>
