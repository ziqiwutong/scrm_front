<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      title="标题"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 客户信息 -->
    <van-cell-group inset>
      <van-cell>
        <van-row>
          <van-col span="8">姓名</van-col>
        </van-row>
        <van-row>
          <van-col span="8">手机：</van-col>
          <van-col span="8" offset="8">号码归属地：</van-col>
        </van-row>
        <van-row>
          <van-col span="8">微信：</van-col>
          <van-col span="8" offset="8">微信昵称：</van-col>
        </van-row>
        <van-row>
          <van-col span="8">性别：</van-col>
          <van-col span="8" offset="8">生日：</van-col>
        </van-row>
        <van-row>
          <van-col span="8">职位：</van-col>
          <van-col span="8" offset="8">爱好：</van-col>
        </van-row>
        <van-row>
          <van-col span="8">客户等级：</van-col>
          <van-col span="8" offset="8">标签：</van-col>
        </van-row>
        <van-row>
          <van-col span="8">来源：</van-col>
          <van-col span="8" offset="8">地区：</van-col>
        </van-row>
        <van-row>
          <van-col span="8">客户状态：</van-col>
          <van-col span="8" offset="8">跟进人</van-col>
        </van-row>
        <van-row>
          <van-col span="8">进入客户池：</van-col>
        </van-row>
        <van-row>
          <van-col span="8">成交订单金额</van-col>
          <van-col span="8" offset="8">成交订单数：</van-col>
        </van-row>
      </van-cell>
    </van-cell-group>
    <!-- 标签页 -->
    <van-tabs @click="onClick">
      <van-tab title="客户关系">
        <!-- 状态更新 -->
        <van-steps direction="vertical" :active="0">
          <van-step>
            <h3>客户关系1</h3>
            <p>2016-07-12 12:40</p>
          </van-step>
          <van-step>
            <h3>客户关系2</h3>
            <p>2016-07-11 10:00</p>
          </van-step>
          <van-step>
            <h3>客户关系3</h3>
            <p>2016-07-10 09:30</p>
          </van-step>
        </van-steps></van-tab
      >
      <!-- 订单详情 -->
      <van-tab title="订单">
        <van-row>
          <van-col span="10">成交订单数：</van-col>
          <van-col span="10">成交订单金额：￥</van-col>
        </van-row>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-swipe-cell v-for="item in list" :key="item" :title="item">
            <van-row>
              <van-col span="2">
                <van-image
                  width="25"
                  height="25"
                  src="https://img01.yzcdn.cn/vant/cat.jpeg"
                />
              </van-col>
              <van-col span="12">订单号：</van-col>
              <van-col span="1"><van-icon name="edit" /></van-col>
              <van-col span="1"><van-icon name="revoke" /></van-col>
            </van-row>
            <van-row>
              <van-col span="8">订单状态：</van-col>
            </van-row>
            <van-row>
              <van-col span="8">实收金额：</van-col>
            </van-row>
            <van-row>
              <van-col span="8">成交员工：</van-col>
            </van-row>
            <van-row>
              <van-col span="8">备注：<van-icon name="edit" /></van-col>
            </van-row>
            <van-row>
              <van-col span="8">成交时间：</van-col>
            </van-row>
            <van-row>
              <van-col span="8">订单来源：</van-col>
            </van-row>
          </van-swipe-cell> </van-list
      ></van-tab>
    </van-tabs>
    <!-- 标签栏 -->
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o">打电话</van-tabbar-item>
      <van-tabbar-item icon="search">发微信</van-tabbar-item>
      <van-tabbar-item icon="friends-o">发短信</van-tabbar-item>
      <van-tabbar-item icon="setting-o">发推文</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      list: [],
      loading: false,
      finished: false,
    };
  },
  methods: {
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
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    onClickLeft() {
      this.$router.replace("/customer");
    },
  },
};
</script>

<style lang="less" scoped>
</style>
