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
              :key="item.id"
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
    <van-dialog v-model="showGuide" title='' confirm-button-color="#178bf6" @confirm="hideGuide">
      <div class="showGuideDiv">
        <p>微盟ID为空 ! 添加产品需先绑定微盟ID !</p>
        <p>请在首页点击标题栏进入个人中心进行绑定:</p>
        <img src="@/assets/icon/toUserInfoPage.png">
        <p>ps:如果忘记微盟ID，可联系系统管理员进行咨询。</p>
      </div>

    </van-dialog>
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
      articleString: '',
      productString: '',
      product2articleList: [],
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
      productCount: 0,
      showGuide: false
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
  mounted() {
    let timer = setInterval(() => {
      if (document.querySelector('.productDiv')) {
        this.addUrlToProductInit();
        clearInterval(timer);
      }
    }, 500);
  },
  methods: {
    renderPage() {
      this.article = this.$store.state.articleContextTemp;
      this.title = this.$store.state.repArticleDetail.articleTitle;
      this.author = this.$store.state.repArticleDetail.articleAuthor;
      this.accountName = this.$store.state.repArticleDetail.articleAccountName;
      this.articlePower = this.$store.state.repArticleDetail.articlePower;
      this.dealArticle();
      this.$nextTick(() => {
        this.adjustSize();
      })
    },
    // 处理文章，便于新增产品和删除产品,这是一个数据清洗的过程
    dealArticle() {
      let index = this.article.indexOf('<div class="productDiv"');
      if (index === -1) {
        this.articleString = this.article;
        return;
      }
      // 拆分产品和文章
      this.articleString = this.article.substring(0, index);
      this.productString = this.article.substring(index);
      // 再搞一个数组用来存每个产品在productString中的下标，用于把每个产品分离出来
      let newIndex = this.productString.split('<div class="productDiv"');
      // 删除数组的第一个元素，执行split后第一个元素为空
      newIndex.shift();
      newIndex = newIndex.map(function (value) {
        return '<div class="productDiv"' + value;
      });
      this.product2articleList = newIndex;
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
      if (this.$store.state.userMessage.wmId === '') {
        this.showGuide = true;
        return;
      }
      this.list = [];
      this.singleAddProduct = [];
      this.showDialog = true;
      this.pageProps.pageNum = 1;
      this.getProductList();
    },
    // 关闭添加微盟id的弹窗
    hideGuide() {
      this.showGuide = false;
    },
    // 在弹窗中加载产品列表
    async getProductList() {
      let url = JSON.parse(getUrl()).contextShare.getWmProduct;
      let getData = {
        currentPage: this.pageProps.pageNum++,
        pageCount: this.pageProps.pageSize
      }
      const result = (await this.$http.get(url, {params: getData})).data.data
      if (result.length < getData.pageCount) {
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
          productLink: this.distributeUrl
        }
        let product = `<div class="productDiv" id=${arrayItem.productId}>
          <p class="productName" style="">产品名称:${arrayItem.productName}</p>
          <img class="productImg" style="width: 100%;" src="${arrayItem.productImg}">
            </div>`;
        this.product2articleList.push(product);
        this.productList.push(arrayItem.productId);
      } else {// 取消选中时需要从数组中删除这个元素
        for (let i = 0; i < this.productList.length; i++) {
          console.log(item.id + '--' + this.productList[i]);
          console.log(parseInt(item.id) === parseInt(this.productList[i]));
          if (parseInt(item.id) === parseInt(this.productList[i])) {// 表示数组中已经有了该元素
            this.productList.splice(i, 1);
            this.product2articleList.splice(i, 1);
            let parentDiv = document.querySelector('.article');
            let deleteDiv = document.querySelectorAll('.productDiv')[i];
            parentDiv.removeChild(deleteDiv);
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
      let productArray = this.product2articleList;
      let originArticle = this.articleString;
      console.log('hello')
      console.log(productArray);
      for (let i = 0; i < productArray.length; i++) {
        originArticle += productArray[i];
      }
      this.closeDialog();
      // article才是最终要显示在页面上的
      this.article = originArticle;
      // 更新vuex中的临时数据库，防止点击产品链接后回退当前页面时，添加的产品消失
      this.$store.commit('updateTempArticle', this.article);
      this.$nextTick(() => {
        this.adjustSize();
        this.addUrlToProduct();
      })
    },
    // 为产品绑定分销链接
    addUrlToProduct() {
      let productUrl = document.querySelectorAll('.productDiv');
      for (let index = 0; index < productUrl.length; index++) {
        // 先移除，再绑定，防止重复绑定，导致点击事件被重复点击
        productUrl[index].removeEventListener('click', this.productClick);
        productUrl[index].addEventListener('click', this.productClick);
      }
    },
    // 为产品绑定分销链接
    addUrlToProductInit() {
      let productUrl = document.querySelectorAll('.productDiv');
      for (let index = this.productCount; index < productUrl.length; index++) {
        productUrl[index].addEventListener('click', this.productClick);
        // this.checkResultT必须插两个才起作用
        this.checkResultT.push(productUrl[index].id);
        this.checkResultT.push(parseInt(productUrl[index].id));
        this.productList.push(productUrl[index].id);
      }
    },
    // 点击产品执行的跳转函数
    productClick() {
      location.href = this.distributeUrl;
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
        if (parseInt(result.code) == 200) {
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
      this.$store.commit('updateTempArticle', '');
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
    },
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
  z-index: 99;
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

.showGuideDiv {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
}

.showGuideDiv p {
  margin-block-start: 1em;
  margin-block-end: 1em;
}

.showGuideDiv img {
  width: 100%;
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

/deep/ p {
  margin-block-start: 0em;
  margin-block-end: 0em;
}
</style>
