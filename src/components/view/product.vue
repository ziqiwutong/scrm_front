<template>
  <div>
    <!-- 导航栏 -->
    <van-row>
      <!-- 导航栏菜单 -->
      <van-col span="8">
        <van-dropdown-menu>
          <van-dropdown-item v-model="value1" :options="option1" />
        </van-dropdown-menu>
      </van-col>
      <!-- 搜索跳转 -->
      <!-- 搜索框 -->
      <transition name="van-slide-right">
        <form action="/">
          <van-search
            v-if="show"
            v-model="value"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel1"
          />
        </form>
      </transition>
      <van-col span="2" offset="12" v-if="searchshow"
      ><van-icon name="search" size="30" @click="searchClick"
      /></van-col>
      <!-- 编辑添加跳转 -->
      <van-col span="2" v-if="searchshow"
      ><van-icon name="plus" size="30" @click="addClick" />
      </van-col>
    </van-row>
    <!-- 标签栏 -->
    <van-row>
      <van-tabbar v-model="active" :fixed="false">
        <!-- 最近浏览 -->
        <van-tabbar-item icon="home-o">最近浏览</van-tabbar-item>
        <!-- 筛选 -->
        <van-tabbar-item icon="search" @click="showScreen">筛选</van-tabbar-item>
        <!-- 多选 -->
        <van-tabbar-item icon="friends-o" @click="showCheckbox" >多选</van-tabbar-item>
      </van-tabbar>
    </van-row>
    <!-- 筛选内容 -->
    <van-popup v-model="showscr" closeable position="right">
      <h5>性别</h5>
      <van-row>
        <van-button
          v-for="item in sexlist"
          :key="item.name"
          :class="item.isSelected ? 'active1' : ''"
          @click="cutTabClick(item)"
        >
          {{ item.name }}</van-button
        >
      </van-row>

      <h5>年龄范围</h5>
      <van-row>
        <van-button
          v-for="item in agelist"
          :key="item.name"
          :class="item.isSelected ? 'active1' : ''"
          @click="cutTabClick(item)"
        >
          {{ item.name }}</van-button
        >
      </van-row>
      <h5>标签</h5>
      <h5>来源</h5>
      <h5>企微-客户等级</h5>
      <h5>行业分类</h5>
      <h5>注册资本</h5>
      <h5>员工数量</h5>
      <h5>企业类型</h5>
      <!-- 筛选内容提交 -->
      <van-button type="info" @click="screen">确定</van-button>
      <!-- 筛选内容重置 -->
      <van-button type="default" @click="reset">重置</van-button>
    </van-popup>

    <!-- 多选内容 -->
    <van-popup
      v-model="showche"
      closeable
      position="bottom"
      close-icon-position="top-left"
      close-icon="close"
    >
      <!-- 多选内容导航栏 -->
      <van-nav-bar title="客户详情">
        <template #right> 已选中{{ scrnum }}人 </template>
      </van-nav-bar>
      <!-- 多选内容客户信息 -->
      <van-checkbox-group v-model="result" ref="checkboxGroup">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in list"
            clickable
            :key="item"
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" />
            </template>
            <van-row>
              <van-col span="4" offset="1">
                <van-image
                  round
                  width="40"
                  height="40"
                  src="https://img01.yzcdn.cn/vant/cat.jpeg"
                />
              </van-col>
              <van-col span="8">公司/客户姓名</van-col>
              <van-col span="8">进入客户池时间</van-col>
              <van-col span="16">公司简介</van-col>
              <van-col span="5"><van-tag type="success">成交</van-tag></van-col>
              <van-col span="5"
              ><van-tag type="danger">年龄段</van-tag></van-col
              >
              <van-col span="5"
              ><van-tag type="warning">推荐信息</van-tag></van-col
              >
            </van-row>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
      <!-- 多选内容标签栏 -->
      <van-tabbar v-model="active">
        <van-checkbox v-model="checked" @click="checkAll">全选</van-checkbox>
        <van-tabbar-item icon="search">标签</van-tabbar-item>
        <van-tabbar-item icon="friends-o">标签</van-tabbar-item>
        <van-tabbar-item icon="setting-o">标签</van-tabbar-item>
      </van-tabbar>
    </van-popup>

    <!-- 客户列表内容 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-swipe-cell v-for="item in list" :key="item" :title="item">
        <van-row @click="onDetail">
          <van-col span="4" offset="1">
            <van-image
              round
              width="40"
              height="40"
              src="https://img01.yzcdn.cn/vant/cat.jpeg"
            />
          </van-col>
          <van-col span="8">公司/客户姓名</van-col>
          <van-col span="8">进入客户池时间</van-col>
          <van-col span="16">公司简介</van-col>
          <van-col span="5"><van-tag type="success">成交</van-tag></van-col>
          <van-col span="5"><van-tag type="danger">年龄段</van-tag></van-col>
          <van-col span="5"><van-tag type="warning">推荐信息</van-tag></van-col>
        </van-row>
        <!-- 滑动删除 -->
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" />
        </template>
      </van-swipe-cell>
    </van-list>
    <!-- 编辑添加跳转 -->
    <van-action-sheet
      v-model="showadd"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="onCancel"
    />
    <!-- 添加表单 -->
    <van-popup
      v-model="showform"
      closeable
      position="bottom"
      close-icon-position="top-left"
      close-icon="close"
    >
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
          >提交</van-button
          >
        </div>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value1: 0,
      value: "",
      list: [],
      username: '',
      password: '',
      loading: false,
      finished: false,
      show: false,
      searchshow: true,
      showscr: false,
      showche: false,
      showadd: false,
      showform:false,
      active: 0,
      list3: ["a", "b"],
      result: [],
      checkVal: [],
      actions: [
        { name: "编辑用户", callback: this.formClick },
        { name: "选项二" },
        { name: "选项三" },
      ],
      scrnum: 0,
      option1: [
        { text: "全部商品", value: 0 },
        { text: "新款商品", value: 1 },
        { text: "活动商品", value: 2 },
      ],
      wpList: [
        {
          name: "食品饮料",
        },
        {
          name: "鲜花",
        },
        {
          name: "蛋糕",
        },
        {
          name: "水果生鲜",
        },
        {
          name: "服装鞋帽",
        },
        {
          name: "其它",
        },
      ],
      sexlist: [
        { name: "男", isSelected: false },
        { name: "女", isSelected: false },
      ],
      agelist: [
        { name: "青少年", isSelected: false },
        { name: "中青年", isSelected: false },
        { name: "中老年", isSelected: false },
      ],
      selectlist: [],
      checked: false,
      active1: "",
    };
  },
  methods: {
    onSearch(val) {
      Toast(val);
    },
    onCancel1() {
      this.show = false;
      this.searchshow = !this.searchshow;
    },
    onCancel() {
      this.show = false;
    },
    onClick(name, title) {
      Toast(title);
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= 10) {
          this.finished = true;
        }
      }, 1000);
    },
    // 搜索功能
    searchClick() {
      this.show = !this.show;
      this.searchshow = !this.searchshow;
    },
    // 添加编辑功能
    addClick() {
      this.showadd = true;
    },
    onDetail() {
      this.$router.replace("/perinfor");
    },
    // 筛选展示
    showScreen() {
      this.showscr = !this.showscr;
    },
    // 多选展示
    showCheckbox() {
      this.showche = !this.showche;
    },
    selected(name) {
      this.active1 = name;
    },
    cutTabClick(item) {
      //然后通过这个属性判断是否选中点亮和取消
      item.isSelected = !item.isSelected;
    },
    //复选框单选
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
      if(!this.$refs.checkboxes[index].checked){
        this.scrnum++;
      }
      else
      {
        this.scrnum--;
      }
    },
    //通过扫描方式获取多选的标签
    screen() {
      for (let i = 0; i < this.sexlist.length; i++) {
        if (this.sexlist[i].isSelected == true)
          this.selectlist.push(this.sexlist[i].name);
      }
      // console.log(this.selectlist)
      this.selectlist = [];
    },
    //重置多选标签
    reset() {
      for (let i = 0; i < this.sexlist.length; i++) {
        if (this.sexlist[i].isSelected == true)
          this.sexlist[i].isSelected = false;
      }
    },
    //全选单选设置
    checkAll() {
      if (this.checked) {
        this.$refs.checkboxGroup.toggleAll(false);
        this.$refs.checkboxGroup.toggleAll(true);
        this.scrnum = this.result.length;
      } else {
        this.$refs.checkboxGroup.toggleAll(false);
        this.scrnum = this.result.length;
      }
    },
    formClick() {
      this.showform = !this.showform;
    },
    onSubmit(values) {
      console.log('submit', values);
    },
  },
};
</script>

<style lang="less" scoped="less">

</style>
