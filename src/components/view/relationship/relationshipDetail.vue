<template>
  <div class="container">
    <!--返回箭头-->
    <div class="background">
      <van-button class="back_arrow" icon="arrow-left" @click="toSearchRelationship">
        返回
      </van-button>
    </div>

    <div class="tab_block">
      <van-tabs v-model="active" swipeable>
        <van-tab v-for="index in tabNum" :title="'关系 ' + index" :key="i">
          <!--竖向条-->
          <div class="Step">
            <van-steps direction="vertical" :active="listNum[index-1]" active-color="#cccccc">
              <van-step v-for="(item,i) in list[index-1]"  :key="i" class="van_step">

                <div class="relationshipDetail">
                  <van-icon v-if="item.direction === 0" style="position: absolute; top: 0px;left: -22.5px; z-index: 10" class-prefix="icon-third" name="up-arrow" color="#3490f4"/>
                  <van-icon v-else-if="item.direction === 1" style="position: absolute; top: 0px;left: -22.5px; z-index: 10" class-prefix="icon-third" name="down-arrow" color="#3490f4"/>
                  <van-icon v-else style=""/>
                  <p>{{ item.label }}</p>
                </div>
                <!--关系中的节点，公司或者个人-->
                <p>{{ item.target }}</p>

                <template v-slot:inactive-icon>
                  <van-icon class-prefix="icon-third" name="circle-company" color="#3490f4"/>
                </template>
              </van-step>
            </van-steps>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <TabBar/>
  </div>

</template>

<script>
import {Toast} from "vant";
import qs from 'qs'
import TabBar from "../../component/TabBar";
// axios参数包
export default {
  name: "relationshipDetail",
  components:{
    TabBar
  },
  data() {
    return {
      active: 0,
      tabNum: 0,
      list: [],
      listNum: [],
      listTailNum: 0,
      searchData1:'',
      searchData2:''
    };
  },
  methods: {
    toSearchRelationship() {
      this.$router.push('/relationship');
    },
    async onLoad() {
      this.searchData1=this.$route.query.searchData1;
      this.searchData2=this.$route.query.searchData2;
      let url = "/api/se/customerRest/relation";
      let postData = {
        firmA: this.searchData1,
        firmB: this.searchData2
      };
      const result = (await this.$http.get(url,{params:postData})).data.data;
      this.tabNum = result.length;
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
        this.listNum.push(result[i].length);
      }
    },
  },
  created() {
    this.onLoad();
    this.$store.commit('updateTabBarActive', 2);
  },
}
</script>

<style lang="less" scoped>
.back_arrow {
  border: none;
}

//step样式
.Step {
  position: absolute;
  top: 70px;
  left: 12px;
}

.Step p {
  font-size: 14px;
  color: #000000;
  width: 225px;
  margin-top: 0px;
  margin-bottom: 70px;
}

.relationshipDetail {
  position: absolute;
  top: -70px;
  margin-top: 25px;
}

.relationshipDetail p {
  margin: 0 0;
  font-size: 13px;
  color: #929396;
}

.van_step {
  width:300px;
}

/deep/ .van-step--vertical:not(:last-child)::after{
  border-bottom-width: 0px;
}

</style>
