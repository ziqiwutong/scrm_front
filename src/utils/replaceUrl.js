/*
* author:sweet
* create Date:2021年11月5日
* description:封装接口请求url
* */
export function getUrl() {
  // 线上环境
  let production = {
    baseUrl: 'http://scrm.natapp1.cc/',
    contextShare: {
      queryList: '/fzk/mk/article/queryPage',
      searchByKey: '/fzk/queryArticleByKey',
      addArticle: '/fzk/mk/article/insert',
      articleDetail: '/api/queryArticle',
      deleteArticle: '/api/deleteArticle',
      readRecordList: '/api/allReadRecord',
      queryShareMan: '/api/queryShareMan',
      batchAddCustomer: '/api/batchAddReader'
    }
  }

  // 开发环境
  let developmentT = {
    baseUrl: 'http://scrm.natapp1.cc/',
    userInfo: {
      sendAppCode: '/api/cms/iuap/userInfo',
      yyConfig: '/api/cms/iuap/jsApi',
      saveAppendInfo: '/api/cms/user/saveAppendInfo'
    },
    contextShare: {
      queryList: '/fzk/mk/article/queryPage',
      searchByKey: '/fzk/mk/article/queryByTitle',
      addArticle: '/fzk/mk/article/insert',
      articleDetail: '/fzk/mk/article/detail',
      deleteArticle: '/fzk/mk/article/delete',
      readRecordList: '/fzk/mk/article/shareRecord',
      queryShareMan: '/fzk/mk/article/sharePerson',
      batchAddCustomer: '/api/batchAddReader',
      wxConfig: '/fzk/mk/wx/jsApi',
      editArticle: '/fzk/mk/article/update',
      getWxUserMsg: '/fzk/mk/wx/getWxUserInfo',
      saveWxUserMsg: '/fzk/mk/article/addReadRecord',
      queryProductList: '/api/queryProductList',
      getWmProduct: '/wm/se/weimob/queryProduct',
      getDistributeUrl: '/wm/se/weimob/distributeUrl'
    },
    searchCustomer: {
      personal: '/api/se/customerRest/personal',
      company: '/api/se/customerRest/company',
      companyDetail: '/api/se/customerRest/companyDetail'
    }
  };

  // 开发环境
  let development = {
    baseUrl: 'http://scrm.lzljjt.cn:33333/',
    websocketUrl: 'scrm.lzljjt.cn:33333/mk/article/ws',
    userInfo: {
      sendAppCode: '/api/cms/iuap/userInfo',
      yyConfig: '/api/cms/iuap/jsApi',
      saveAppendInfo: '/api/cms/user/saveAppendInfo',
      getWmId: '/api/cms/user/queryById'
    },
    contextShare: {
      queryList: '/fzk/mk/article/queryPage',
      searchByKey: '/fzk/mk/article/queryByTitle',
      addArticle: '/fzk/mk/article/insert',
      articleDetail: '/fzk/mk/article/detail',
      deleteArticle: '/fzk/mk/article/delete',
      readRecordList: '/fzk/mk/article/shareRecord',
      queryShareMan: '/fzk/mk/article/sharePerson',
      batchAddCustomer: '/api/batchAddReader',
      wxConfig: '/fzk/mk/wx/jsApi',
      editArticle: '/fzk/mk/article/update',
      getWxUserMsg: '/fzk/mk/wx/getWxUserInfo',
      saveWxUserMsg: '/fzk/mk/article/addReadRecord',
      queryProductList: '/api/queryProductList',
      getWmProduct: '/wm/se/weimob/queryProduct',
      getDistributeUrl: '/wm/se/weimob/distributeUrl'
    },
    searchCustomer: {
      personal: '/api/se/customerRest/personal',
      company: '/api/se/customerRest/company',
      companyDetail: '/api/se/customerRest/companyDetail'
    },
    bizOppManager: {
      queryBo: '/api/se/businessOpportunity/queryBizOpportunity',
      queryBoByKey: '/api/se/businessOpportunity/queryBizOppByKey',
      editBo: '/api/se/businessOpportunity/editBizOpp',
      deleteBo: '/api/se/businessOpportunity/deleteBizOpp',
      addBo: '/api/se/businessOpportunity/addBizOpp',
      queryBoDetail: '/api/se/businessOpportunity/queryBizOpportunityDetail',
    },
    searchRelationship: {
      queryRelation: '/api/se/customerRest/relation',
    },
    statistics: {
      article: {
        articleList: '/api/mk/statistics/articleRead',
        articleShareList: '/api/mk/statistics/artSharePerson',
        articleRead: '/api/mk/statistics/articleRead'
      },
      wxRead: {
        userList: '/api/mk/statistics/wx/read',
        userReadDetail: '',
        userReadArticleList: ''
      }
    }
  };

  let env = JSON.stringify(development);
  return env;
}
