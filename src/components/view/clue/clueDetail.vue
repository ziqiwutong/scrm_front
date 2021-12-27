<template>
  <div class="container">
    <!--返回箭头-->
    <HeaderNavBar @returnClick="toClueList" />
    <!--竖向进度条-->
    <div class="Step">
      <van-steps
        direction="vertical"
        :active="list.length"
        active-color="#cccccc"
      >
        <van-step >
          <template v-slot:inactive-icon>
            <van-icon class-prefix="icon-third" name="circle-company" color="#3490f4"/>
          </template>
          <p>线索</p>
          <div class="cluetitle">
            <p>{{ list[0].clueName }}</p>
            <div  @click="toEditClue(list[0].id)">
              <van-button plain type="info" size="mini">编辑</van-button>
            </div>
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
          <div class="cluetitle">
            <p>{{ item.clueNotes }}</p>
            <div @click="toEditClueStatus(item.id)">
              <van-button plain type="info" size="mini">编辑</van-button>
            </div>
          </div>
          <div class="cluedetail">
            <p>录入人：{{ item.clueEditor }}</p>
            <p>时 间： {{ item.createTime }}</p>
          </div>
        </van-step>
      </van-steps>
      <!--新增线索更新-->
      <div class="addUpdate">
        <van-image
          width="21"
          height="20"
          :src="require('./add.png')"
          @click="addClueStatus()"
        />
      </div>
      <div class="clueBtn">
        <!--转换为商机-->
          <van-button round class="button-edit-bo" type="info" @click="toBizOpp"> 转换为商机</van-button>
        <!--删除线索-->
          <van-button plain round class="button-delete-bo" type="info" @click="clueDelete1"> 删除线索</van-button>
      </div>
    </div>
  </div>

</template>

<script>
import {Toast} from "vant";
import qs from 'qs'
import HeaderNavBar from "../../component/HeaderNavBar";
// axios参数包
export default {
  name: "clueDetail",
  components: {HeaderNavBar},
  data() {
    return {
      id:'',
      clueId:'',
      active: 1,
      boDate:'',
      boStatus: '',
      loading: false,
      finished: false,
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
      const result = (await this.$http.get(url, {params:postData})).data.data
      this.list = [];
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
      console.log("clueId:")
      console.log(this.clueId)
      console.log("clueName:")
      console.log(this.list[0].clueName)
      console.log(this.list[0])
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
      this.$router.push({
        name: 'addBizOpp',
        params: {
          from: '/clueDetail',
          clueName: this.list[0].clueName,
          clueResponsible: this.list[0].clueResponsible,
          clueEditorId: this.list[0].clueEditorId,
          clueDiscoverId: this.list[0].clueDiscoverId,
          clueResponsibleId:this.list[0].clueResponsibleId,
          clueId: this.clueId,
          clueDate: this.list[0].clueDate,
          clueEditor: this.list[0].clueEditor,
          clueDiscover: this.list[0].clueDiscover,
          clueStatus: this.list[0].clueStatus,
          bizOppFlag: this.list[0].bizOppFlag,
        }
      });
    },
  },
  created() {
    this.clueId = this.$route.query.clueId;
    this.onLoad();
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100vw;
  overflow-x: hidden;
  padding-bottom: 1rem;
}

.Step {
  margin-top: 40px;
  margin-left: 12px;
}

.Step p {
  font-size: 14px;
  color: #000000;
  width: 225px;
  margin: 2px 0;
}
.cluetitle{
  display: inline-flex;
  justify-content: space-between;
  width: 80vw;
}

.cluedetail {
  margin: 10px 0;
}

.cluedetail p {
  margin: 0 0;
  color: #929396;
}


.clueBtn{
  //display: inline-flex;
  //justify-content: space-around;
  //width: 100vw;
  margin-left: 3%;
  width: 92%;
  display: flex;
  padding-top: 2vw;
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


.addUpdate {
  margin-left: 12px;
}

.van_step {
  width:295px;
}
</style>
