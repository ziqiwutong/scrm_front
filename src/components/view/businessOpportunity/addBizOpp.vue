<template>

  <div>
    <div class="navbar" @click="returnBack()">
      <van-nav-bar title="新建商机" left-text="返回" left-arrow/>
    </div>

    <van-form @submit="onSubmit">
      <!-- 商机名称 -->
      <van-field
        clearable
        v-model="boName"
        name="boName"
        label="商机名称"
        placeholder="请输入商机名称"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />

      <!-- 点击选择客户 -->
      <van-field
        is-link
        clickable
        readonly
        :value="customerName"
        name="customerName"
        label="目标客户"
        placeholder="点击选择目标客户"
        @click="boSelectCustomerShow = true"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />

      <van-popup
        v-model="boSelectCustomerShow"
        position="bottom"
        :overlay="false"
        duration="0"
      >
        <AbbCusList
          :type="3"
          v-show="boSelectCustomerShow"
          @returnClick="boSelectCustomerShow = false"
          @onCh="getCustomerInfo"
        />
      </van-popup>


      <!-- 点击选择负责人 -->
      <van-field
        is-link
        clickable
        readonly
        :value="boResponsible"
        name="boResponsible"
        label="负责人"
        placeholder="点击选择商机负责人"
        @click="boSelectResponsibleShow = true"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />

      <van-popup
        v-model="boSelectResponsibleShow"
        position="bottom"
        :style="{ height: '100%' }"
        :overlay="false"
        duration="0"
      >
        <AbbList
          :type="1"
          v-show="boSelectResponsibleShow"
          @returnClick="boSelectResponsibleShow = false"
          @onCh="getResponsibleInfo"
        />
      </van-popup>


      <!-- 编辑商机跟进流程 -->
      <van-field
        is-link
        clickable
        readonly
        autosize
        rows="1"
        type="textarea"
        :value="boFullStageString"
        name="boFullStage"
        label="编辑流程"
        placeholder="点击自定义商机流程"
        @click="boEditStageShow = true"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />
      <van-popup v-model="boEditStageShow" position="bottom" @close="confirmEditStage()">
        <div class="van-picker__toolbar">
          <button type="button" class="van-picker__cancel" @click="toggleAll()">全选</button>
          <div class="van-ellipsis van-picker__title">选择所需阶段</div>
          <button type="button" class="van-picker__confirm" @click="confirmEditStage()">确认</button>
        </div>
        <van-checkbox-group v-model="stageResult">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in stageList"
              clickable
              :key="item"
              :title="item"
              @click="toggle(index, item)"
              class="selectableStage"
            >
              <template #right-icon>
                <van-checkbox :name="item" ref="checkboxes"/>
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </van-popup>

      <!-- 跟进阶段 -->
      <van-field
        readonly
        clickable
        is-link
        name="boFollowStage"
        :value="boFollowStage"
        label="跟进阶段"
        placeholder="点击选择目前进行的阶段"
        @click="showFollowStagePop()"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />
      <van-popup v-model="boFollowStageShow" position="bottom">
        <div class="van-picker__toolbar">
          <button type="button" class="van-picker__cancel" @click="boFollowStageShow = false; boFollowStage=''">取消
          </button>
          <div class="van-ellipsis van-picker__title">选择已跟进的阶段</div>
          <button type="button" class="van-picker__confirm" @click="confirmFollowStage()">确认</button>
        </div>

        <van-radio-group v-model="boFollowStage">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in stageResult"
              clickable
              :key="item"
              :title="item"
              @click="selectFollowStage(index, item)"
            >
              <template #right-icon>
                <van-radio :name="item"/>
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </van-popup>

      <!-- 商机金额 -->
      <van-field
        clearable
        v-model="boAmount"
        name="boAmount"
        label="商机金额"
        placeholder="请输入商机金额"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />

      <!--预计成交时间-->
      <van-field
        readonly
        clickable
        is-link
        name="boExpectDatetimePicker"
        :value="boExpectDate"
        label="预计成交时间"
        placeholder="点击选择时间"
        @click="boExpectDateShow = true"
        :rules="[{ required: true, message: '填写不能为空' }]"
      />
      <van-popup v-model="boExpectDateShow" position="bottom">
        <van-datetime-picker
          v-model="boExpectDateVal"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="boExpectDateShow = false"
          @confirm="boExpectDateConfirm(boExpectDateVal)"
        />
      </van-popup>

      <!--   商机备注   -->
      <van-field
        v-model="boNotes"
        rows="2"
        autosize
        label="商机备注"
        type="textarea"
        maxlength="200"
        placeholder="请输入商机备注"
        show-word-limit
      />


      <!-- 提交按钮 -->
      <div class="submit">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>


<script>
import {Toast} from "vant";
import qs from 'qs';
import {getUrl} from "../../../utils/replaceUrl";
import AbbList from "../../component/AbbList";
import AbbCusList from "../../component/AbbCusList";


export default {
  name: "addBizOpp",
  components: {
    AbbList,
    AbbCusList,
  },
  data() {
    return {
      //确定要返回的页面，返回要带上的参数
      returnData: {
        returnPath: "/bizOppList", //默认返回的页面是商机列表

        customerId: "",
        customerName: "",
      },

      customerId: "",
      customerName: "",
      boSelectCustomerShow: false,

      boEditorId: "",
      boEditor: "",

      boResponsibleId: "",
      boResponsible: "",
      boSelectResponsibleShow: false,

      boName: "",
      boAmount: "",
      boStatus: "",
      /*
      编辑商机的跟进流程，
      boEditStageShow编辑弹窗是否显示变量
      stageList储存的是可选的流程阶段，在此处改变即可全局改变相关的选项
      stageResult储存的是用户已经选择的流程阶段，在选择跟进阶段处的单选选项由此生成，
      所以需要先完成自定义流程才可以选择目前跟进到的阶段
      boFullStageString是显示在页面给用户看的内容，boFullStage是传给后端的数据
      boFullStageString阶段之间以'\n'间隔，boFullStage阶段之间以'_'间隔
       */
      boEditStageShow: false,
      stageList: [
        "新客",
        "已加微信",
        "产品介绍",
        "合作模式洽谈",
        "签约协议",
        "已成交",
        "已打首付款",
        "阶段性付款",
        "已打尾款",
        "多次成交",
      ],
      stageResult: [],
      boFullStageString: "",
      boFullStage: "",

      /*
      boFollowStage是传递给后端的内容，内容为目前进行到的阶段，
      boFollowStageShow控制选中弹出页的出现
       */
      boFollowStage: "",
      boFollowStageShow: false,

      /*
      预期商机完成的时间选择的变量，
      boExpectDate存放商机完成时间字符串“yyyy-mm-dd”
      boExpectDateVal存放时间选择表原始的时间格式
      boExpectDateShow弹框是否出现的变量
       */
      boExpectDate: "",
      boExpectDateVal: "",
      boExpectDateShow: false,

      // 时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 时间-时间最大值
      maxDate: new Date(2025, 10, 1),
      //商机的备注信息
      boNotes: "",
    };
  },


  created() {
    //当页面加载的时候从vuex获取当前使用者的信息作为 商机编辑者
    this.boEditorId = this.$store.state.userMessage.userId;
    this.boEditor = this.$store.state.userMessage.username;

    //判断从不同页面跳转的，做不同的操作
    this.returnData.returnPath = this.$route.params.from;
    if (this.returnData.returnPath === "/perinfor") {
      this.customerId = this.$route.params.customerId;
      this.returnData.customerId = this.$route.params.customerId;

      this.customerName = this.$route.params.customerName;
      this.returnData.customerName = this.$route.params.customerName;
    } else if (this.returnData.returnPath === "/clueDetail") {

    }
  },
  methods: {
    //点击返回键跳转来源的页面
    returnBack() {
      if (this.returnData.returnPath === "/perinfor") {
        this.$router.push({
          name: 'perinfor',
          query: {
            cuslist: {
              id: this.returnData.customerId,
              customerName: this.returnData.customerName,
            }
          }
        }
      );

      } else if (this.returnData.returnPath === "/clue") {
        this.$router.push('/clueDetail');
        //做一些数据传输

      } else {
        this.$router.push('/bizOppList');
      }


    },

    //从客户列表组件获取客户信息
    getCustomerInfo(val) {
      this.customerId = val.id;
      this.customerName = val.name;
    },

    //从用户列表组件获取负责人信息
    getResponsibleInfo(val) {
      this.boResponsibleId = val.id;
      this.boResponsible = val.name;
    },

    //获取预计成交时间转化为String形式
    boExpectDateConfirm(date) {
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      this.boExpectDate = y + "-" + m + "-" + d;
      this.boExpectDateShow = false;
      Toast(this.boExpectDate);
    },

    //编辑商机流程的全选按钮
    toggleAll() {
      let length = this.stageList.length;
      for (let i = 0; i < length; i++) {
        this.$refs.checkboxes[i].toggle(true);
      }
    },

    //编辑商机流程的点击事件，点击后切换状态(勾选or不勾选)
    toggle(index, item) {
      this.$refs.checkboxes[index].toggle();

      /*
      当全商机流程编辑过程中把目前的跟进阶段取消了，需要把跟进阶段清空
      因为此处的toggle无论转化的那一个选项是 勾选状态 还是 非勾选状态，
      清空boFollowStage得到的效果是一样的，此处不分选项的勾选状态
       */
      if (item === this.boFollowStage) {
        this.boFollowStage = "";
      }
    },

    selectFollowStage(index, item) {
      this.boFollowStage = item;
      if (index === 0) {
        this.boStatus = "新商机";
      } else if (index === this.stageResult.length - 1) {
        this.boStatus = "已结束";
      } else {
        this.boStatus = "跟进中";
      }
    },

    confirmEditStage() {
      this.boEditStageShow = false;
      this.boFullStage = "";
      this.boFullStageString = "";
      let stageListLength = this.stageList.length;
      let stageResultLength = this.stageResult.length;
      let tempStage = "";
      let position = 0;

      for (let listCount = 0; listCount < stageListLength; listCount++) {
        for (
          let resultCount = 0;
          resultCount < stageResultLength;
          resultCount++
        ) {
          if (this.stageList[listCount] === this.stageResult[resultCount]) {
            tempStage = this.stageResult[resultCount];
            this.stageResult[resultCount] = this.stageResult[position];
            this.stageResult[position] = tempStage;

            if (0 === position) {
              this.boFullStage = this.boFullStage + this.stageResult[position];
              this.boFullStageString =
                this.boFullStageString + this.stageResult[position];
            } else {
              this.boFullStage =
                this.boFullStage + "_" + this.stageResult[position];
              this.boFullStageString =
                this.boFullStageString + "\n" + this.stageResult[position];
            }
            position++;
            if (position === stageResultLength) {
              break;
            }
          }
        }
      }
      Toast("编辑成功");
    },

    showFollowStagePop() {
      if (this.stageResult.length === 0) {
        Toast("请先自定义商机的流程");
      } else {
        this.boFollowStageShow = true;
      }
    },

    confirmFollowStage() {
      if (this.boFollowStage === "") {
        Toast("请选择后确认");
      } else {
        Toast("选择成功");
        this.boFollowStageShow = false;
      }
    },

    //表单提交
    async onSubmit() {
      //POST方式向后端提交数据
      let url = JSON.parse(getUrl()).bizOppManager.addBo;
      let postData = {
        customerId: this.customerId,
        customerName: this.customerName,
        boName: this.boName,
        boStatus: this.boStatus,
        boEditorId: this.boEditorId,
        boEditor: this.boEditor,
        boFullStage: this.boFullStage,
        boFollowStage: this.boFollowStage,
        boAmount: this.boAmount,
        boExpectDate: this.boExpectDate,
        boResponsibleId: this.boResponsibleId,
        boResponsible: this.boResponsible,
        boNotes: this.boNotes,
      };
      const result = (await this.$http.get(url, qs.stringify(postData))).data;

      if (result.code === 200) {
        Toast("商机提交成功");
        this.toBoList();
      } else {
        Toast("商机提交失败,错误码" + result.code);
      }
    },
  },
};
</script>

<style lang="less" scoped>

//改变所有van-field的上下间距
.van-field {
  padding-top: 4vw;
  padding-bottom: 4vw;
}

//修改van-field里面的label元素距离右边输入栏的距离
/deep/ .van-field__label {
  margin-right: 10vw;
}

.submit {
  margin-left: 5vw;
  width: 90%;
  padding-bottom: 6vw;
}

.van-picker__toolbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  height: 44px;
  margin-bottom: 4vw;
}

.selectableStage {
  margin-top: 2vw;
  margin-bottom: 2vw;
}

</style>

