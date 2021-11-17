<template>
  <!-- 海报html元素 -->
  <div>
<!--    <div class="posterWrap" id="posterWrap">-->
<!--      <img :src="productImg" class="backgroundImg">-->
<!--      <div class="posterDes">-->
        <div class="posterDesText">
          <p style="font-size: 1.2rem;font-family: fangsong;">{{ productName }}</p>
          <p style="font-size: 0.9rem;color: red;font-weight: 600">扫描右侧二维码购买</p>
        </div>
        <div :id="qrcode1" :ref="qrcode1"></div>
<!--      </div>-->
<!--    </div>-->
<!--    <img preview="0" preview-text="描述" style="width: 80vw;" :src="imgUrl">-->
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'

export default {
  name: 'sweetTest',
  data() {
    return {
      imgUrl: "",
      qrcode1:"s111",
      productName: '必炫-浓香型白酒',
      productImg: 'https://img1.baidu.com/it/u=2220165727,2771662420&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=499'
      // productImg:'../../../assets/icon/posterTest01.jpg'
    }
  },
  mounted() {
    this.qrcode();
    // this.test();
  },
  methods: {
    test() {
      console.log("hhh");
      html2canvas(document.querySelector("#posterWrap"), {useCORS: true, dpi: 300}).then(canvas => {
        document.body.appendChild(canvas);
        this.imgUrl = canvas.toDataURL("image/png");
        // console.log(this.imgUrl);
        // document.querySelector('#imgDiv').style.display = 'block';

        // let url = "/api/pic/file/base64";
        // let postData = {
        //   title: 'httTest04',
        //   picBase64: this.imgUrl.substring(22)
        // }
        // let postData = {
        //   picName: 'httTest02',
        //   picBase64: this.imgUrl.substring(22),
        //   picType: 'png'
        // }
        // console.log("hello")
        // const result = (await this.$http.post(url, qs.stringify(postData))).data.data;
      });

    },
    qrcode() {
      let qrCode1 = new QRCode(s111, {
        width: 60,
        height: 60,
        text: 'https:///www.baidu.com'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/css/px2vw.scss";
.posterDesText {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 10px;
  height: 60px;
}

p{
  font-size: vw(20);
}
</style>
<style scoped>
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

.posterDes {
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

</style>
