<template>
  <!-- 海报html元素 -->
  <div>
    <div class="posterWrap" :id="getPosterWrapId">
      <img :src="getProductImg" class="backgroundImg">
      <div class="poster-des">
        <div class="poster-des-text">
          <p style="font-size: 1.2rem;font-family: 'fangsong';">{{ getProductName }}</p>
          <p style="font-size: 0.9rem;color: red;font-weight: 600">扫描右侧二维码购买</p>
        </div>
        <div :id="getQrcodeId" :ref="getQrcodeId"></div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'// axios参数包
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'

export default {
  name: 'Product2poster',
  props: [
    'productName',
    'productImg',
    'posterWrapId',
    'qrcodeId',
    'productLink'
  ],
  computed: {
    getProductName() {
      return this.productName
    },
    getProductImg() {
      return this.productImg
    },
    getQrcodeId() {
      return this.qrcodeId
    },
    getPosterWrapId() {
      return this.posterWrapId
    },
    getProductLink() {
      return this.productLink
    }
  },
  data() {
    return {
      imgBase64: "",
    }
  },
  mounted() {
    this.qrcode();
    setTimeout(() => {
      this.createPoster();
    }, 0)
  },
  methods: {
    createPoster() {
      html2canvas(document.querySelector('#' + this.getPosterWrapId), {
        useCORS: true,
        dpi: 300,
        scale: 4
      }).then(async canvas => {
        // document.body.appendChild(canvas);
        this.imgBase64 = canvas.toDataURL("image/png");
        let url = "/fzk/file/pic/base64StrToPic";
        let postData = {
          picBase64Str: this.imgBase64.substring(22),
          picFormat:'.png',
          picType: 'articleImage'
        }
        const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
        this.$emit('imgUrl', result, this.getPosterWrapId);
      });

    },
    qrcode() {
      let qrcodeRef = this.$refs[`${this.getQrcodeId}`];
      let qrCode = new QRCode(qrcodeRef, {
        width: 60,
        height: 60,
        text: this.getProductLink
      })
    }
  }
}
</script>

<style lang="less" scoped>
.posterWrap {
  position: relative;
  width: 80vw;
  margin-left: 10vw;
  margin-right: 10vw;
  box-sizing: border-box;
}

.backgroundImg {
  width: 100%;
}

p {
  display: block;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
}

.poster-des {
  width: 100%;
  padding: 10% 10% 0% 10%;
  box-sizing: border-box;
  position: absolute;
  bottom: 10%;
  left: 5px;
  color: white;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
}

.poster-des-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 10px;
  height: 60px;
}

canvas {
  display: none;
}
</style>
