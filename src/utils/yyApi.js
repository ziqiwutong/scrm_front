import '../plugins/esn.min'

const yyApi = {
  yyRegister(data, option, type) {
    console.log('进入用友调用');
    YYEsnBridge.ready(function () {
      YYEsnBridge.config({
        agentId: data.appId,
        timeStamp: data.timestamp,
        signature: data.signature
      });
      switch (type) {
        case 1:
          YYEsnBridge.do('settingNavBar', {
            'hide': 1,
            'success': function () {
              console.log('调用成功');
            },
            'fail': function () {
              console.log('调用失败');
            },
            'complete': function () {
              console.log('调用完成后执行');
            }
          });
          break;
        case 2:
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
          break;
        case 3:
          YYEsnBridge.do('closeCurrentWebview', {
            'success': function () {
              alert('调用成功');
            },
            'fail': function () {
              alert('调用失败');
            },
            'complete': function () {
              alert('调用完成后执行');
            }
          });
          break;
      }
    });
  }
}

export default yyApi;
