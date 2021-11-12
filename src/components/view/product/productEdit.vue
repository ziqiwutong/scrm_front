<template>
  <van-popup v-model="scrShow" closeable position="right" class="scrpop">
    <van-row v-for="item in scrList" :key="item.name">
      <p class="scrname">{{ item.name }}</p>
      <van-button
        v-for="item1 in item.class"
        :key="item1.name"
        :class="item1.isSelected ? 'actscrbtn' : 'scrbtn'"
        @click="cutTabClick(item1)"
      >
        {{ item1.name }}</van-button
      >
    </van-row>
<!--    <van-row>-->
<!--      <p class="scrname">跟进人</p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="this.ifChoose">-->
<!--        请选择>>>-->
<!--      </p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">-->
<!--        {{ this.followChsVal.val }}-->
<!--      </p>-->
<!--    </van-row>-->
<!--    <van-row>-->
<!--      <p class="scrname">上次跟进人</p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="this.ifChoose">-->
<!--        请选择>>>-->
<!--      </p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">-->
<!--        {{ this.followChsVal.val }}-->
<!--      </p>-->
<!--    </van-row>-->
<!--    <van-row>-->
<!--      <p class="scrname">商机负责人</p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="this.ifChoose">-->
<!--        请选择>>>-->
<!--      </p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">-->
<!--        {{ this.followChsVal.val }}-->
<!--      </p>-->
<!--    </van-row>-->
<!--    <van-row>-->
<!--      <p class="scrname">协助人</p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="this.ifChoose">-->
<!--        请选择>>>-->
<!--      </p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">-->
<!--        {{ this.followChsVal.val }}-->
<!--      </p>-->
<!--    </van-row>-->
<!--    <van-row>-->
<!--      <p class="scrname">创建人</p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="this.ifChoose">-->
<!--        请选择>>>-->
<!--      </p>-->
<!--      <p class="followchoose" @click="toFollow" v-show="!this.ifChoose">-->
<!--        {{ this.followChsVal.val }}-->
<!--      </p>-->
<!--    </van-row>-->
    <!-- 筛选内容重置 -->
    <van-button type="default" @click="reset" class="scrresbtn" hairline
    >重置</van-button
    >
    <!-- 筛选内容提交 -->
    <van-button type="info" @click="screen" class="scrfirbtn"
    >确定</van-button
    >
  </van-popup>
</template>

<script>
export default {
  name: "editProdcut",
  data(){
    return {
      scrShow: true,
      followShow: false,
      // 筛选-跟进人-搜索
      followVal: "",
      // 筛选-标签选择数组
      selectList: [],
      //筛选列表
      newscrList: [],
      scrList: [
        {
          name: "性别",
          class: [
            { name: "男", isSelected: false },
            { name: "女", isSelected: false },
          ],
        },
        {
          name: "年龄范围",
          class: [
            { name: "青少年", isSelected: false },
            { name: "中青年", isSelected: false },
            { name: "中老年", isSelected: false },
          ],
        },
        {
          name: "标签",
          class: [
            { name: "高管客户", isSelected: false },
            { name: "C端客户", isSelected: false },
            { name: "B端客户", isSelected: false },
            { name: "爱酒", isSelected: false },
            { name: "慈善", isSelected: false },
            { name: "科技公司", isSelected: false },
            { name: "红酒", isSelected: false },
            { name: "啤酒", isSelected: false },
            { name: "集团合作客户", isSelected: false },
            { name: "定制酒", isSelected: false },
            { name: "旅游", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "来源",
          class: [
            { name: "手动新建", isSelected: false },
            { name: "高端推荐", isSelected: false },
            { name: "内容营销", isSelected: false },
            { name: "行业活动", isSelected: false },
            { name: "启信宝", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "企微-客户等级",
          class: [
            { name: "一般", isSelected: false },
            { name: "重要", isSelected: false },
            { name: "核心", isSelected: false },
          ],
        },
        {
          name: "企业类型",
          class: [
            { name: "国企", isSelected: false },
            { name: "民企", isSelected: false },
            { name: "中国500强", isSelected: false },
            { name: "世界500强", isSelected: false },
            { name: "上市公司", isSelected: false },
            { name: "其他", isSelected: false },
          ],
        },
        {
          name: "行业分类",
          class: [
            { name: "食品制造业", isSelected: false },
            { name: "酒", isSelected: false },
            { name: "饮料", isSelected: false },
            { name: "茶制造业", isSelected: false },
            { name: "批发零售业", isSelected: false },
            { name: "贸易业", isSelected: false },
            { name: "金融业", isSelected: false },
            { name: "建筑安装业", isSelected: false },
            { name: "房地产业", isSelected: false },
            { name: "交通运输仓储业", isSelected: false },
            { name: "软件信息技术业", isSelected: false },
            { name: "租赁与商业服务业", isSelected: false },
            { name: "住宿和餐饮业", isSelected: false },
            { name: "农副食品加工业", isSelected: false },
            { name: "公共管理与社会保障", isSelected: false },
            { name: "科学研究和技术服务业", isSelected: false },
            { name: "农林牧渔业", isSelected: false },
            { name: "文体旅游和卫生业", isSelected: false },
            { name: "采矿业", isSelected: false },
            { name: "其他制造业", isSelected: false },
            { name: "其他行业", isSelected: false },
          ],
        },
        {
          name: "注册资本",
          class: [
            { name: "200万以下", isSelected: false },
            { name: "500万以下", isSelected: false },
            { name: "1000万以下", isSelected: false },
            { name: "5000万以下", isSelected: false },
            { name: "5000万以上", isSelected: false },
          ],
        },
        {
          name: "员工数量",
          class: [
            { name: "20人以下", isSelected: false },
            { name: "100人以下", isSelected: false },
            { name: "500人以下", isSelected: false },
            { name: "1000人以下", isSelected: false },
            { name: "1000人以上", isSelected: false },
          ],
        },
        {
          name: "跟进阶段",
          class: [
            { name: "新客", isSelected: false },
            { name: "已加微信", isSelected: false },
            { name: "产品介绍", isSelected: false },
            { name: "合作模式洽谈", isSelected: false },
            { name: "签约协议", isSelected: false },
            { name: "已成交", isSelected: false },
            { name: "已打首付款", isSelected: false },
            { name: "阶段性付款", isSelected: false },
            { name: "已打尾款", isSelected: false },
            { name: "多次成交", isSelected: false },
            { name: "已输单", isSelected: false },
            { name: "无效客户", isSelected: false },
          ],
        },
        {
          name: "输单原因",
          class: [
            { name: "价格原因", isSelected: false },
            { name: "合作模式", isSelected: false },
            { name: "产品", isSelected: false },
            { name: "其它", isSelected: false },
          ],
        },
        {
          name: "无效原因",
          class: [
            { name: "其它", isSelected: false },
            { name: "客户无需求", isSelected: false },
            { name: "多次联系不上", isSelected: false },
            { name: "错误手机号码", isSelected: false },
          ],
        },
        {
          name: "商机创建时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "预计成交时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "成交时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "结束时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近跟进阶段",
          class: [
            { name: "新客", isSelected: false },
            { name: "已加微信", isSelected: false },
            { name: "产品介绍", isSelected: false },
            { name: "合作模式洽谈", isSelected: false },
            { name: "签约协议", isSelected: false },
            { name: "已成交", isSelected: false },
            { name: "已打首付款", isSelected: false },
            { name: "阶段性付款", isSelected: false },
            { name: "已打尾款", isSelected: false },
            { name: "多次成交", isSelected: false },
            { name: "已输单", isSelected: false },
            { name: "无效客户", isSelected: false },
          ],
        },
        {
          name: "成交状态",
          class: [
            { name: "未成交", isSelected: false },
            { name: "成交", isSelected: false },
          ],
        },
        {
          name: "客户状态",
          class: [
            { name: "未成交", isSelected: false },
            { name: "成交", isSelected: false },
          ],
        },
        {
          name: "创建时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "分配时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近通话时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近通话状态",
          class: [
            { name: "已接通", isSelected: false },
            { name: "未接通", isSelected: false },
            { name: "未知", isSelected: false },
          ],
        },
        {
          name: "回收时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
        {
          name: "最近旅程时间",
          class: [
            { name: "今天", isSelected: false },
            { name: "昨天", isSelected: false },
            { name: "过去7天", isSelected: false },
            { name: "本周", isSelected: false },
            { name: "上周", isSelected: false },
            { name: "本月", isSelected: false },
            { name: "上月", isSelected: false },
            { name: "自定义", isSelected: false },
            { name: "为空", isSelected: false },
          ],
        },
      ],
    }

  },
  methods:{
// 筛选-筛选功能弹出框

    toScreen() {
      this.scrShow = !this.scrShow;
    },
    reset() {
      let i, j;
      for (i = 0; i < this.scrList.length; i++) {
        for (j = 0; j < this.scrList[i].class.length; j++) {
          if (this.scrList[i].class[j].isSelected === true) {
            this.scrList[i].class[j].isSelected = false;
          }
        }
      }
      for (i = 0; i < this.cusList.length; i++) {
        this.cusList[i].isShow = true;
      }
      this.ifChoose = true;
      this.followChsVal = [];
    },
    // 筛选-按钮点击高亮事件
    cutTabClick(item) {
      //然后通过这个属性判断是否选中点亮和取消
      item.isSelected = !item.isSelected;
    },
    // 筛选-跟进人列表-弹窗
    toFollow() {
      this.followShow = true;
    },
    // 筛选-上次跟进人列表-弹窗

    // 筛选-重置-重置已经选中标签

    // 筛选-筛选内容提交
    screen() {
      this.selectList = [];
      let i, j;
      //读取选中的标签
      for (i = 0; i < this.scrList.length; i++) {
        for (j = 0; j < this.scrList[i].class.length; j++) {
          if (this.scrList[i].class[j].isSelected === true) {
            this.selectList.push(
              this.scrList[i].name + ":" + this.scrList[i].class[j].name
            );
          }
        }
      }
      this.selectList.push(
        this.followChsVal.name + ":" + this.followChsVal.val
      );
      console.log(this.selectList);

    },
  }
}
</script>

<style lang="less" scoped>
.scrpop {
  width: 90%;
}
// 筛选按钮
.scrbtn {
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  background-color: #f5f5f5;
}
.actscrbtn {
  background-color: #4876f1;
  margin: 5px 2% 10px 5%;
  padding: 0px;
  height: 30px;
  width: 85px;
  font-size: 12px;
  color: #ffffff;
}
//筛选分类name
.scrname {
  margin-left: 20px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 6px;
}
//筛选提交按钮
.scrfirbtn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
  background-color: #4876f1;
}
//筛选重置按钮
.scrresbtn {
  border-radius: 5px;
  margin: 20px 2% 10px 5%;
  width: 40%;
}
</style>
