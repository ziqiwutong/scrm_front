<template>
  <div class="context-wrap">
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div class="reprint">
      <p class="title">文章链接</p>
      <input v-model="articleUrl" placeholder="请输入"></input>
      <button @click="reprintArticle">转载文章</button>
    </div>
    <div class="introduce">
      <p class="title">如何获取文章链接？</p>
      <p>1. 在微信中打开准备转载的文章，点击屏幕右上角"..."</p>
      <img src="@/assets/icon/introduce01.png">
      <p>2. 选择"复制链接"</p>
      <img src="@/assets/icon/introduce02.png">
      <p>3. 打开SCRM系统，粘贴转换链接</p>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../component/HeaderNavBar";
import qs from 'qs'// axios参数包

export default {
  name: "reprintArticle",
  components: {HeaderNavBar},
  data() {
    return {
      navTitle: "转载公众号文章",
      articleUrl:''
    }
  },
  methods:{
    onClickLeft(){
      this.$router.push("/contextShareList");
    },
    async reprintArticle() {
      this.$toast.loading({
        message: '文章生成中...',
        forbidClick: true,
        duration:0
      });
      let url = "/api/reprintArticle";
      let postData = {
        articleUrl: this.articleUrl
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data
      if (result){// 表示已经拿到数据了
        this.$toast.clear();
      }
    }
  }
}
</script>

<style lang="less" scoped>
.context-wrap{
  position: absolute;
  box-sizing: border-box;
  background-color: #f6f6f6;
  width: 100vw;
  height: 100vh;
  top: 0;
  display: flex;
  flex-direction: column;
}

.reprint{
  margin-top: 44px;
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
}

input{
  width: 100%;
  box-sizing: border-box;
  line-height: 2rem;
  border: 1px solid #e5dddd;
  border-radius: 5px;
  margin-top: 1rem;
  padding-left: 10px;
}

input::-webkit-input-placeholder{
  color: #e5dddd;
}

button{
  margin-top: 10px;
  width: 100%;
  height: 2.5rem;
  background-color: #645fd7;
  color: white;
  border: none;
  border-radius: 5px;
}

.title{
  font-size: 14px;
}

p {
  display: block;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 13px;
  line-height: 2rem;
}

.introduce{
  flex: 1;
  background-color: white;
  padding: 10px;
}

.introduce img{
  width: 100%;
}
</style>
