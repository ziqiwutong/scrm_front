<template>
  <iframe :src="url" id="iframe"></iframe>
</template>

<script>
export default {
  name: "articleDetail",
  data() {
    return {
      details: {},
      url: ''
    }
  },
  created() {
    let href = "https://mp.weixin.qq.com/s/7Sf65p-n90QSVqbvLs1Ucw";
    this.getURL(href);
  },
  methods: {
    async getURL(url) {
      let http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      let realurl = http + '//cors-anywhere.herokuapp.com/' + url;
      const result = (await this.$http.get(realurl)).data;
      let html = result;
      console.log(html);
      html = html.replace(/data-src/g, "src")
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '')
        .replace(/https/g, 'http');
      let html_src = 'data:text/html;charset=utf-8,' + html;
      this.url = html_src;
    }
  }
}
</script>

<style scoped>

</style>
