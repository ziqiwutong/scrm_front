<template>
  <div class="container">
    <!--返回箭头-->
    <div class="back_arrow" @click="toSearchRelationship">
      <van-icon name="arrow-left"/>
      <div>返回</div>
    </div>

    <div class="tab_block">
      <van-tabs v-model="active" swipeable>
        <van-tab v-for="index in tabNum" :title="'关系 ' + index">
          <!--竖向条-->
          <div class="Step">
            <van-steps direction="vertical" :active="listNum[index-1]" active-color="#cccccc">
              <van-step v-for="(item,i) in list[index-1]"  :key="i" class="van_step">
                <template v-slot:inactive-icon>
                  <van-icon class-prefix="icon-third" name="circle-company" color="#3490f4"/>
                </template>
                <p>{{ item.relationCompanyName }}</p>
                <div class="relationshipDetail">
                  <van-icon v-if="item.arrowDirection === '0'" style="position: absolute; top: 52px;left: -22.5px; z-index: 999" class-prefix="icon-third" name="up-arrow" color="#3490f4"/>
                  <van-icon v-else-if="item.arrowDirection === '1'" style="position: absolute; top: 52px;left: -22.5px; z-index: 999" class-prefix="icon-third" name="down-arrow" color="#3490f4"/>
                  <van-icon v-else style=""/>
                  <p>{{ item.arrowDescription }}</p>
                </div>
              </van-step>
<!--              <van-step class="van_step">-->
<!--                <template v-slot:active-icon>-->
<!--                  <van-icon class-prefix="icon-third" name="circle-company" color="#3490f4"/>-->
<!--                </template>-->
<!--                <p>{{ list[index-1][0].relationCompanyName }}</p>-->
<!--              </van-step>-->
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
      tabNum: 2,
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
      let url = "/api/queryRelationship";
      let postData = {
        relationshipA: this.searchData1,
        relationshipB: this.searchData2
      };
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
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

.tab_block {
  padding-top: 40px;
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
  margin: 0 0;
}

.relationshipDetail {
  margin-top: 25px;
  margin-bottom: 15px;
}

.relationshipDetail p {
  margin: 0 0;
  color: #929396;
}

.van_step {
  width:300px;
}

/deep/ .van-step--vertical:not(:last-child)::after{
  border-bottom-width: 0px;
}

</style>
