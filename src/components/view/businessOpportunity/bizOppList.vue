<template>
  <div>
    <!-- 导航栏 -->
    <van-row class="header">
      <!-- 导航-商机类型筛选-->
      <div>
        <van-col span="6">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item
              v-model="boVal"
              :options="boOpt"
              @change="onOrderList(boVal)"
            />
          </van-dropdown-menu>
        </van-col>
      </div>
      <!-- 导航-搜索 -->
      <form action="/">
        <van-search
          v-if="!isSearch"
          v-model="searchVal"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onSearchCancel"
          class="search-box"
        />
      </form>
      <!-- 导航-搜索-搜索图标 -->
      <van-col class="search-button" span="2" offset="18" v-if="isSearch">
        <van-icon name="search" size="25" @click="toSearch"/>
      </van-col>
      <!-- 导航-分割线 -->
      <van-col class="separate" v-if="isSearch">|</van-col>
      <!-- 导航-新建 -->
      <van-col class="add-button" span="2" v-if="isSearch">
        <van-icon name="plus" size="25" @click="toAdd"/>
      </van-col>
      <div class="divider"></div>
    </van-row>

    <!--线索表单区域-->
    <div class="list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :title="item.id" :key="i"
                        class="van_swipe_cell">
          <van-row class="van_row1" @click="toBoDetail(item)" type="flex" justify="space-between">
            <van-col span="12" class="boName">
              <div class="van-ellipsis">{{ item.boName }}</div>
            </van-col>
            <van-col span="8" offset="4" class="boDate">{{ item.boDate }}</van-col>
          </van-row>
          <van-row class="van_row2" @click="toBoDetail(item)">
            <van-col span="10" class="boStatus"> 商机状态：
              <van-tag :class="item.statusClass">{{ item.boStatus }}</van-tag>
            </van-col>
            <van-col span="8" offset="6" class="boEditor"> 录入人：{{ item.boEditor }}</van-col>
          </van-row>
          <!-- 滑动删除按钮 -->
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button"/>
          </template>
        </van-swipe-cell>
      </van-list>
    </div>
    <TabBar/>
  </div>
</template>

<script>
import TabBar from "../../component/TabBar";
import qs from 'qs'
import {Toast} from "vant";
import {getUrl} from "../../../utils/replaceUrl";
import customer from "../../customer/customer";
// axios参数包
export default {
  name: 'bizOppList',
  components: {
    TabBar
  },
  data() {
    return {
      components: {
        TabBar
      },
      // 导航-商机类型-选择值
      boVal: 0,
      // 导航-商机类型-数组
      boOpt: [
        {text: "全部商机", value: 0},
        {text: "新商机", value: 1},
        {text: "跟进中", value: 2},
        {text: "已结束", value: 3},
      ],
      // 用户输入的搜索字符串
      searchVal: '',
      // 搜索-搜索图标展示（同时绑定新建和分割线的显示）
      isSearch: true,
      list: [],    //以下三个是list参数

      loading: false,
      finished: false,
      searchShow: false,
      pageProps: {
        pageCount: 8,
        currentPage: 1,
      },
      temp: [
        {id: ""},
        {customerName: ""}
      ],
      boStatus: "all",
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    //商机分类选择
    onOrderList(boVal) {
      if (boVal === 0) this.boStatus = "all";
      else if (boVal === 1) this.boStatus = "new";
      else if (boVal === 2) this.boStatus = "follow";
      else if (boVal === 3) this.boStatus = "end";
      this.refreshList();
    },

    //放大镜和加号图标隐藏
    toSearch() {
      this.isSearch = !this.isSearch;
    },

    //取消搜索后显示放大镜和加号
    onSearchCancel() {
      this.isSearch = !this.isSearch;
    },

    //跳转到 新建商机 页面
    toAdd() {
      this.$router.push({
        name: "addBizOpp",
        query: {
          id: "",
          customerName: ""
        }
      });
    },

    //是否在搜索框输入内容
    ifShowSearch() {
      this.searchShow = true;
    },


    /*
    列表部分的函数
     */

    //加载列表中的数据
    async onLoad() {
      let url = JSON.parse(getUrl()).bizOppManager.queryBo;
      let getData = {
        pageCount: this.pageProps.pageCount,
        currentPage: this.pageProps.currentPage++,
        boStatus: this.boStatus,
      }
      const result = (await this.$http.get(url, {params: getData})).data.data

      //请求失败处理
      if (result.length === 0) {
        // 已加载全部数据
        this.finished = true;
      }

      //处理数据，根据boStatus填入statusClass，用于改变css样式，范围为newStatus，followedStatus，finishedStatus
      for (let i = 0; i < result.length; i++) {
        let array = result[i];
        if (array.boStatus === '新商机') {
          array.statusClass = "newStatus";
        } else if (array.boStatus === '跟进中') {
          array.statusClass = "followedStatus";
        } else if (array.boStatus === '已结束') {
          array.statusClass = "finishedStatus";
        }
        //只取createTime时间变量中年月日部分展示
        array.boDate = array.createTime.split(" ")[0];
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = false;
    },


    //重新加载商机列表
    refreshList() {
      this.pageProps.currentPage=1;
      this.list = [];
      this.onLoad();
    },


    //关键字搜索
    async onSearch() {
      let url = JSON.parse(getUrl()).bizOppManager.queryBoByKey;
      this.pageProps.currentPage = 1;
      let getData = {
        keySearch: this.searchVal
      }
      this.list = [];
      const result = (await this.$http.get(url, {params: getData})).data.data
      for (let i = 0; i < result.length; i++) {
        let array = result[i];
        if (array.boStatus === '新商机') {
          array.statusClass = "newStatus";
        } else if (array.boStatus === '跟进中') {
          array.statusClass = "followedStatus";
        } else if (array.boStatus === '已结束') {
          array.statusClass = "finishedStatus";
        }
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = false;
    },

    //swipe-cell右侧滑动删除按钮的点击事件
    async beforeClose({position, instance}) {
      switch (position) {
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
          this.$dialog.confirm({
            confirmButtonColor: '#5252cc',
            message: '确定删除吗？'
          }).then(() => {
            instance.close();
            this.deleteBo(instance.$attrs.title);//此处需要刷新页面
          });
          break;
      }
    },

    //根据id删除对应的商机
    async deleteBo(id) {
      let url = JSON.parse(getUrl()).bizOppManager.deleteBo;
      let postData = {
        id: id,
      }
      const result = (await this.$http.get(url, qs.stringify(postData))).data;
      if (result.code === 200) {
        Toast('商机删除成功');
        this.refreshList();
      } else
        Toast('商机删除失败,错误码' + result.code);
    },

    // 跳转至商机详情页
    toBoDetail(item) {
      // 带着id去请求商机详情页
      this.$router.push({
        name: 'bizOppDetail',
        query: {
          boId: item.id,
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 99;
}

// 商机下拉选择框样式
/deep/ .van-dropdown-menu__bar {

  box-shadow: 0 0 0 rgb(0, 0, 0);
}

/deep/ .van-dropdown-menu__title {
  color: #1e1c27;
  font-size: 15px;
}

//搜索框
.search-button {
  margin: 8px 2% 5px 45%;
  padding: 2px;
}

.search-box {
  height: 48px;
}

//分割线
.separate {
  margin: 12px 2% 5px 1%;
  opacity: 0.5;
}

//添加按钮
.add-button {
  margin: 8px 2% 5px 2%;
  padding: 2px;
}

/*
一条灰色的装饰分割线
*/
.divider {
  position: relative;
  top: 11vw;
  background: #f8f8f8;
  height: 2vw;
}

.list {
  margin-top: 17vw;
}

.boDate {
  font-size: 13px;
  color: #6E6F74;
}

.boStatus {
  font-size: 13px;
  color: #6E6F74;
}

.boEditor {
  font-size: 13px;
  color: #6E6F74;
}

.boName {
  font-size: 15px;
  color: #333333;
}

.van_row1 {
  margin-bottom: 10px;
}

.van_row2 {

  margin-bottom: 2px;
}

.van_swipe_cell {
  height: 50pt;
  width: 90%;
  left: 5%;
  margin-bottom: 5px;
  border-bottom: 1px solid #f7f8fa;
}

.newStatus {
  color: #32B710;
  background-color: #E7F7E3;
}

.followedStatus {
  color: #EE6F2D;
  background-color: #F9CE9E;
}

.finishedStatus {
  color: #888888;
  background-color: #eeefee;
}

</style>

