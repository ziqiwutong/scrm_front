<template>
  <div >
    <!-- 导航栏 -->
    <van-row>
      <!-- 导航-客户类型筛选-->
      <div>
        <van-col span="8">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item
              v-model="cusVal"
              :options="cusOpt"
              @change="onOrderList(cusVal)"
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
          class="schbox"
        />
      </form>
      <!-- 导航-搜索-搜索图标 -->
      <van-col class="schbtn" span="2" offset="12" v-if="isSearch"
      ><van-icon name="search" size="30" @click="toSearch"
      /></van-col>
      <!-- 导航-分割线 -->
      <van-col class="separate" v-if="isSearch">|</van-col>
      <!-- 导航-新建 -->
      <van-col class="addbtn" span="2" v-if="isSearch"
      ><van-icon name="plus" size="30" @click="toAdd" />
      </van-col>
    </van-row>
    <!-- 标签栏 -->
    <van-row>
      <van-tabbar v-model="barAct" :fixed="false">
        <!-- 最近浏览 -->
        <van-tabbar-item class="navopt" @click="sortPop">
          <van-icon
            :name="cus_new"
            :class="barAct == 0 ? 'colorful' : ''"
          />最近浏览
        </van-tabbar-item>
        <!-- 筛选 -->
        <van-tabbar-item class="navopt" @click="toScreen"
        ><van-icon
          :name="cus_scr"
          :class="barAct == 1 ? 'colorful' : ''"
        />筛选</van-tabbar-item
        >
        <!-- 多选 -->
        <van-tabbar-item class="navopt" @click="toCheckbox"
        ><van-icon
          :name="cus_chc"
          :class="barAct == 2 ? 'colorful' : ''"
        />多选</van-tabbar-item
        >
      </van-tabbar>
    </van-row>
    <!--线索表单区域-->
    <div class="list" >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :key="i"  class="van_swipe_cell">
          <van-row class="van_row" @click="toCLueDetail(item.id)" type="flex" justify="space-between" >
            <van-col span="12" class="clueName"><div class="van-ellipsis" >{{item.clueName}}</div></van-col>
            <van-col span="8" offset="4" class="clueDate">{{item.clueDate}}</van-col>
          </van-row>
          <van-row  @click="toCLueDetail(item.id)" >
            <van-col span="10" class="clueStatus">     线索状态：<van-tag  :class="item.statusClass">{{item.clueStatus}}</van-tag></van-col>
            <van-col span="8" offset="6" class="clueEditor">     录入人：{{item.clueEditor}}</van-col>
          </van-row>
          <!-- 滑动删除 -->
          <template #right>
            <van-button square text="删除" type="danger" class="delete-button" />
          </template>
        </van-swipe-cell>
      </van-list>
    </div>
    <TabBar/>
    <!-- 筛选内容 -->
    <van-popup v-model="scrShow" closeable position="right" class="scrpop">
      <van-row>
        <p class="scrname">跟进人</p>
      </van-row>
    </van-popup>
  </div>
</template>

<script>
import TabBar from "../../component/TabBar";
import qs from 'qs'// axios参数包
export  default  {
  components: {
    TabBar
  },
  data() {
    return {
      components: {
        TabBar
      },
      // 导航-客户类型-选择值
      cusVal: 0,
      // 导航-客户类型-数组
      cusOpt: [
        { text: "全部客户", value: 0 },
        { text: "待分配客户", value: 1 },
        { text: "跟进中客户", value: 2 },
      ],
      // 搜索-搜索内容
      searchVal: "",
      // 搜索-搜索图标展示（同时绑定新建和分割线的显示）
      isSearch: true,
      searchValue: '',
      list: [],    //以下三个是list参数
      //error: false,
      loading: false,
      finished: false,
      searchShow: false,
      pageProps: {
        pageCount: 1,
        currentPage: 10
      },
      value1: 0,
      show:false,
      // 筛选-跟进人列表是否被选取
      ifChoose: true,
      // 多选-界面弹出层
      cheShow: false,
      // 多选-多选选取的标识符信息
      result: [],
      // 标签栏-绑定标识符
      barAct: 0,
      // 图标
      cus_new: require("../../../assets/cusicon/cus_new.png"),
      cus_scr: require("../../../assets/cusicon/cus_scr.png"),
      cus_chc: require("../../../assets/cusicon/cus_ckc.png"),
      // 筛选-弹出层界面
      scrShow: false,
    };
  },
  methods: {
    //orderList客户分类选择
    onOrderList(cusVal) {
      if (cusVal == 0) this.cusClass = "全部客户";
      else if (cusVal == 1) this.cusClass = "待分配客户";
      else if (cusVal == 2) this.cusClass = "跟进中客户";
      console.log(this.cusClass);
      console.log(this.listOrder);
    },
    // 客户列表-搜索功能-取消
    onSearchCancel() {
      this.isSearch = !this.isSearch;
    },
    // 客户列表-搜索功能展示
    toSearch() {
      this.isSearch = !this.isSearch;
    },
    // 新建客户-新建客户弹出框
    toAdd() {
      this.addShow = true;
      this.$router.push('/addClue');
    },
    // 最近浏览-最近浏览弹出框
    sortPop() {
      this.sortShow = !this.sortShow;
    },
    // 筛选-筛选功能弹出框
    toScreen() {
      this.scrShow = !this.scrShow;
    },

    // 多选-多选功能弹出框
    toCheckbox() {
      this.cheShow = !this.cheShow;
    },
    // 是否在搜索框输入内容
    ifShowSearch() {
      this.searchShow = true;
    },
    // 关键字搜索
    async onSearch() {
      let url = "/api/clue/queryClue";
      let postData = {
        keySearch: this.searchValue
      }
      this.list = [];
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
      console.log("jello")
      console.log(result)
      // 加载状态结束
      this.loading = false;
    },
    async onLoad() {
      let url = "/api/clue/queryClue";
      let postData = {
        pageCount: this.pageProps.pageCount++,
        currentPage: this.pageProps.currentPage,
        active:this.active
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      if (result.length == 0) {
        // 已加载全部数据
        this.finished = true;
        Toast('已加载全部数据！');
      }
      for (let i = 0; i < result.length; i++) {
        let array = result[i];
        if(array.clueStatus == '新线索'){
          array.statusClass = "newStatus";
        }else if(array.clueStatus == '跟进中'){
          array.statusClass = "followedStatus";
        }else if(array.clueStatus == '转换为商机'){
          array.statusClass = "toBizOppStatus";
        }
        this.list.push(result[i]);
      }
      console.log(this.list);
      // 加载状态结束
      this.loading = false;
    },
    async  beforeClose({ position, instance }) {
      switch (position) {
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
          this.$dialog.confirm({
            message: '确定删除吗？',
          }).then(() => {
            instance.close();
            //
            // let url = "/api/deleteClue";
            // let postData = {
            //
            // }
            // const result = (await this.$http.post(url, qs.stringify(postData))).data
            //
            // if(result.code === 200) {
            //   Toast('订单创建成功');
            //   this.$router.push('orderList');
            // }
            // else
            //   Toast('订单创建失败,错误码' + result.code);
          });
          break;
      }
    },
    onDetail() {
    },
    // 跳转至线索详情页
    toCLueDetail(id) {
      // 带着id去请求线索详情页
      this.$router.push('/clueDetail');
    },
    // 跳转至新建线索页
    toAddClue(){
      this.$router.push('/addClue');
    },


  }
}
</script>

<style lang="less" scoped>
.clue_container {
  height:100%;
}
.cusDroMnu {
  background: #aa361a;
}
// 全部客户
/deep/.van-dropdown-menu__title {
  color: #1e1c27;
  font-size: 13px;
}
//搜索框
.schbtn {
  margin: 5px 2% 5px 140px;
  padding: 2px;
}
.schbox {
  height: 48px;
}
//分割线
.separate {
  margin: 10px 2% 5px 2%;
  opacity: 0.5;
}
//添加按钮
.addbtn {
  margin: 5px 2% 5px 2%;
  padding: 2px;
}
//最近浏览-选项
.navopt {
  margin: 5px 2% 10px 2%;
  padding: 0px;
  height: 30px;
  width: 95px;
  background-color: #f5f5f5;
}

.list {
  padding-top: 20px;
}
.clueDate {
  font-size: 13px;
  color: #6E6F74;
}
.clueStatus {
  font-size: 13px;
  color: #6E6F74;
}
.clueEditor {
  font-size: 13px;
  color: #6E6F74;
}
.cluefont span {
  background-color: #33cc33;
  padding: 0 7px;
}
.clueName {
  font-size: 14px;
  color: #333333;
}
.van_row {
  margin-bottom: 5px;
}
.van_swipe_cell {
  height: 50px;
  width: 90%;
  left: 5%;
  margin-bottom: 5px;
  border-bottom: 1px solid #f7f8fa;
}
.newStatus {
  color:#32B710;
  background-color:#E7F7E3;
}
.followedStatus {
  color:#EE6F2D ;
  background-color:#F9CE9E;
}
.toBizOppStatus {
  color:#1047D9 ;
  background-color:#C1D1FC;
}
// 标签栏颜色改变
.colorful {
  filter: invert(43%) sepia(65%) saturate(2735%) hue-rotate(208deg)
  brightness(97%) contrast(95%);
}
</style>
