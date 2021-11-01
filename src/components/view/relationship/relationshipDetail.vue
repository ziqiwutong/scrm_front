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
          <!--竖向进度条-->
          <div class="Step">
            <van-steps direction="vertical" :active="0" active-color="#3D7AF5">
              <van-step v-for="(item,i) in list"  :key="i" class="van_step">
                <p>{{ item.relationCompanyName }}</p>
                <div class="relationshipDetail">
                  <p>{{ item.arrowDescription }}</p>
                </div>
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
      tabNum: 2,
      list: [
        {
          arrowDirection:'1',
          arrowDescription:'1323',
          relationCompanyName:'213123',
          // searchData1:this.$route.query.searchData1

        }
      ],
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
      console.log(this.searchData1);
      console.log('第二个测试的log');
      let url = "/api/queryRelationship";
      let postData = {
        searchData1: this.searchData1,
        searchData2: this.searchData2
      };
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data
      this.list = [];
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
    },
  },
  created() {
    this.onLoad();
    this.$store.commit('updateTabBarActive', 2);
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

.tab_block {
  padding-top: 40px;
}

.Step {
  position: absolute;
  top: 100px;
  left: 12px;
}

.Step p {
  font-size: 14px;
  color: #000000;
  width: 225px;
  margin: 2px 0;
}

.relationshipDetail {
  margin: 10px 0;
}

.relationshipDetail p {
  margin: 0 0;
  color: #929396;
}

.toBizOpp {
  position: absolute;
  top: 500px;
  left: 40px;
}

.van_step {
  width:295px;
}

</style>
