<template>
<div>
  <div class="communicationdetail">
    <div class="background">
      <van-button icon="arrow-left" size="40" class="renav" @click="onClickLeft">
      </van-button>
      <div class="title">沟通管理</div>
      <div class="backgroundImg">
        <van-image
          width="375.2"
          height="200"
          :src="require('./background.png')"
        />
      </div>
     <div class="name">{{cuslist.customerName}}</div>
      <div class="company">{{cuslist.belongCompany}}</div>
      <van-image
        class="cusimg"
        round
        width="60"
        height="60"
        :src="cuslist.customerIcon"
        v-if="cuslist.customerIcon"
      />
      <div v-if="!cuslist.customerIcon" class="list-img-none">
        {{cuslist.customerName[0]}}
      </div>
    </div>
    <div class="telephone">
      <van-row>
        <van-col span="3.5" offset="1">电话：</van-col>
        <van-col span="8" class="phoneNumber">{{cuslist.telephone}}</van-col>
      </van-row>
   </div>
    <div class="count_title">
      <p>沟通次数统计：</p>
    </div>
    <div class="count">
      <table width="100%"  cellspacing="0" cellpadding="4"  align="center" class="table">
        <tr>
          <th>线下拜访</th>
          <th>电话沟通</th>
          <th>短信沟通</th>
          <th>微信沟通</th>
        </tr>
        <tr>
          <td>{{array.visitTimes}}</td>
          <td>{{array.callTimes}}</td>
          <td>{{array.msgTimes}}</td>
          <td>{{array.wxTimes}}</td>
        </tr>
      </table>
    </div>
    <div class="record_title">
      <p>沟通记录:</p>
    </div>
    <div class="record_detail">
      <van-tabs title-active-color="#121922"	@click="onClick"  color="#4876F1"  v-model="active" animated>
        <van-tab title="全部">
          <van-cell-group>
            <van-cell :title="item.communicationTime"  v-for="(item,i) in list.slice(2)"  :key="i"  >
              <template #right-icon>
                <van-icon class-prefix="icon-third" :name="iconArray[item.communicationWay]" color="#3490f4"/>
              </template>
              <div class="edit" @click="toEditCom(item.id)">
                <van-button plain type="info" size="mini" class="editBtn1">编辑</van-button>
              </div>
            </van-cell>
          </van-cell-group>
        </van-tab>
        <van-tab title="线下">
          <van-cell-group>
            <van-cell :title="item.communicationTime"  v-for="(item,i) in list.slice(1)"  :key="i" >
              <template #right-icon>
                <van-icon class-prefix="icon-third" :name="iconArray[item.communicationWay]" color="#3490f4"/>
              </template>
              <div class="edit" @click="toEditCom(item.id)">
                <van-button plain type="info" size="mini" class="editBtn1">编辑</van-button>
              </div>
            </van-cell>
          </van-cell-group>
        </van-tab>
        <van-tab title="电话">
          <van-cell-group>
            <van-cell :title="item.communicationTime"  v-for="(item,i) in list.slice(1)"  :key="i" >
              <template #right-icon>
                <van-icon class-prefix="icon-third" :name="iconArray[item.communicationWay]" color="#3490f4"/>
              </template>
              <div class="edit" @click="toEditCom(item.id)">
                <van-button plain type="info" size="mini" class="editBtn1">编辑</van-button>
              </div>
            </van-cell>
          </van-cell-group>
        </van-tab>
        <van-tab title="短信">
          <van-cell-group>
            <van-cell :title="item.communicationTime"  v-for="(item,i) in list.slice(2)"  :key="i" >
              <template #right-icon>
                <van-icon class-prefix="icon-third" :name="iconArray[item.communicationWay]" color="#3490f4"/>
              </template>
              <div class="edit" @click="toEditCom(item.id)">
                <van-button plain type="info" size="mini" class="editBtn1">编辑</van-button>
              </div>
            </van-cell>
          </van-cell-group>
        </van-tab>
        <van-tab title="微信">
          <van-cell-group>
            <van-cell :title="item.communicationTime"  v-for="(item,i) in list.slice(1)"  :key="i" >
              <template #right-icon>
                <van-icon class-prefix="icon-third" :name="iconArray[item.communicationWay]" color="#3490f4"/>
              </template>
              <div class="edit" @click="toEditCom(item.id)">
                <van-button plain type="info" size="mini" class="editBtn1">编辑</van-button>
              </div>
            </van-cell>
          </van-cell-group>
          </van-tab>
      </van-tabs>
    </div>
    <!-- 标签栏 -->
    <div class="nav-margin">
      <van-tabbar active-color="#7d7e80">
        <van-tabbar-item :icon="callImg" @click="onCallPhone">打电话</van-tabbar-item>
        <van-tabbar-item
          :icon="wchatImg"
          @click="sendWx"
          v-clipboard:copy="cusDetail.telephone"
          v-clipboard:success="copyCode"
          v-clipboard:error="copyCodeError"
        >发微信</van-tabbar-item
        >
        <van-tabbar-item :icon="msgImg" @click="toShrtMsg"
        >发短信</van-tabbar-item
        >
        <van-tabbar-item :icon="contImg" @click="toMore"
        >更多操作</van-tabbar-item
        >
      </van-tabbar>
    </div>
    <!-- 发微信 -->
    <van-popup v-model="wxShow" position="bottom" :style="{ height: '40%' }">
      <van-image :src="wx" class="wx-img"></van-image>
      <van-button class="screen-confirm-btn" @click="onOpenWx"
      >打开微信</van-button
      >
    </van-popup>
    <van-popup v-model="shortShow" position="bottom" :style="{ height: '90%' }">
      <van-nav-bar
        title="发短信"
        left-text="取消"
        right-text="发送"
        @click-left="onClickMsgLeft"
        @click-right="onClickMsgRight"
      />
      <van-tabs
        type="card"
        color="#4876F1"
        title-active-color="#FFFFFF"
        class="shortmsgnar"
      >
        <van-tab title="自定义短信">
          <van-field
            v-model="message"
            rows="1"
            autosize
            label="短信内容"
            type="textarea"
            placeholder="请输入"
          />
        </van-tab>

        <van-tab title="模板短信">
          <van-cell-group>
            <van-cell title="请选择短信模板" />
          </van-cell-group>
        </van-tab>
      </van-tabs>
    </van-popup>
    <!-- 更多操作 -->
    <van-action-sheet
      v-model="addShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
    />
      </div>
</div>
</template>

<script>
import NavBar from "../../component/NavBar";
import TabBar from "../../component/TabBar";
import qs from 'qs'
import {Toast} from "vant";
// axios参数包
export default {
  name: "communicationDetail",
  components: {
    NavBar,
    TabBar
  },
  data(){
      return {
        userIcon:"",
        active: 0,
        id:'',
        customerId:1,
        cuslist:[],
        communicationWay:4,
        visitTimes:'',
        wxShow: false,
        //短信
        shortShow: false,
        addShow: false,
        message: "",
        item:'',
        pageProps: {
          pageCount: 8,
          currentPage: 1,
        },
        iconArray:[
          "visit",
          "call",
          "message",
          "wechat"
        ],
        array: {
          visitTimes:'',
          callTimes:'',
          msgTimes:'',
          wxTimes:'',
        },
        list:[
          {
            communicationWay:'',
            communicationContent:'',
            communicationTime:'',
          }
        ],
        cusDetail: [],
        contImg: require("../../../assets/cusicon/per_context.png"),
        callImg: require("../../../assets/cusicon/per_call.png"),
        wchatImg: require("../../../assets/cusicon/per_wchat.png"),
        msgImg: require("../../../assets/cusicon/per_msg.png"),
        wx: require("../../../assets/cusicon/wx.png"),
        actions: [
          { name: "新建沟通记录", callback: this.toAddCommunicationLog },
        ],
      }
  },
  created() {
    this.onLoad();
    this.test();
     this.cuslist = this.$route.query.cuslist;
  },
  methods: {
    onClickLeft() {
      this.$router.replace("/communicationList");
    },
    onClick(name, title){
      this.pageProps.pageNum=1;
      this.list=[];
      if(title === '全部')
        this.communicationWay = 4 ;
      if(title === '线下')
        this.communicationWay = 0 ;
      if(title === '电话')
        this.communicationWay = 1 ;
      if(title === '短信')
        this.communicationWay = 2 ;
      if(title === '微信')
        this.communicationWay = 3 ;
      this.onLoad();
    },
    async test(){
      let url = "/api/se/customer/query";
      let postData = {
        customerId:this.customerId
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
    },
    async onLoad() {
      let url = "/api/se/communication/queryCommunicationLog";
      let postData = {
        customerId: this.customerId,
        communicationWay:this.communicationWay,
      };
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      this.array =[];
      this.list = [];
      console.log(this.array)
      console.log("result:");
      console.log(result);
      this.array = result[1];
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
      console.log("this.array:")
      console.log(this.array);
    },

    // 打电话
    onCallPhone() {
      let tel = "tel:" + this.cusDetail.telephone;
      window.location.href = tel;
      this.cusRelation = [];
      this.newCusRelation(this.cusDetail.id, "打电话", "");
      this.getCusRelation();
    },
    // 复制电话号码
    copyCode() {
      Toast.success("客户电话号码已复制");
    },
    // 复制失败
    copyCodeError() {
      Toast.fail("复制失败");
    },
    // 打开微信
    onOpenWx() {
      window.location.href = "weixin://";
      this.cusRelation = [];
      this.newCusRelation(this.cusDetail.id, "发微信", "");
      this.getCusRelation();
      this.getCusRelation();
    },
    //发微信
    sendWx() {
      this.wxShow = true;
    },
    // 多选-发短信-弹窗
    toShrtMsg() {
      this.shortShow = true;
    },
    // 多选-短信-界面关闭
    onClickMsgLeft() {
      this.shortShow = false;
    },
    //更多操作
    toMore() {
      this.addShow = true;
    },
    // 多选-短信-发送短信
    onClickMsgRight() {
      if (this.message == "" || this.cusDetail.telephone == "") {
        Toast.fail("发送失败");
        this.message = "";
      } else {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var msg = this.message;

        if (isAndroid) {
          // sms:后面跟收件人的手机号,body后接短信内容
          window.location.href =
            "sms:" + this.cusDetail.telephone + "?body=" + msg;
        } else if (isIOS) {
          window.location.href =
            "sms:" + this.cusDetail.telephone + "&body=" + msg;
        }
        Toast.success("短信发送成功");
        this.cusRelation = [];
        this.newCusRelation(this.cusDetail.id, "发短信", "");

        this.getCusRelation();
        this.message = "";
      }
    },
    // 客户关系-新建
    async newCusRelation(id, type, detail) {
      let url = "/api/se/customer/relation/insert";
      const result = await this.$http.post(url, {
        customerId: id,
        relationType: type,
        relationDetail: detail,
      });
      if (result.data.code == "200") {
        // Toast("成功插入");
        this.getCusStatus();
      }
    },
    // 获取客户关系
    async getCusRelation() {
      this.cusRelation = [];
      let url = "/api/se/customer/relation/query";
      const result = await this.$http.get(url + "?id=" + this.cusDetail.id);
      if (result.data.code == "200") {
        this.cusRelation = result.data.data;
      }
      console.log(this.cusRelation);
    },
    // 标签页-客户关系请求
    getCusStatus() {
      Toast("获取客户关系");
      this.cusRelation = [];
      this.getCusRelation();
    },
    toAddCommunicationLog() {
      Toast("跳转新增沟通记录界面");
      this.$router.push({ name: "addCommunicationLog", query: { cuslist: this.cuslist } });
    },
    toEditCom(id) {
      this.$router.push({name: "editCom", query: { cuslist: this.cuslist,id:id}});
    },
  }
}
</script>

<style lang="less" scoped>
//背景样式
.background {
  background-color: #4881F2;
  width: 100%;
  height: 210px;
  //对象可层叠
  position: absolute;
  z-index: 1;
}
.title {
  position: absolute;
  top: 19px;
  left:150px;
  color: #ffffff;
  font-size: 18px;
}
//返回按钮
.renav {
  position: absolute;
  background-color: #4881F2;
  color: #ffffff;
  border: none;
  top: 10px;
  left:15px;
  z-index: 130;
}
.backgroundImg {
  position: absolute;
  z-index: 120;
  top:50px;
}
.name {
  position: absolute;
  top:140px;
  left: 15px;
  color: #ffffff;
  font-size: 20px;
}
.company {
  position: absolute;
  top:170px;
  left: 15px;
  color: #ffffff;
  font-size: 16px;
}
.list-img-none {
  width: 60px;
  height: 60px;
  background-color:#2761D4;
  border-radius: 50%;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
  position: absolute;
  z-index: 120;
  left: 70%;
  top: 40%;
  font-size: 25px;
  border: 2px solid #78a1f2;
}
.cusimg {
  position: absolute;
  z-index: 120;
  left: 76%;
  top: 50%;
}
.telephone {
  position: absolute;
  top:215px;
  width: 100%;
  font-weight: bold;
  font-size: 14px;
  margin-top: 4px;
}
.phoneNumber {
  margin-top: 3px;
  color:#4881F2;
}
.count {
  position: absolute;
  margin-top: 5px;
  top: 280px;
  left: 15px;
  width: 90%;
  height: 50px;
}
.table {
  border-style:solid;
  border-width:1px;
  border-color: #E4E4EE;
}
.wx-img {
  margin-left: 8px;
}
th {
  background-color: #EBEBF9;
  font-size: 13px;
  height:25px;
  font-family: PingFangSC-Regular;
}
td {
  text-align: center;
  font-size: 13px;
  height: 25px;
}
.count_title {
  position: absolute;
  top:32%;
  left:15px;
  font-size: 14px;
  margin-top: 5px;
  color: #918F8F;
  font-weight: 550;
}
.record_title {
  position: absolute;
  top:50%;
  left:15px;
  font-size: 14px;
  margin-top: 5px;
  color: #918F8F;
  font-weight: 550;
}
.record_detail{
  position: absolute;
  top:56%;
  width:90%;
  height: 30%;
  left:10px;
  font-size: 14px;
  margin-top: 5px;
}
.screen-confirm-btn {
  border-radius: 5px;
  width: 100%;
  background-color: #4876f1;
  color: #ffffff;
}
.editBtn1 {
  position: absolute;
  top: 15%;
  right:10px;
  height: 20px;
}
</style>
