<template>
  <div>
    <van-popup
      v-model="followShow"
      position="bottom"
      :style="{ height: '100%' }"
      :overlay="false"
      duration="0"
    >
      <van-button class="follow-cancel-btn" @click="folCancel">取消</van-button>
      <van-search
        v-model="followVal"
        placeholder="请输入搜索关键词"
        @search="onFollowSearch"
        @cancel="onFollowSearchCancel"
      />
      <van-cell
        v-for="item in followList"
        :key="item.id"
        @click="followConfirm(item)"
      >
        <!-- 跟进人-跟进人信息 -->
        <van-row v-if="type==1">
          <!-- 跟进人-跟进人头像 -->
          <van-col span="4"
          ><van-image
            round
            width="40"
            height="40"
            :src="item.userIcon"
            v-if="item.userIcon"
          />
            <div v-if="!item.userIcon" class="list-img-none">
              {{ item.username[0] }}
            </div>
          </van-col>
          <!-- 跟进人-跟进人姓名 -->
          <van-col span="6" class="list-content-name"
          ><div class="van-ellipsis">
            {{ item.username }}
          </div></van-col
          >
          <!-- 跟进人-跟进人公司信息 -->
          <van-col offset="2" class="list-content-msg">{{
              item.telephone
            }}</van-col>
        </van-row>
        <van-row v-if="type==2">
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
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "AbbList",
  props: ["type", "val"],
  data() {
    return {
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
    };
  },
  methods: {
    // 跟进人搜素
    onFollowSearch() {
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.getUserList();
    },
    // 跟进人搜索取消
    onFollowSearchCancel() {
      this.followVal = "";
      this.followList = [];
      this.followPageProps.pageNum = 1;
      this.getUserList();
    },
    // 跟进人-选择
    followConfirm(item) {
      if (this.type == 1) {
        let temp = { id: item.id, name: item.username };
        this.$emit("onCh", temp);
      } else if (this.type == 2) {
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
        if (this.followVal != "") {
          url += "?name=" + this.followVal;
        }
        const res = await this.$http.get(url, {
          params: {
            currentPage: this.followPageProps.pageNum,
            pageCount: this.followPageProps.pageSize,
          },
        });

        let userNum = res.data.totalCount;
        if (userNum != 0)
          for (let i = 0; i < this.followPageProps.pageSize; i++) {
            this.followList.push(res.data.data[i]);
            if (this.followList.length >= userNum) {
              this.finished = true;
              this.followPageProps.pageNum = 1;
              break;
            }
          }
        if (this.followList.length >= userNum) this.finished = true;
        else {
          this.followPageProps.pageNum++;
          this.getUserList();
        }
      }
      // 客户列表
      else if (this.type == 2) {
        let url = "/api/se/customer/query";
        if (this.followVal != "") {
          url += "?customerName=" + this.followVal;
        }
        const res = await this.$http.get(url, {
          params: {
            currentPage: this.followPageProps.pageNum,
            pageCount: this.followPageProps.pageSize,
          },
        });

        let userNum = res.data.totalCount;
        if (userNum != 0)
          for (let i = 0; i < this.followPageProps.pageSize; i++) {
            this.followList.push(res.data.data[i]);
            if (this.followList.length >= userNum) {
              this.finished = true;
              this.followPageProps.pageNum = 1;
              break;
            }
          }
        if (this.followList.length >= userNum) this.finished = true;
        else {
          this.followPageProps.pageNum++;
          this.getUserList();
        }
      } else {
      }
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
//跟进人-取消
.follow-cancel-btn {
  border: none;
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
</style>
