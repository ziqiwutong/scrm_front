<template>
  <div class="back">
    <!-- 背景框 -->
    <div class="background">
      <van-button icon="arrow-left" class="renav" @click="onClickLeft">
        返回
      </van-button>
    </div>
    <!-- 客户信息 -->
    <van-row class="cuscont">
      <van-image
        class="cusimg"
        round
        width="60"
        height="60"
        src="https://img0.baidu.com/it/u=2145776769,2874129051&fm=26&fmt=auto"
      />
      <van-row>
        <van-col span="8" class="detailnm">王冬文</van-col>
      </van-row>
      <van-row>
        <van-col span="10" class="cusfont">手机：18569875236</van-col>
        <van-col span="12" offset="2" class="cusfont"
          >号码归属地：广东/广州</van-col
        >
      </van-row>
      <van-row>
        <van-col span="10" class="cusfont">微信：18569875236</van-col>
        <van-col span="12" offset="2" class="cusfont"
          >微信昵称：helloWorld</van-col
        >
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
        <van-col span="12" offset="2" class="cusfont"
          >成交订单金额：200万</van-col
        >
      </van-row>
      <van-row>
        <van-col span="10" class="cusfont">公司：电子科技大学</van-col>
        <van-col span="12" offset="2" class="cusfont"
          >员工数量：500人以下</van-col
        >
      </van-row>
      <van-row>
        <van-col class="cusfont">进入客户池：2021-08-30</van-col>
      </van-row>
    </van-row>

    <!-- 标签页 -->
    <div class="listcont">
      <van-tabs color="#4876F1" title-active-color="#4876F1">
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
          <van-row class="orderTitle">
            <van-col span="8"
              >成交订单：<span style="color: #ff5b5b">5</span>个</van-col
            >
            <van-col span="14"
              >成交订单金额：<span style="color: #ff5b5b"
                >￥10000000000</span
              ></van-col
            >
          </van-row>

          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="item in orderList" :key="item.orderID">
              <div class="ordercell">
                <van-row>
                  <van-col span="1"><van-icon :name= monImg /></van-col>

                  <van-col>订单号：{{ item.orderID }}</van-col>
                  <van-col span="1" offset="2"
                    ><van-icon name="edit"
                  /></van-col>
                  <van-col span="1"><van-icon name="revoke" /></van-col>
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">订单状态：</span
                    >{{ item.orderStatus }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">实收金额：</span
                    >{{ item.productPrice }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">成交员工：</span
                    >{{ item.orderStaff }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">备注：</span>{{ item.notes }}
                  </van-col>
                  <van-col offset="1"><van-icon name="edit" /></van-col>
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">成交时间：</span
                    >{{ item.orderFinish }}</van-col
                  >
                </van-row>
                <van-row>
                  <van-col
                    ><span style="color: #bbbcbe">订单来源：</span
                    >{{ item.orderSource }}</van-col
                  >
                </van-row>
              </div>
            </van-cell>
          </van-list></van-tab
        >
      </van-tabs>
    </div>
    <!-- 标签栏 -->
    <van-tabbar active-color="#7d7e80">
      <van-tabbar-item :icon= callImg @click="callPhone"
        >打电话
      </van-tabbar-item>
      <van-tabbar-item :icon= wchatImg @click="sendWx">发微信</van-tabbar-item>
      <van-tabbar-item :icon= msgImg @click="sendShortMsg"
        >发短信</van-tabbar-item
      >
      <van-tabbar-item :icon= contImg @click="toMore"
        >更多操作</van-tabbar-item
      >
    </van-tabbar>
    <!-- 弹窗 -->
    <van-dialog v-model="show" title="标题" show-cancel-button> </van-dialog>
    <!-- 更多操作跳转 -->
    <van-action-sheet
      v-model="addShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      show: false,
      addShow: false,
      orderList: [
        {
          orderID: "12345689089",
          orderStatus: "交易成功",
          productPrice: "￥100000000.00",
          orderStaff: "朱源杰",
          notes: "尾款未支付",
          orderFinish: "2021-10-15",
          orderSource: "销售创建",
        },
        {
          orderID: "0000000000",
          orderStatus: "交易成功",
          productPrice: "￥100000000.00",
          orderStaff: "朱源杰",
          notes: "尾款未支付",
          orderFinish: "2021-10-15",
          orderSource: "销售创建",
        },
        {
          orderID: "1111111111",
          orderStatus: "交易成功",
          productPrice: "￥100000000.00",
          orderStaff: "朱源杰",
          notes: "尾款未支付",
          orderFinish: "2021-10-15",
          orderSource: "销售创建",
        },
      ],
      actions: [
        { name: "发送推文" },
        { name: "新建商机" },
        { name: "新建订单" },
        { name: "改跟进人" },
        { name: "改协助人" },
        { name: "删除客户" },
      ],
      //自定义图标打电话
      callImg:require('../../assets/cusicon/per_call.png'),
      wchatImg:require('../../assets/cusicon/per_wchat.png'),
      msgImg:require('../../assets/cusicon/per_msg.png'),
      contImg:require('../../assets/cusicon/per_context.png'),
      monImg:require('../../assets/cusicon/per_mon.png'),
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
    //跳转界面
    onClickLeft() {
      this.$router.replace("/customer");
    },
    //打电话
    callPhone() {
      this.show = true;
    },
    //发短信
    sendShortMsg() {
      this.show = true;
    },
    //发微信
    sendWx() {
      this.show = true;
    },
    //发推文
    toContShare() {
      this.$router.replace("/contextShare");
    },
    //更多操作
    toMore() {
      this.addShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
//背景
.back {
  background-color: #f8f8f8;
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
  background-color: #ffffff;
  position: absolute;
  top: 70px;
  left: 5%;
  width: 80%;
  height: 37%;
  padding: 5%;
  z-index: 2;
}
//头像样式
.cusimg {
  position: absolute;
  z-index: 3;
  left: 75%;
  top: -5%;
}

//下边栏背景
.listcont {
  margin-top: 400px;
  padding: 5%;
}
//返回按钮
.renav {
  background-color: #4876f1;
  color: #ffffff;
  border: none;
}
.detailnm {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
.cusfont {
  font-size: 10pt;
  margin-bottom: 5px;
}
//订单标题
.orderTitle {
  background-color: #faf3e6;
  font-size: 13px;
  padding: 5%;
  margin-bottom: 10px;
  font-weight: 550;
}
.ordercell {
  color: #201e2b;
}
</style>
