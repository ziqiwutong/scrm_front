<template>
  <div class="container">
    <HeaderNavBar :title="navTitle" @returnClick="onClickLeft"/>
    <div class="article-container">
      <h2>{{ title }}</h2>
      <div class="article-msg">
        <p>{{ author }}</p>
        <p>{{ accountName }}</p>
        <p>{{ date }}</p>
      </div>
      <div class="article-msg"><p>本文转载自:&nbsp;<a :href="articlePower">{{ accountName }}</a></p>
      </div>
      <div v-html="article" class="article"></div>
    </div>
    <van-dialog v-model="showDialog" title="请选择商品" show-cancel-button
                @confirm="insertProduct" confirm-button-color="#178bf6">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getProductList"
      >
        <van-checkbox-group v-model="checkResultT" class="checkList" ref="checkboxGroup">
          <van-cell-group class="cellList" id="cellList">
            <van-cell
              clickable
              :key="index"
              @click="toggle(index,item)"
              v-for="(item, index) in list"
            >
              <template #right-icon>
                <van-checkbox :name="item.id" ref="checkboxes" checked-color="#6600ff"/>
              </template>
              <div class="list">
                <div class="left">
                  <van-image
                    width="50"
                    height="50"
                    :src="item.productImage"
                  />
                </div>
                <div class="right">
                  <p class="readers">{{ item.productName }}</p>
                </div>
              </div>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </van-list>
    </van-dialog>
    <!--    <Product2poster :key="'poster'+index" v-for="(item,index) in createDom"-->
    <!--                    :posterWrapId="item.posterWrapId"-->
    <!--                    :productName="item.productName"-->
    <!--                    :productImg="item.productImg"-->
    <!--                    :qrcodeId="item.qrcodeId"-->
    <!--                    :productLink="item.productLink"-->
    <!--                    @imgUrl="getPost"/>-->
    <div class="article-ope">
      <div class="addPoster" @click="editArticle">添加产品</div>
      <div class="saveArticle" @click="saveArticle">保存编辑</div>
    </div>
  </div>
</template>

<script>
/*
* author:sweet
* create Date:2021年10月30日
* description:转载公众号文章详情页
* */
import qs from 'qs'// axios参数包
import HeaderNavBar from "../../component/HeaderNavBar";
import Product2poster from "../../component/Product2poster";
import {getUrl} from "../../../utils/replaceUrl";

export default {
  name: "repArticleDetail",
  components: {HeaderNavBar},
  data() {
    return {
      navTitle: "文章详情",
      getQrcodeId: 'seee',
      article: '',
      title: '',
      author: '',
      accountName: '',
      date: '',
      articlePower: '',
      showDialog: false,
      checkResult: [],
      checkResultT: [],
      productList: [],
      singleAddProduct: [],
      list: [],
      loading: false,
      finished: false,
      pageProps: {
        pageNum: 1,
        pageSize: 20
      },
      imgUrl: "",
      productName: '',
      productImg: '',
      frontPage: '',
      articleId: '',
      shareId: '',
      ifShowShareMan: false,
      distributeUrl: '',
      productCount: 0
    }
  },
  created() {
    this.renderPage();
    this.frontPage = this.$route.query.type;
    if (this.frontPage == '1') {
      this.articleId = this.$route.query.articleId;
      this.shareId = this.$route.query.shareId;
      this.ifShowShareMan = this.$route.query.ifShowShareMan;
    }
    this.getDistributeUrl();
  },
  methods: {
    renderPage() {
      this.article = this.$store.state.repArticleDetail.articleContext;
      this.title = this.$store.state.repArticleDetail.articleTitle;
      this.author = this.$store.state.repArticleDetail.articleAuthor;
      this.accountName = this.$store.state.repArticleDetail.articleAccountName;
      this.articlePower = this.$store.state.repArticleDetail.articlePower;
      this.$nextTick(() => {
        this.adjustSize();
      })
    },
    // 返回按钮
    onClickLeft() {
      if (this.frontPage == '0') {
        this.$router.push("/reArticleDes");
      } else {
        this.$router.push({
          name: 'articleDetail',
          query: {
            articleid: this.articleId,
            shareid: this.shareId,
            ifshowshareman: this.ifShowShareMan
          }
        });
      }
    },
    // 显示插入图片的弹窗
    editArticle() {
      this.list = [];
      this.singleAddProduct = [];
      this.showDialog = true;
      this.pageProps.pageNum = 1;
      this.getProductList();
    },
    // 在弹窗中加载产品列表
    async getProductList() {
      let url = JSON.parse(getUrl()).contextShare.getWmProduct;
      let getData = {
        currentPage: this.pageProps.pageNum++,
        pageCount: this.pageProps.pageSize
      }
      const result = (await this.$http.get(url, {params: getData})).data.data
      if (result.length == 0) {
        // 已加载全部数据
        this.finished = true;
        this.$toast('已加载全部数据！');
      }
      for (let i = 0; i < result.length; i++) {
        this.list.push(result[i]);
      }
      // 加载状态结束
      this.loading = false;
    },
    // 调整文章尺寸
    adjustSize() {
      let imgArray = document.getElementsByTagName('img');
      if (document.querySelector('#js_pc_qr_code')) {
        let qrCodeEle = document.querySelector('#js_pc_qr_code');
        qrCodeEle.setAttribute('style', 'display:none;');
      }
      for (let index = 0; index < imgArray.length; index++) {
        if (imgArray[index].src.startsWith("https://mmbiz.qpic.cn")) {
          let dataSrc = imgArray[index].getAttribute('data-src');
          let newValue = dataSrc.replace("https://mmbiz.qpic.cn", "/wxResource");
          imgArray[index].setAttribute('data-src', newValue);
          imgArray[index].src = newValue;
        }
        if (imgArray[index].src.startsWith("http://mmbiz.qpic.cn")) {
          let dataSrc = imgArray[index].getAttribute('data-src');
          let newValue = dataSrc.replace("http://mmbiz.qpic.cn", "/wxResource");
          imgArray[index].setAttribute('data-src', newValue);
          imgArray[index].src = newValue;
        }
      }
    },
    // 复选框触发器
    toggle(index, item) {
      this.$refs.checkboxes[index].toggle();
      if (!this.$refs.checkboxes[index].checked) {// 选中时才加入数组
        let arrayItem = {
          productId: item.id,
          productName: item.productName,
          productImg: item.productImage,
          productLink: item.productLink
        }
        this.singleAddProduct.push(arrayItem);
        this.checkResult.push(arrayItem);
        this.productList.push(arrayItem.productId);
      } else {// 取消选中时需要从数组中删除这个元素
        for (let i = 0; i < this.checkResult.length; i++) {
          if (this.$refs.checkboxes[index].name === this.checkResult[i].productName) {// 表示数组中已经有了该元素
            this.checkResult.splice(i, 1);
            this.productList.splice(i, 1);
            this.singleAddProduct.splice(i, 1);
            break;
          }
        }
      }
    },
    // 弹窗关闭前检查
    checkBtn(action, done) {
      if (action === 'confirm') {
        console.log('列表长度：');
        console.log(this.checkResult.length);
        if (this.checkResult.length === 0) {
          this.$toast("请选择商品！");
          done(false);
        }
      } else {
        done();
      }
    },
    // 插入产品
    insertProduct() {
      this.$toast.loading({
        message: '产品海报\n生成中...',
        forbidClick: true,
        duration: 0
      });
      //this.checkResult里存的是产品Id
      let productArray = this.singleAddProduct;
      for (let i = 0; i < productArray.length; i++) {
        let item = {
          productName: productArray[i].productName,
          productImg: productArray[i].productImg,
          productLink: this.distributeUrl
        }
        this.article += `<div class="productDiv">
          <p class="productName" style="">产品名称:${item.productName}</p>
          <img class="productImg" style="width: 100%;" src="${item.productImg}">
            </div>`;
      }
      this.closeDialog();
      this.$nextTick(() => {
        this.adjustSize();
        this.addUrlToProduct();
      })
    },
    // 为产品绑定分销链接
    addUrlToProduct() {
      let productUrl = document.querySelectorAll('.productDiv');
      for (let index = this.productCount; index < productUrl.length; index++) {
        productUrl[index].addEventListener('click', () => {
          location.href = this.distributeUrl;
        });
      }
      this.productCount = productUrl.length;
    },
    // 得到产品海报--废弃
    getPost(imgUrl, posterId) {
      let poster = document.getElementById(posterId);
      poster.setAttribute('style', 'display:none');
      this.imgUrl = imgUrl;
      this.article += `<img class="productPoster"
         preview="0" preview-text="描述" style="width: 80%;margin-left: 10%;" src="${this.imgUrl}">`;
      this.$store.commit('updateReqArticleContext', this.article);
      this.imgUrl = "";
      this.$nextTick(() => {
        this.adjustSize();
        this.$previewRefresh();
        this.closeDialog();
      })
    },
    // 强制关闭弹窗
    closeDialog() {
      this.$toast.clear();
      this.$toast.success('生成成功！');
      // this.showDialog = false;
    },
    // 保存编辑
    async saveArticle() {
      if (this.frontPage == '0') {
        this.$store.commit('updateReqArticleContext', this.article);
        this.$store.commit('updateArticleProductList', this.productList);
        this.$router.push('/reArticleDes')
      } else {
        // 向后台发送编辑文章的请求
        let self = this;
        let url = JSON.parse(getUrl()).contextShare.editArticle
        let postData = {
          id: self.articleId,
          articleContext: self.article,
          articleTitle: self.title,
          articleImage: this.$store.state.repArticleDetail.coverImg,
          productIds: this.productList
        }
        const result = (await self.$http.put(url, postData)).data;
        if (result.code == '200') {
          // 清空vuex，减少内存占用
          this.clearArticleMsg();
          this.$toast("编辑成功");
          // 返回上一级页面
          this.$router.push({
            name: 'articleDetail',
            query: {
              articleid: this.articleId,
              shareid: this.shareId,
              ifshowshareman: this.ifShowShareMan
            }
          });
        } else {
          this.$toast("编辑失败！");
        }
      }
    },
    // 清空vuex中的article
    clearArticleMsg() {
      let repArticleDetail = {
        articleContext: '',
        articleTitle: '',
        articleAuthor: '',
        articleAccountName: '',
        articlePower: '',
        coverImg: '',
        productIds: []
      }
      // 清理vuex
      this.$store.commit('updateEditReqArticle', repArticleDetail);
    },
    // 获取分销链接
    async getDistributeUrl() {
      let url = JSON.parse(getUrl()).contextShare.getDistributeUrl;
      let getData = {
        id: 2785775511
      }
      const result = (await this.$http.get(url, {params: getData})).data.data;
      if (result.length > 0) {
        this.distributeUrl = result;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column-reverse;
  overflow-x: hidden;
}

.article-container {
  width: 100%;
  box-sizing: border-box;
  padding-top: 50px;
  padding-left: 2%;
  padding-right: 2%;
  padding-bottom: 3rem;
  flex: 1;
  //background-color: #fafafa;
  //text-align: center;
}

.article {
  font-size: 17px;
  line-height: 1.6em;
  text-align: justify;
  color: #333;
  word-break: break-all;
  box-sizing: border-box;
}

.article /deep/ * {
  max-width: 100% !important;
  box-sizing: border-box;
}

h2 {
  font-weight: 500;
  margin-left: 10px;
}

.article-msg {
  height: 20px;
  display: inline-flex;
  padding-left: 10px;
  //color: #c1c1c1;
  margin-bottom: 10px;
  width: 100%;
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

.editArticle {
  width: 30px;
  height: 30px;
  position: fixed;
  bottom: 100px;
  right: 10px;
  background-color: white;
  border: 1px solid #a9b9b9;
  border-radius: 5px;
}

.editIcon {
  line-height: 30px;
  margin-left: 3px;
  margin-right: 3px;
}

/deep/ .van-dialog__content {
  height: 50vh;
  overflow: auto;
}

.list {
  position: relative;
  display: inline-flex;
  width: calc(100% - 20px);
  height: 50px;
  padding: 10px;
}

.left {
  margin-right: 10px;
}

.article-ope {
  display: inline-flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3rem;
  border-top: 1px solid #f3f3f3;
  background-color: white;
}

.article-ope div {
  width: 50%;
  color: #178bf6;
  line-height: 3rem;
  text-align: center;
}

.addPoster {
  border-right: 1px solid #f3f3f3;
}

.qr_code_pc_outer {
  display: none;
}

/deep/ code {
  display: block;
  max-width: 98%;
}

/deep/ table {
  border-collapse: collapse;
}

/deep/ td, th {
  padding: 8px 10px;
  border: 1px solid #DDD;
}

/deep/ h1 {
  display: none;
}
</style>
