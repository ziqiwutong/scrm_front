<template>
  <div>
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div style="LEFT: 0px; POSITION: absolute; TOP: 50px" align=center>
      <iframe :src="url" frameBorder=0 style="width:100vw;height:100vh ;"
              ALLOWTRANSPARENCY="true"></iframe>
    </div>
  </div>
</template>

<script>
import HeaderNavBar from "../../component/HeaderNavBar";

export default {
  name: "bkIntroduce",
  components: {
    HeaderNavBar
  },
  data() {
    return {
      navTitle: '百度百科',
      url: ''
    }
  },
  created() {
    this.url = this.$route.params.url;
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        name: 'searchList',
        params: {
          type: 2,
          searchMessage:this.$route.params.searchMessage
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
