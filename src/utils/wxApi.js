import wx from 'weixin-js-sdk'
//utils.js
const wxApi = {
  wxRegister(data, option) {
    console.log("hello");
    console.log(data)
    console.log(option)
    wx.config({
      debug: true, // 开启调试模式
      appId: data.appId, // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录1
      jsApiList: [
        "updateTimelineShareData", //最新的分享朋友圈
        "updateAppMessageShareData", //最新的分享好友
        "onMenuShareAppMessage", //之前的方法分享朋友圈
        "onMenuShareTimeline"//之前的方法分享好友
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function() {
      // 微信分享的数据
      let shareData = {
        title: option.title, // 分享标题
        link: option.link, // 分享链接
        imgUrl: option.imgUrl, // 分享图标
        desc: option.desc, // 分享描述
        success: function() {
          console.log("hello")
          // 用户成功分享后执行的回调函数
          // option.success();
        },
        fail: function() {
          console.log("失败了")
          // 用户取消分享后执行的回调函数
          // option.error();
        },
        complete: function() {
          console.log("finish")
          // alert('调用结束')
        }
      };

      wx.updateTimelineShareData(shareData);
      wx.updateAppMessageShareData(shareData);

      wx.error(function(_res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
    });
  }
};
export default wxApi;

