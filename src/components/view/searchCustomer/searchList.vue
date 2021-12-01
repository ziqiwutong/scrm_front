<template>
  <div>
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div v-if="type === 2" class="person-result-list">
      <van-cell v-for="(item,i) in list" :key="i" @click="toResultPage(item)">
        <div v-if="item.source === 'company'">
          <p class="van-ellipsis title">{{ item.customerName + '(企业用户)' }}</p>
          <p class="van-ellipsis desc">{{ item.belongCompany }}</p>
        </div>
        <div v-else>
          <p class="van-ellipsis title">{{ item.name }}</p>
          <p class="van-ellipsis desc">{{ item.snippet }}</p>
        </div>
      </van-cell>
    </div>
    <div v-else class="company-result-list">
      <van-cell v-for="(item,i) in list" :key="i" @click="toResultPage(item)">
        <div v-if="item.source === 'company'">
          <p class="van-ellipsis title">{{ item.customerName + '(企业用户)' }}</p>
          <p class="van-ellipsis desc">{{ item.belongCompany }}</p>
        </div>
        <div v-else>
          <p class="van-ellipsis title">{{ item.name }}</p>
          <p class="van-ellipsis desc">{{ '法人代表:' + item.legalPerson }}</p>
        </div>
      </van-cell>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../component/HeaderNavBar";
import {getUrl} from "../../../utils/replaceUrl";

export default {
  name: "searchList",
  components: {
    HeaderNavBar
  },
  data() {
    return {
      navTitle: '查询结果',
      type: '',
      list: []
    }
  },
  created() {
    let searchValue = this.$route.query.searchMessage;
    this.type = this.$route.query.type;
    this.searchByKey(searchValue, this.type);
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        name: 'searchCustomer',
        params: {
          type: this.type
        }
      })
    },
    async searchByKey(searchValue, type) {
      let url = ''
      if (type === 1) {
        url = JSON.parse(getUrl()).searchCustomer.company;
      } else {
        url = JSON.parse(getUrl()).searchCustomer.personal;
      }
      let getData = {
        keyword: searchValue
      }
      const result = (await this.$http.get(url, {params: getData})).data.data
      for (let i = 0; i < result.length; i++) {
        if (result[i].length > 0) {
          let resultItem = result[i];
          for (let j = 0; j < resultItem.length; j++) {
            if (i === 0) {
              resultItem[j].source = 'company';// 企业个人用户
            } else {
              resultItem[j].source = 'bk';// 百科结果
            }
            this.list.push(resultItem[j]);
          }
        }
      }
      this.$toast('请点击人物查看详情');
    },
    toResultPage(item) {
      this.$router.push({
        name: 'bkIntroduce',
        params: {
          url: item.url
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
p {
  display: block;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}

.person-result-list, .company-result-list {
  margin-top: 50px;
}

.title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #6e6e6e;
}

.desc {
  color: #B8B7B7;
}
</style>
