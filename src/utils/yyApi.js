import '../plugins/esn.min'

const yyApi = {
  yyRegister(data, option) {
    console.log('进入用友调用');
    YYEsnBridge.ready(function () {
      YYEsnBridge.config({
        agentId: data.appId,
        timeStamp: data.timestamp,
        signature: data.signature
      });
      YYEsnBridge.do('shareWithType', {
        'type': option.type,
        'title': option.title,
        'desc': option.desc,
        'pageUrl': option.pageUrl,
        'imageUrl': option.imageUrl,
        'success': function (res) {
        },
        'fail': function (err) {
          console.log('调用失败');
          // alert('调用失败');
        },
        'complete': function (res) {
          console.log('调用完成');
          // alert('调用完成后执行');
        }
      });
    });
  }
}

export default yyApi;
