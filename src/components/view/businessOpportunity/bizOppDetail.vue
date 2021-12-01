<template>
  <div>
    <!--返回箭头-->
    <div class="background">
      <van-button class="back_arrow" icon="arrow-left" @click="toBoList()">
        返回
      </van-button>
    </div>
    <div class="stage-list">
      <div
        v-for="(item, index) in stageResult"
        class="stage">
        <div v-if="followStageList[index] === stageResult[index]" class="active-stage-left"></div>
        <div v-else class="stage-left"></div>

        <div v-if="followStageList[index] === stageResult[index]" class="active-stage-middle"> {{ item }} </div>
        <div v-else class="stage-middle"> {{ item }} </div>

        <div v-if="followStageList[index] === stageResult[index]" class="active-stage-right"></div>
        <div v-else class="stage-right"></div>
      </div>
    </div>

    <!--  内容分割线  -->
    <div class="divider"></div>

    <!--  商机详细详细卡片  -->
    <div class="card-block">
      <div class="card">
        <div class="message-line">
          <div class="message-left">商机名称：</div>
          <div class="message-right">成都字节公司定酒20箱</div>
        </div>
        <div class="message-line">
          <div class="message-left">客户名称：</div>
          <div class="message-right">王志文</div>
        </div>
        <div class="message-line">
          <div class="message-left">商机状态：</div>
          <div class="message-right">跟进中</div>
        </div>
        <div class="message-line">
          <div class="message-left">商机创建：</div>
          <div class="message-right">2021-10-12 13:43:49</div>
        </div>
        <div class="message-line">
          <div class="message-left">商机更新：</div>
          <div class="message-right">2021-10-30 09:10:56</div>
        </div>
        <div class="message-line">
          <div class="message-left">商机金额：</div>
          <div class="message-right">5000.55</div>
        </div>
        <div class="message-line">
          <div class="message-left">预计成交日：</div>
          <div class="message-right">2021-11-23</div>
        </div>
        <div class="message-line">
          <div class="message-left">商机录入人：</div>
          <div class="message-right">李琦桢</div>
        </div>
        <div class="message-line">
          <div class="message-left">商机负责人：</div>
          <div class="message-right">王志文</div>
        </div>
        <div class="message-line">
          <div class="message-left">备注：</div>
          <div class="message-right">客户公司团建用酒，酒的度数不要太高，大概订单数量有20箱</div>
        </div>
      </div>
    </div>

    <!--  按钮block  -->
    <div class="button-block">
      <van-button round class="button-edit-bo" type="info" @click="editPageShow = true">编辑商机</van-button>
      <van-button plain round class="button-delete-bo" type="info" @click="deleteBo()">删除商机</van-button>
    </div>







    <van-popup v-model="editPageShow" position="bottom" :style="{ height: '94%' }">
      <div class="navbar"  @click="returnFromEdit()">
        <van-nav-bar
          title="编辑商机"
          left-text="返回"
          left-arrow
        />
      </div>
      <van-form @submit="submitEdit()"  class="addBo">
        <!-- 商机名称 -->
        <van-field
          clearable
          v-model="boName"
          name="boName"
          label="商机名称"
          placeholder="请输入商机名称"
          :rules="[{ required: true, message: '填写不能为空' }]"
        />

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
                @click="toggle(index,item)"
                class="selectableStage"
              >
                <template #right-icon>
                  <van-checkbox :name="item" ref="checkboxes" />
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
        />
        <van-popup v-model="boFollowStageShow" position="bottom">
          <div class="van-picker__toolbar">
            <button type="button" class="van-picker__cancel" @click="boFollowStageShow = false; boFollowStage=''">取消</button>
            <div class="van-ellipsis van-picker__title">选择已跟进的阶段</div>
            <button type="button" class="van-picker__confirm" @click="confirmFollowStage()">确认</button>
          </div>

          <van-radio-group v-model="boFollowStage">
            <van-cell-group>
              <van-cell
                v-for="(item,index) in stageResult"
                clickable
                :key="item"
                :title="item"
                @click="selectFollowStage(index, item)">
                <template #right-icon>
                  <van-radio :name="item" />
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
        <div style="margin: 16px;" class="submit">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </van-popup>

  </div>
</template>

<script>
import {getUrl} from "../../../utils/replaceUrl";
import qs from 'qs'
import {Dialog, Toast} from "vant";

export default {
  name: "bizOppDetail",
  data(){
    return {
      id:1,
      customerId:1001,
      customerName:'李琦桢',
      boName:'超有爱科技责任有限公司有购酒意向',
      boStatus:'跟进中',
      boEditorID: 1004,
      boEditor:'王志文',
      boFullStage: '新客_已加微信_签约协议_已成交_已打尾款_多次成交',
      boFollowStage: '签约协议',
      boAmount:"1000.25",
      boExpectDate:'2021-9-10',
      boResponsibleID: 1004,
      boResponsible:'王志文',
      boNotes:'客户公司团建用酒，酒的度数不要太高，大概订单数量有20箱',

      createTime: '2021-10-12 13:43:49',
      updateTime: '2021-10-30 09:10:56',





      //下面都是弹出编辑页面的变量
      editPageShow: false,
      ifEdit: false,

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
      stageList: ['新客', '已加微信', '产品介绍', '合作模式洽谈', '签约协议', '已成交', '已打首付款', '阶段性付款', '已打尾款', '多次成交'],
      stageResult: [],
      boFullStageString: '',

      /*
      boFollowStage是传递给后端的内容，内容为目前进行到的阶段，
      boFollowStageShow控制选中弹出页的出现
       */
      boFollowStageShow: false,
      followStageList: [],

      /*
      预期商机完成的时间选择的变量，
      boExpectDate存放商机完成时间字符串“yyyy-mm-dd”
      boExpectDateVal存放时间选择表原始的时间格式
      boExpectDateShow弹框是否出现的变量
       */
      boExpectDateVal: '',
      boExpectDateShow: false,

      // 时间-时间最小值
      minDate: new Date(2020, 0, 1),
      // 时间-时间最大值
      maxDate: new Date(2025, 10, 1),
    };
  },
  watch:{
    //判断这些可填数据是否有变化，用来提示用户没有提交
    customerId:'onEditChange',
    boName:'onEditChange',
    boStatus:'onEditChange',
    boFullStage: 'onEditChange',
    boFollowStage: 'onEditChange',
    boAmount:'onEditChange',
    boExpectDate:'onEditChange',
    boResponsibleID: 'onEditChange',
    boNotes:'onEditChange',
  },

  created() {
    this.onLoad();
  },

  methods: {
    onLoad() {
      //处理接收到的数据，将boFullStage转化为stageResult再转化为boFullStageString,
      //stageResult用来转化 编辑商机流程 的选项的状态，boFullStageString用来显示目前的全部流程
      this.stageResult = this.boFullStage.split("_");
      for (let i = 0; i < this.stageResult.length; i++) {
        if (i === 0) {
          this.boFullStageString = this.boFullStageString + this.stageResult[i];
        }else {
          this.boFullStageString = this.boFullStageString + "\n" + this.stageResult[i];
        }

        if (this.stageResult[i] === this.boFollowStage) {
          for (let j = 0; j <= i; j++) {
            this.followStageList[j] = this.stageResult[j];
          }
        }
      }
    },


    toBoList() {
      this.$router.push('/bizOppList');
    },

    async deleteBo() {
      // let url = JSON.parse(getUrl()).bizOppManager.deleteBo;
      let url = '/api/se/businessOpportunity/deleteBizOpp';
      let postData = {
        id: this.id,
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data;
      console.log(result);

      if (result.code === 200) {
        Toast('商机删除成功');
        this.toBoList();
      } else {
        Toast('商机删除失败,错误码' + result.code);
      }
    },

    /*
    在上面的watch部分使用的监听执行函数，用来判断用户是否做出修改，
    如果用户做出修改但是没有提交，需要在最后的返回时提出提示框，提醒用户所做出的改变没有保存
     */
    onEditChange() {
      this.ifEdit = true;
    },

    returnFromEdit() {
      if (this.ifEdit === true) {
        Dialog.confirm({
          title: '退出编辑',
          message: '商机信息修改后未提交',
        })
          .then(() => {
            // 确认
            this.editPageShow=false;
          })
          .catch(() => {
            // 取消
          });
      } else {
        //没有修改可以直接返回
        this.editPageShow=false;
      }
    },

    async submitEdit() {
      // let url = JSON.parse(getUrl()).bizOppManager.editBo;
      let url = '/api/se/businessOpportunity/editBizOpp';
      let postData = {
        id: this.id,
        customerId: this.customerId,
        customerName: this.customerName,
        boName: this.boName,
        boStatus: this.boStatus,
        boEditorID: this.boEditorID,
        boEditor: this.boEditor,
        boFullStage: this.boFullStage,
        boFollowStage: this.boFollowStage,
        boAmount: this.boAmount,
        boExpectDate: this.boExpectDate,
        boResponsibleID: this.boResponsibleID,
        boResponsible: this.boResponsible,
        boNotes: this.boNotes
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data;
      if(result.code === 200) {
        Toast('商机提交成功');
        this.editPageShow=false;

      }else {
        Toast('商机提交失败,错误码' + result.code);
      }
      //防止提交以后还出现确认弹窗
      this.ifEdit = true;
    },

    // 时间录入处理
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

    toggleAll() {
      let length = this.stageList.length;
      for (let i = 0; i < length; i++) {
        this.$refs.checkboxes[i].toggle(true);
      }
    },

    toggle(index, item) {
      this.$refs.checkboxes[index].toggle();

      /*
      当全商机流程编辑过程中把目前的跟进阶段取消了，需要把跟进阶段清空
      因为此处的toggle无论转化的那一个选项是 勾选状态 还是 非勾选状态，
      清空boFollowStage得到的效果是一样的，此处不分选项的勾选状态
       */
      if (item === this.boFollowStage) {
        this.boFollowStage = '';
      }
    },

    //用来判断当前的跟进阶段，选择第一个为“新商机”，最后一个为“已结束”，其它为”进行中“
    selectFollowStage(index, item) {
      this.boFollowStage = item;
      if (index === 0){
        this.boStatus = "新商机";
        Toast("新商机");
      } else if (index === this.stageResult.length-1){
        this.boStatus = "已结束";
        Toast("已结束");
      } else {
        this.boStatus = "跟进中";
        Toast("跟进中");
      }
    },

    confirmEditStage() {
      this.boEditStageShow=false;
      this.boFullStage = "";
      this.boFullStageString = "";
      let stageListLength = this.stageList.length;
      let stageResultLength = this.stageResult.length;
      let tempStage = "";
      let position = 0;

      for (let listCount = 0; listCount < stageListLength; listCount++) {
        for (let resultCount = 0; resultCount < stageResultLength; resultCount++) {
          if (this.stageList[listCount] === this.stageResult[resultCount]) {
            tempStage = this.stageResult[resultCount];
            this.stageResult[resultCount] = this.stageResult[position];
            this.stageResult[position] = tempStage;

            if (0 === position) {
              this.boFullStage = this.boFullStage + this.stageResult[position];
              this.boFullStageString = this.boFullStageString + this.stageResult[position];
            }else{
              this.boFullStage = this.boFullStage + "_" + this.stageResult[position];
              this.boFullStageString = this.boFullStageString + "\n" + this.stageResult[position];
            }
            position++;
            if (position === stageResultLength) {break;}
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
      if (this.boFollowStage==='') {
        Toast("请选择后确认");
      }else {
        Toast("选择成功");
        this.boFollowStageShow = false;
      }
    }

  }
}
</script>

<style scoped>
.back_arrow {
  border: none;
}

/*
stage-list是容纳stage的div，可滑动
*/
.stage-list{
  padding-top: 6vw;
  padding-left: 6vw;
  padding-bottom: 3vw;
  white-space: nowrap;/*文本不会换行，文本会在在同一行上继续*/
  overflow-y:auto;/*可滑动*/
}

.stage {
  height: 10vw;
  background: #eeeeee;
  display: inline-flex;
}

/*
stage即写有阶段的箭头分为两套，
普通的一套就是stage，颜色为浅紫色，表明未激活，即商机的阶段还没有进行
active-stage是已激活，颜色为蓝色，即商机的阶段已经进行
*/
.stage-left {
  width: 0;
  height: 0;
  border-top: 5vw solid #d7e1fc;
  border-bottom: 5vw solid #d7e1fc;
  border-left: 3vw solid #ffffff;
}
.stage-middle {
  width: 27vw;
  height: 10vw;
  background: #d7e1fc;
  text-align: center;
  line-height: 10vw;
  color: #9494D1;
  box-shadow: 0 7px 7px -7px #5E5E5E;
}
.stage-right {
  width: 0;
  height: 0;
  border-top: 5vw solid #ffffff;
  border-bottom: 5vw solid #ffffff;
  border-left: 3vw solid #d7e1fc;
}
.active-stage-left {
  width: 0;
  height: 0;
  border-top: 5vw solid #6b92fc;
  border-bottom: 5vw solid #6b92fc;
  border-left: 3vw solid #ffffff;
}
.active-stage-middle {
  width: 27vw;
  height: 10vw;
  background: #6b92fc;
  text-align: center;
  line-height: 10vw;
  color: #ffffff;
  box-shadow: 0 7px 7px -7px #5E5E5E;
}
.active-stage-right {
  width: 0;
  height: 0;
  border-top: 5vw solid #ffffff;
  border-bottom: 5vw solid #ffffff;
  border-left: 3vw solid #6b92fc;
}

/*
一条灰色的装饰分割线
*/
.divider {
  margin-top: 2vw;
  background: #e6ebf7;
  height: 3vw;
}

/*
这是card的样式，主要是阴影圆角等效果，还有调整card的宽窄和位置
*/
.card-block {
  position: relative;
  padding-top: 6vw;
  padding-bottom: 8vw;
}
.card{
  width: 88%;
  background-color: #f0f4fe;
  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5vw;
  vertical-align: top;
  margin: 0 auto;
  padding-top: 2vw;
  padding-bottom: 8vw;
  box-sizing: border-box;
}

/*
这里是card里面的每行文字的样式
*/
.message-line {
  width: 100%;
  padding-top: 4vw;
  display: inline-flex;
}

.message-left {
  width: 32%;
  padding-left: 6%;
}

.message-right {
  width: 56%;
}

/*
这里是两个编辑和删除按钮的样式
*/
.button-block {
  margin-left: 5%;
  width: 88%;
  display: flex;
  padding-bottom: 4vw;
  justify-content: space-between;
}
.button-edit-bo {
  height: 13vw;
  width: 40vw;
}
.button-delete-bo {
  height: 13vw;
  width: 40vw;
}

/*改变所有van-field的上下间距,该样式在popup中*/
.van-field {
    padding-top: 4vw;
    padding-bottom: 4vw;
}

/*修改van-field里面的label元素距离右边输入栏的距离*/
/deep/ .van-field__label {
    margin-right: 10vw;
}

.submit {
  width:90%;
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
