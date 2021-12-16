<template>
<div>
  <AddForm :type=2 @returnClick="formReturn"/>
</div>
</template>

<script>
import AddForm from "../../component/AddForm";

export default {
  name: "articleToAddForm",
  components:{
    AddForm
  },
  methods:{
    formReturn(){
      this.$router.push({
        name: 'readRecord',
        query: {
          articleId: this.$route.query.articleId,
          shareId: this.$route.query.shareId,
          wmId: this.$route.query.wmId,
          ifShowShareMan: this.$route.query.ifShowShareMan
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
