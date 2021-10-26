<template>
  <div class="container">
    <!--返回箭头-->
    <div class="back_arrow" @click="toClueList">
      <van-icon name="arrow-left"/>
      <div>返回</div>
    </div>
    <!--竖向进度条-->
    <div class="Step">
      <van-steps direction="vertical" :active="0" active-color="#3D7AF5">
        <van-step >
          <p>线索</p>
          <p>{{ list[0].clueName }}</p>
          <div class="edit" @click="toEditClueStatus">
            <van-button plain type="info" size="mini" class="editBtn1">编辑</van-button>
          </div>
          <div class="cluedetail">
            <p>录入人：{{ list[0].clueEditor }}</p>
            <p>发现人：{{ list[0].clueDiscover }}</p>
            <p>责任人：{{ list[0].clueResponsible }}</p>
            <p>时 间： {{ list[0].clueDate }}</p>
          </div>
        </van-step >
        <van-step v-for="(item,i) in list.slice(1)"  :key="i" class="van_step">
          <p>更新</p>
          <p>{{ item.clueNotes }}</p>
          <van-button plain type="info" size="mini" class="editBtn2">编辑</van-button>
          <div class="cluedetail">
            <p>录入人：{{ item.clueEditor }}</p>
            <p>时 间： {{ item.createTime }}</p>
          </div>
        </van-step>
      </van-steps>
    </div>
    <!--转换为商机-->
    <div class="toBizOpp">
      <van-button round size="normal" type="info"> 转换为商机</van-button>
    </div>
    <!--删除线索-->
    <div class="deleteClue">
      <van-button plain round size="normal" type="info"> 删除线索</van-button>
    </div>
    <!--新增线索更新-->
    <div class="addUpdate">
      <van-image
        width="21"
        height="20"
        :src="require('./add.png')"
      />
    </div>
  </div>

</template>

<script>
import {Toast} from "vant";
import qs from 'qs'// axios参数包
export default {
  name: "clueDetail",
  data() {
    return {
      active: 1,
      list: [
        {
          clueName:'',
          clueDiscover:'',
          clueResponsible:'',
          clueDate:''
        }
      ],
    };
  },
  methods: {
    toClueList() {
      this.$router.push('/clueList');
    },
    toEditClueStatus() {
      this.$router.push('/editClueStatus');
    },
    async onLoad() {
      let url = "/api/queryClueStatus";
      let postData = {};
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      this.list = [];
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
    },
    showShareDialog() {
      this.showShare = true
    },
    onCancel() {
      this.show = false;
    },
    ifShowDialog() {
      this.show = true;
    },
  },
  created() {
    this.onLoad();
  }
}
</script>

<style lang="less" scoped>
.back_arrow {
  border-width: 0px;
  position: absolute;
  left: 5px;
  top: 13px;
  width: 30px;
  height: 30px;
}

.back_arrow div {
  position: fixed;
  top: 10px;
  left: 25px
}

.Step {
  position: absolute;
  top: 40px;
  left: 12px;
}

.Step p {
  font-size: 14px;
  color: #000000;
  width: 225px;
  margin: 2px 0;
}

.editBtn1 {
  position: absolute;
  right: 0px;
  top: 20%;
}

.editBtn2 {
  position: absolute;
  right: 0px;
  top: 25%;
}

.cluedetail {
  margin: 10px 0;
}

.cluedetail p {
  margin: 0 0;
  color: #929396;
}

.toBizOpp {
  position: absolute;
  top: 500px;
  left: 40px;
}

.deleteClue {
  position: absolute;
  top: 500px;
  left: 250px;
}

.addUpdate {
  position: absolute;
  top: 430px;
  left: 20px;
}

.van_step {
  width:295px;
}
</style>
