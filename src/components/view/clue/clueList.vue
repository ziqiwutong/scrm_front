<template>
  <div >
    <!-- 导航栏 -->
    <van-row>
      <!-- 导航-线索类型筛选-->
      <div>
        <van-col span="6">
          <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item
              v-model="clueVal"
              :options="clueOpt"
              @change="onOrderList(clueVal)"
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
      <van-col class="schbtn" span="2" offset="18" v-if="isSearch"
      ><van-icon name="search" size="25" @click="toSearch"
      /></van-col>
      <!-- 导航-分割线 -->
      <van-col class="separate" v-if="isSearch">|</van-col>
      <!-- 导航-新建 -->
      <van-col class="addbtn" span="2" v-if="isSearch"
      ><van-icon name="plus" size="25" @click="toAdd" />
      </van-col>
    </van-row>
    <!--线索表单区域-->
    <div class="list" >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-swipe-cell :before-close="beforeClose" v-for="(item,i) in list" :title="item.id" :key="i"  class="van_swipe_cell">
          <van-row class="van_row1" @click="toCLueDetail(item.id)" type="flex" justify="space-between" >
            <van-col span="12" class="clueName"><div class="van-ellipsis" >{{item.clueName}}</div></van-col>
            <van-col span="8" offset="4" class="clueDate">{{item.clueDate}}</van-col>
          </van-row>
          <van-row  class="van_row2" @click="toCLueDetail(item.id)" >
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
  </div>
</template>

<script>
import TabBar from "../../component/TabBar";
import qs from 'qs'
import {Toast} from "vant";
// axios参数包
export  default  {
  components: {
    TabBar
  },
  data() {
    return {
      components: {
        TabBar
      },
      clueId:'',
      // 导航-线索类型-选择值
      clueVal: 0,
      // 导航-线索类型-数组
      clueOpt: [
        { text: "全部线索", value: 0 },
        { text: "新线索", value: 1 },
        { text: "跟进中", value: 2 },
        { text: "已转换为商机", value: 3 },
      ],
      // 搜索-搜索内容
      searchVal: "",
      // 搜索-搜索图标展示（同时绑定新建和分割线的显示）
      isSearch: true,
      list: [],    //以下三个是list参数
      //error: false,
      loading: false,
      finished: false,
      searchShow: false,
      pageProps: {
        pageCount: 8,
        currentPage: 1,
      },
      value1: 0,
      show:false,
    };
  },
  methods: {
    //clueList线索分类选择
    onOrderList(clueVal) {
      if (clueVal == 0) this.clueClass = "全部线索";
      else if (clueVal == 1) this.clueClass = "新线索";
      else if (clueVal == 2) this.clueClass = "跟进中";
      else if (clueVal == 3) this.clueClass = "已转换为商机";
      console.log(this.clueClass);
      console.log(this.listOrder);
    },
    // 线索列表-搜索功能-取消
    onSearchCancel() {
      this.isSearch = !this.isSearch;
    },
    // 线索列表-搜索功能展示
    toSearch() {
      this.isSearch = !this.isSearch;
    },
    // 新建线索-新建线索弹出框
    toAdd() {
      this.addShow = true;
      this.$router.push('/addClue');
    },
    // 是否在搜索框输入内容
    ifShowSearch() {
      this.searchShow = true;
    },
    // 关键字搜索
    async onSearch() {
      let url = "/api/clue/queryClueByKey";
      let postData = {
        keySearch: this.searchVal
      }
      this.list = [];
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
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
    async beforeClose({position, instance}) {
      switch (position) {
        case 'cell':
        case 'outside':
          instance.close();
          break;
        case 'right':
          // console.log(instance.$attrs.title.orderID);
          // console.log();
          this.$dialog.confirm({
            confirmButtonColor:'#5252cc',
            message: '确定删除吗？'
          }).then(() => {
            instance.close();
            console.log(instance);
            this.deletefun(instance.$attrs.title);//此处需要刷新页面
          });
          break;
      }
    },
    async deletefun(id){
      let url = "/api/clue/deleteClue";
      let postData = {
        id: id,
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data
      if(result.code === 200) {
        Toast('线索删除成功');
      }
      else
        Toast('线索删除失败,错误码' + result.code);
    },
    onDetail() {
    },
    // 跳转至线索详情页
    toCLueDetail(clueId) {
      // 带着id去请求线索详情页
      this.$router.push({
        path: '/clueDetail',
        query: {
          clueId:clueId,
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
.clue_container {
  height:100%;
}
.clueDroMnu {
  background: #aa361a;
}
// 全部线索
/deep/.van-dropdown-menu__title {
  color: #1e1c27;
  font-size: 15px;
}
//搜索框
.schbtn {
  margin: 8px 2% 5px 45%;
  padding: 2px;
}
.schbox {
  height: 48px;
}
//分割线
.separate {
  margin: 12px 2% 5px 1%;
  opacity: 0.5;
}
//添加按钮
.addbtn {
  margin: 8px 2% 5px 2%;
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
  left: 7%;
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

</style>
