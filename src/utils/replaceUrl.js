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
      yyConfig: '/fzk/mk/iuap/jsApi',
      editArticle: '/fzk/mk/article/update',
      getWxUserMsg: '/fzk/mk/wx/getWxUserInfo',
      saveWxUserMsg: '/fzk/mk/article/addReadRecord',
      queryProductList: '/api/queryProductList',
      sendAppCode: '/fzk/mk/iuap/userInfo'
    },
    searchCustomer: {
      personal: '/api/se/customerRest/personal',
      company: '/api/se/customerRest/company',
      companyDetail:'/api/se/customerRest/companyDetail'
    }
  };

  // 开发环境
  let development = {
    baseUrl: 'http://scrm.natapp1.cc/',
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
      yyConfig: '/fzk/mk/iuap/jsApi',
      editArticle: '/fzk/mk/article/update',
      getWxUserMsg: '/fzk/mk/wx/getWxUserInfo',
      saveWxUserMsg: '/fzk/mk/article/addReadRecord',
      queryProductList: '/api/queryProductList',
      sendAppCode: '/fzk/mk/iuap/userInfo'
    },
    searchCustomer: {
      personal: '/api/se/customerRest/personal',
      company: '/api/se/customerRest/company',
      companyDetail:'/api/se/customerRest/companyDetail'
    },
    bizOppManager: {
      queryBizOpportunity: '/sweet/se/businessOpportunity/queryBizOpportunity',
      searchBo: '/sweet/searchBo',
      editBo:'/sweet/editBo',
      deleteBo: '/sweet/deleteBo',
      addBo: '/sweet/addBo',
    }
  };

  let env = JSON.stringify(development);
  return env;
}
