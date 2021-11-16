<template>
  <div>
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div class="article-container">
      <van-form @submit="onSubmit">
        <van-field
          v-model="title"
          name="标题"
          label="标题"
          placeholder="标题"
          :rules="[{ required: true, message: '请填写标题' }]"
        />
        <van-field
          v-model="source"
          name="来源/作者"
          label="来源/作者"
          placeholder="来源/作者"
          :rules="[{ required: true, message: '请填写来源/作者' }]"
        />
        <van-field name="uploader" label="封面上传">
          <template #input>
            <van-uploader v-model="uploader" :after-read="uploadPic" :max-count="1"/>
          </template>
        </van-field>
        <van-field name="radio" label="所属文件夹">
          <template #input>
            <van-radio-group v-model="radio" direction="horizontal">
              <van-radio name="1">个人素材库</van-radio>
              <van-radio name="2">企业素材库</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field name="article" label="文章内容">
          <template #input>
            <van-cell title=" " is-link @click="editArticle"/>
          </template>
        </van-field>
        <div style="margin: 30px 0 0 0;">
          <van-button block type="info" native-type="submit">发布</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
/*
* author:sweet
* create Date:2021年10月28日
* description:转载公众号基本信息
* */
import qs from 'qs'// axios参数包
import HeaderNavBar from "../../component/HeaderNavBar";
import {getUrl} from "../../../utils/replaceUrl";

export default {
  name: "reArticleDes",
  components: {HeaderNavBar},
  data() {
    return {
      navTitle: '转载公众号文章',
      title: '',
      source: '来源/作者',
      uploader: [],
      coverImg: '',
      radio: '1'
    }
  },
  mounted() {
    let coverImgOri = this.$store.state.repArticleDetail.coverImg;
    // 提交文章时存储值服务器的封面图
    this.coverImg = coverImgOri;
    // 需要进行处理的coverImg
    let coverImgTDeal = "";
    if (coverImgOri.startsWith("https://mmbiz.qpic.cn")) {
      coverImgTDeal = coverImgOri.replace("https://mmbiz.qpic.cn", "/wxResource");
    } else {
      coverImgTDeal = coverImgOri.replace("http://mmbiz.qpic.cn", "/wxResource");
    }
    this.getBase64Image(coverImgTDeal);
    this.title = this.$store.state.repArticleDetail.articleTitle;
    this.source = this.$store.state.repArticleDetail.articleAccountName;
  },
  methods: {
    onClickLeft() {
      this.clearArticleMsg();
      this.$router.push('/reprintArticle');
    },
    async onSubmit() {
      if (this.coverImg == '') {
        this.$toast("文章封面不能为空！");
        return;
      }
      let url = JSON.parse(getUrl()).contextShare.addArticle;
      /*
      * articleType为1代表个人素材库
      * articleType为0代表企业素材库
      * */
      let postData = {
        productId: '',
        articleContext: this.$store.state.repArticleDetail.articleContext,
        articleTitle: this.title,
        articleImage: this.coverImg,
        articleOriginAuthor: this.$store.state.repArticleDetail.articleAuthor,
        articleAccountName: this.source,
        articlePower: this.$store.state.repArticleDetail.articlePower,
        articleType: 1,
        materialType: this.radio
      }
      const result = (await this.$http.post(url, postData)).data
      if (result.code == '200') {
        this.$toast('创建成功！');
        this.clearArticleMsg();
        this.$router.push('/contextShareList');
      } else {
        this.$toast('创建失败，请重新尝试！');
      }
    },
    // 上传封面至服务器
    async uploadPic() {
      let startIndex = this.uploader[0].content.indexOf("base64");
      let coverImg = this.uploader[0].content.substring(startIndex + 7);
      let url = "/fzk/file/pic/base64StrToPic";
      let postData = {
        picBase64Str: coverImg,
        picFormat: '.png',
        picType: 'articleImage'
      }
      const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
      this.coverImg = result;
    },
    // 清空vuex中的article
    clearArticleMsg() {
      let repArticleDetail = {
        articleContext: '',
        articleTitle: '',
        articleAuthor: '',
        articleAccountName: '',
        articlePower: '',
        coverImg: ''
      }
      // 清理vuex
      this.$store.commit('updateEditReqArticle', repArticleDetail);
    },
    // 微信封面由图片转Base64
    getBase64Image(imgUrl) {
      let self = this;
      let img = imgUrl;
      let image = new Image();
      image.crossOrigin = '';
      image.src = img;
      image.onload = function () {
        let base64 = self.dealWxPic(image);
        let coverImg = {
          content: base64,
          file: {
            lastModified: 1615034705610,
            lastModifiedDate: 1555,
            name: "backgroundImage.jpg",
            size: 10086,
            type: "image/png",
            webkitRelativePath: ""
          },
          message: "",
          status: ""
        }
        self.uploader.push(coverImg);
      }
    },
    dealWxPic(img) {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      let ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      let dataURL = canvas.toDataURL("image/" + ext);
      return dataURL;
    },
    // 编辑文章
    editArticle() {
      this.$router.push({
        name: 'repArticleDetail',
        query: {
          type: '0'
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  width: 100%;
  box-sizing: border-box;
  padding-top: 50px;
  padding-left: 2%;
  padding-right: 2%;
  background-color: #fafafa;
  //text-align: center;
}

/deep/ .van-field__label {
  display: flex;
  align-items: center;
}
</style>
