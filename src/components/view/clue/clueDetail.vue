<template>
  <div class="container">
    <!--返回箭头-->
    <div class="back_arrow" @click="toClueList">
      <van-icon name="arrow-left"/>
      <div>返回</div>
    </div>
    <!--竖向进度条-->
    <div class="Step">
      <van-steps direction="vertical"  :active="list.length" active-color="#cccccc">
        <van-step >
          <template v-slot:inactive-icon>
            <van-icon class-prefix="icon-third" name="circle-company" color="#3490f4"/>
          </template>
          <p>线索</p>
          <p>{{ list[0].clueName }}</p>
          <div class="edit" @click="toEditClue(list[0].id)">
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
          <template v-slot:inactive-icon>
            <van-icon class-prefix="icon-third" name="circle-company" color="#3490f4"/>
          </template>
          <p>更新</p>
          <p>{{ item.clueNotes }}</p>
          <div class="edit" @click="toEditClueStatus(item.id)">
            <van-button plain type="info" size="mini" class="editBtn2">编辑</van-button>
          </div>
          <div class="cluedetail">
            <p>录入人：{{ item.clueEditor }}</p>
            <p>时 间： {{ item.createTime }}</p>
          </div>
        </van-step>
      </van-steps>
      <!--转换为商机-->
      <div class="toBizOpp">
        <van-button round size="normal" type="info" @click="toBizOpp"> 转换为商机</van-button>
      </div>
      <!--删除线索-->
      <div class="deleteClue">
        <van-button plain round size="normal" type="info" @click="clueDelete1"> 删除线索</van-button>
      </div>
      <!--新增线索更新-->
      <div class="addUpdate">
        <van-image
          width="21"
          height="20"
          :src="require('./add.png')"
          @click="addClueStatus()"
        />
      </div>
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
      id:'',
      clueId:'',
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
  updated() {
    this.onLoad();
  },
  methods: {
    toClueList() {
      this.$router.push('/clueList');
    },
    toEditClueStatus(id) {
      // 带着id去请求编辑线索更新页
      this.$router.push({
        path: '/editClueStatus',
        query: {
          id: id,
        }
      });
    },
    toEditClue(id) {
      // 带着id去请求编辑线索页
      this.$router.push({
        path: '/editClue',
        query: {
          id: id,
        }
      });
    },
    addClueStatus() {
      // 带着id去请求编辑线索页
      this.$router.push({
        path: '/addClueStatus',
        query: {
          clueId: this.clueId,
        }
      });
    },
    async onLoad() {
      let url = "/api/se/clue/queryClueStatus";
      let postData = {clueId:this.$route.query.clueId};
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
    clueDelete1() {
      this.$dialog.confirm({
        message: '确定删除吗？',
        confirmButtonColor: '#4876F1',
      }).then(() => {
        this.sendDelete();
      });
    },
    async sendDelete() {
      let url = "/api/se/clue/deleteClue";
      let postData = {
        id: this.$route.query.clueId,
      }
      const result1 = (await this.$http.post(url, qs.stringify(postData))).data;
      if (result1.code === 200) {
        Toast('线索删除成功');
        this.$router.push('clueList');
      } else
        Toast('线索删除失败,错误码' + result1.code);
    },
    toBizOpp() {
      this.$dialog.confirm({
        message: '确定转换为商机吗？',
        confirmButtonColor: '#4876F1',
      }).then(() => {
        this.sendToBizOpp();
      });
    },
    async sendToBizOpp() {
      let url = "/api/se/clue/toBizOpp";
      let postData = {
        id: this.id
      }
      const result1 = (await this.$http.post(url, qs.stringify(postData))).data;
      if (result1.code === 200) {
        Toast('线索转换商机成功');
        this.$router.push('clueList');
      } else
        Toast('线索转换商机,错误码' + result1.code);
    },
  },
  created() {
    this.onLoad();
    this.clueId = this.$route.query.clueId;
  }
}
</script>

<style lang="less" scoped>
.back_arrow {
  bclue-width: 0px;
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
  bottom: -55px;
  left: 40px;
}

.deleteClue {
  position: absolute;
  bottom: -55px;
  left: 220px;
  width:50%;
}

.addUpdate {
  position: absolute;
  bottom: -10px;
  left: 9px;
}

.van_step {
  width:295px;
}
</style>
