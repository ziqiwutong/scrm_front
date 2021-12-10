<template>
  <div>
    <van-popup
      v-model="followShow"
      position="bottom"
      :style="{ height: '100%' }"
      :overlay="false"
      :lock-scroll="false"
      duration="0"
    >
      <!--   此处两个button添加的native-type是为了防止点击后将vantage的表单组件自动提交，
             详情见vantage官网 https://youzan.github.io/vant/#/zh-CN/form 最下方的常见问题  -->
      <van-row>
        <van-col>
          <van-button
            class="follow-cancel-btn"
            @click="folCancel"
            native-type="button"
            >取消</van-button
          ></van-col
        >
        <van-button
          class="follow-cancel-btn1"
          @click="addNewCus"
          v-show="type == 3"
          native-type="button"
          >新建客户</van-button
        >
      </van-row>
      <van-popup
        v-model="addCus"
        position="bottom"
        :overlay="false"
        duration="0"
      >
        <AddForm :type="1" v-show="addCus" @returnClick="onAddCancel" />
      </van-popup>
      <!-- <AddForm :type="1" v-show="addCus" @returnClick="onAddCancel" /> -->
      <van-search
        v-model="followVal"
        placeholder="请输入搜索关键词"
        @search="onFollowSearch"
        @cancel="onFollowSearchCancel"
        v-if="this.type != 1"
      />
      <van-cell v-if="this.type == 1">
        部门:
        <SelectTree
          :props="props"
          :options="optionData"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"
        />
        <van-button @click="getUser" class="depart-confirm">确定</van-button>
      </van-cell>
      <van-list
        v-model="abbloading"
        :finished="abbfinished"
        finished-text="没有更多了"
        @load="getUserList"
      >
        <van-cell
          v-for="item in followList"
          :key="item.id"
          @click="followConfirm(item)"
        >
          <!-- 跟进人-跟进人信息 -->
          <van-row v-if="type == 1">
            <!-- 跟进人-跟进人头像 -->
            <van-col span="4"
              ><van-image
                round
                width="40"
                height="40"
                :src="item.avatar"
                v-if="item.avatar"
              />
              <div v-if="!item.avatar" class="list-img-none">
                {{ item.name[0] }}
              </div>
            </van-col>
            <!-- 跟进人-跟进人姓名 -->
            <van-col span="6" class="list-content-name"
              ><div class="van-ellipsis">
                {{ item.name }}
              </div></van-col
            >
            <!-- 跟进人-跟进人公司信息 -->
            <van-col offset="2" class="list-content-msg">{{
              item.duty
            }}</van-col>
          </van-row>
          <van-row v-if="type == 2">
            <!-- 跟进人-跟进人头像 -->
            <van-col span="4"
              ><van-image
                round
                width="40"
                height="40"
                :src="item.customerIcon"
                v-if="item.customerIcon"
              />
              <div v-if="!item.customerIcon" class="list-img-none">
                {{ item.customerName[0] }}
              </div>
            </van-col>
            <!-- 跟进人-跟进人姓名 -->
            <van-col span="6" class="list-content-name"
              ><div class="van-ellipsis">
                {{ item.customerName }}
              </div></van-col
            >
            <!-- 跟进人-跟进人公司信息 -->
            <van-col offset="2" class="list-content-msg">{{
              item.telephone
            }}</van-col>
          </van-row>
          <van-row v-if="type == 3">
            <!-- 跟进人-跟进人头像 -->
            <van-col span="4"
              ><van-image
                round
                width="40"
                height="40"
                :src="item.customerIcon"
                v-if="item.customerIcon"
              />
              <div v-if="!item.customerIcon" class="list-img-none">
                {{ item.customerName[0] }}
              </div>
            </van-col>
            <!-- 跟进人-跟进人姓名 -->
            <van-col span="6" class="list-content-name"
              ><div class="van-ellipsis">
                {{ item.customerName }}
              </div></van-col
            >
            <!-- 跟进人-跟进人公司信息 -->
            <van-col offset="2" class="list-content-msg">{{
              item.telephone
            }}</van-col>
          </van-row>
        </van-cell>
      </van-list>
    </van-popup>
  </div>
</template>

<script>
import AddForm from "./AddForm.vue";
import SelectTree from "./SelectTree.vue";
import { Toast } from "vant";
export default {
  name: "AbbList",
  components: {
    AddForm,
    SelectTree,
  },

  props: ["type", "val"],
  data() {
    return {
      // 用户部门
      userDepartment: {
        departmentId: "",
        departmentName: "",
      },
      abbloading: false,
      abbfinished: false,
      active: 0,
      preid: 0,
      addCus: false,
      // 筛选-跟进人-弹窗
      followShow: true,
      // 筛选-跟进人-搜索
      followVal: "",
      // 筛选-跟进人列表
      followList: [],
      // 跟进人加载-分页
      followPageProps: {
        pageNum: 1,
        pageSize: 10,
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      valueId: 0,
      props: {
        // 配置项（必选）
        value: "id",
        label: "departmentName",
        children: "children",
        // disabled:true
      },
      list: [
        {
          id: 70414,
          parentId: 0,
          leaderMemberId: 0,
          departmentName: "泸州老窖集团有限责任公司",
          subName: "泸州老窖集团有限责任公司",
          type: "1",
          memberCount: 1215,
          haveSub: 1,
          children: null,
          message: "泸州老窖集团有限责任公司",
          createTime: null,
          updateTime: null,
        },
      ],
    };
  },
  computed: {
    /* 转树形数据 */
    optionData() {
      let cloneData = JSON.parse(JSON.stringify(this.list)); // 对源数据深度克隆
      return cloneData.filter((father) => {
        // 循环所有项，并添加children属性
        let branchArr = cloneData.filter(
          (child) => father.id == child.parentId
        ); // 返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //给父级添加一个children属性，并赋值
        return father.parentId == 0; //返回第一层
      });
    },
  },
  methods: {
    onFollowSearch() {
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.abbfinished = false;
      this.abbloading = true;
      this.getUserList();
    },
    // 跟进人搜索取消
    onFollowSearchCancel() {
      this.followVal = "";
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.getUserList();
    },
    getUser() {
      this.followList = [];
      this.preid = 0;
      this.getUserList();
    },
    async getData() {
      let url = "http://118.122.48.47:33333/cms/user/department";
      const res = await this.$http.get(url);
      console.log(res.data.data);
      this.list = res.data.data;
    },
    getValue(value) {
      this.valueId = value;
      console.log(this.valueId);
    },

    addNewCus() {
      this.addCus = true;
    },
    onAddCancel() {
      this.addCus = false;
    },
    // 跟进人-选择
    followConfirm(item) {
      if (this.type == 1) {
        let temp = { id: item.id, name: item.name };
        this.$emit("onCh", temp);
      } else if (this.type == 2) {
        let temp = { id: item.id, name: item.customerName };
        this.$emit("onCh", temp);
      } else if (this.type == 3) {
        let temp = { id: item.id, name: item.customerName };
        this.$emit("onCh", temp);
      }
      this.folCancel();
    },
    // 跟进人-页面取消
    folCancel() {
      this.$emit("returnClick");
    },
    // 获取用户消息
    async getUserList() {
      //用户列表
      if (this.type == 1) {
        let url = "/api/cms/user/query";
        const res = await this.$http.get(url, {
          params: {
            count: 10,
            preId: this.preid,
            departmentId: this.valueId,
          },
        });
        this.abbloading = false;
        const tempList = res.data.data;
        this.cusNum = res.data.totalCount;
        if (tempList.length == 0) {
          // 已加载全部数据
          this.abbfinished = true;
          Toast("已加载全部数据！");
        } else {
          for (let i = 0; i < tempList.length; i++) {
            this.followList.push(tempList[i]);
            if (i == tempList.length - 1) {
              this.preid = tempList[i].id;
            }
          }
          this.getUserList();
        }
      }
      // 客户列表
      else if (this.type == 2) {
        this.abbloading = true;
        let url = "/api/se/customer/query";
        if (this.followVal != "") {
          url += "?like_customerName=" + this.followVal;
        }
        const res = await this.$http.get(url, {
          params: {
            currentPage: this.followPageProps.pageNum++,
            pageCount: this.followPageProps.pageSize,
          },
        });
        this.abbfinished = false;
        this.abbloading = false;
        const tempList = res.data.data;
        this.cusNum = res.data.totalCount;
        if (tempList.length == 0) {
          // 已加载全部数据
          this.abbfinished = true;
          Toast("已加载全部数据！");
        } else {
          for (let i = 0; i < tempList.length; i++) {
            this.followList.push(tempList[i]);
          }
        }
      } else if (this.type == 3) {
        this.abbloading = true;
        let url = "/api/se/customer/query";
        if (this.followVal != "") {
          url += "?like_customerName=" + this.followVal;
        }
        const res = await this.$http.get(url, {
          params: {
            currentPage: this.followPageProps.pageNum++,
            pageCount: this.followPageProps.pageSize,
          },
        });

        this.abbloading = false;
        const tempList = res.data.data;
        this.cusNum = res.data.totalCount;
        if (tempList.length == 0) {
          // 已加载全部数据
          this.abbfinished = true;
          Toast("已加载全部数据！");
        } else {
          for (let i = 0; i < tempList.length; i++) {
            this.followList.push(tempList[i]);
          }
        }
      }
    },
    // 判断状态
    judgeState() {
      if (this.type == 1) {
        this.getData();
      } else if (this.type == 2) {
        this.getUserList();
      } else if (this.type == 3) {
        this.getUserList();
      }
    },
  },
  created() {
    this.judgeState();
  },
};
</script>

<style lang="less" scoped>
//跟进人-取消
.follow-cancel-btn {
  border: none;
}
.follow-cancel-btn1 {
  border: none;
  margin-left: 55%;
}

//客户姓名
.list-content-name {
  font-size: 15px;
}
.list-content-msg {
  font-size: 12px;
  color: #6e6f74;
  margin-top: 4px;
}
.list-img-none {
  width: 40px;
  height: 40px;
  background-color: #4876f1;
  border-radius: 50%;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  color: #ffffff;
  text-align: center;
  line-height: 40px;
  font-size: 15px;
}
.follow-addcus-btn {
  margin-left: 60%;
  border: none;
}
.depart-confirm {
  margin-left: 5%;
  height: 100%;
  margin-top: 0%;
  width: 18%;
}
</style>
