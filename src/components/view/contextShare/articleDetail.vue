<template>
  <div>
    <HeaderNavBar :title="navTitle" />
    <h2>{{ title }}</h2>
    <div class="article-msg">
      <p>{{ author }}</p>
      <p>{{ date }}</p>
    </div>
    <div v-html="article" class="article"></div>
  </div>
</template>

<script>
import HeaderNavBar from "../../component/HeaderNavBar";
export default {
  name: "articleDetail",
  components: {HeaderNavBar},
  data() {
    return {
      navTitle:"文章详情",
      title: "",
      author: "",
      date: "",
      article: ""
    }
  },
  created() {
    this.getArticle();
  },
  methods: {
    async getArticle() {
      let self = this;
      let url = "/api/queryArticle";
      const result = (await self.$http.get(url)).data.data;
      self.title = result.title;
      self.author = result.author;
      self.date = result.date;
      self.article = result.article;
      self.$nextTick(() => {
        let imgArray = document.querySelectorAll('img');
        for (let index = 0; index < imgArray.length; index++) {
          imgArray[index].setAttribute('style', 'max-width:100%;');
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  text-align: center;
}

h2 {
  font-weight: 500;
  margin-top: 50px;
  margin-left: 10px;
}

.article-msg {
  height: 20px;
  display: inline-flex;
  padding-left: 10px;
  color: #c1c1c1;
}

.article-msg p {
  display: inline;
  line-height: 20px;
  margin-block-start: 0px;
  margin-block-end: 0px;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  margin-right: 10px;
}
</style>
