<template>
  <div class="back">

    <!-- 背景框 -->
    <div class="background">
      <van-button icon="arrow-left" class="renav" @click="onClickLeft"> 返回 </van-button>
    </div>
      <!-- 客户信息 -->
      <van-row class="cuscont">
          <van-image class="cusimg" round width="40" height="40" src="https://img0.baidu.com/it/u=2145776769,2874129051&fm=26&fmt=auto"/>
        <van-row>
          <van-col span="8" class="detailnm">名字</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">手机：18569875236</van-col>
          <van-col span="12" offset="2" class="cusfont">号码归属地：广东/广州</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">微信：18569875236</van-col>
          <van-col span="12" offset="2" class="cusfont">微信昵称：helloWorld</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">性别：男</van-col>
          <van-col offset="2" class="cusfont">生日：1982-08-30</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">职位：老板</van-col>
          <van-col span="12" offset="2" class="cusfont">爱好：打高尔夫</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">客户等级：重要</van-col>
          <van-col span="12" offset="2" class="cusfont">标签：爱酒/慈善</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">来源：行业活动</van-col>
          <van-col span="12" offset="2" class="cusfont">地区：上海市</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">客户状态：跟进中</van-col>
          <van-col span="12" offset="2" class="cusfont">跟进人：苏生</van-col>
        </van-row>
        <van-row>
          <van-col span="10" class="cusfont">成交订单数：5</van-col>
          <van-col span="12" offset="2" class="cusfont">成交订单金额：200万</van-col>
          
        </van-row>
          <van-row>
          <van-col span="10" class="cusfont">公司：电子科技大学</van-col>
          <van-col span="12" offset="2" class="cusfont">员工数量：500人以下</van-col>
        </van-row>
          <van-row>
          <van-col class="cusfont">进入客户池：2021-08-30</van-col>
        </van-row>
      </van-row>

    <!-- 标签页 -->
    <div class="listcont">
      <van-tabs>
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
            </van-swipe-cell>
          </van-list></van-tab
        >
      </van-tabs>
    </div>
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
//背景
.back{
  background-color:#f8f8f8 ;
  position: absolute;
  width: 100%;
  height: 100%;
}

//背景样式
.background {
  background-color: #4876f1;
  width: 100%;
  height: 250px;
  //对象可层叠
  position: absolute;
  z-index: 1;
}
//客户详情
.cuscont {
  background-color: #FFFFFF;
  
  position:absolute;
  top:70px;
  left:5%;
  width: 80%;
  height: 37%;
  padding: 5%;
  z-index: 2;
}
//头像样式
.cusimg {
  position: absolute;
  z-index: 3;
  left:85%;
  top:-5%;
}

//下边栏背景
.listcont {
  margin-top: 400px;
  padding: 5%;
}
//返回按钮
.renav{
  background-color:#4876f1 ;
  color: #FFFFFF;
  border: none;
}
.detailnm{

  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
.cusfont{
  font-size: 10pt;
  margin-bottom: 5px;
}
</style>
