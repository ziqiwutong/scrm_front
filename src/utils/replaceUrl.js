/*
* author:sweet
* create Date:2021年11月5日
* description:封装接口请求url
* */
export function getUrl() {
  // 线上环境
  let production = {
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
    contextShare: {
      queryList: '/fzk/mk/article/queryPage',
      searchByKey: '/fzk/mk/article/queryByTitle',
      addArticle: '/fzk/mk/article/insert',
      articleDetail: '/fzk/mk/article/detail',
      deleteArticle: '/api/deleteArticle',
      readRecordList: '/api/allReadRecord',
      queryShareMan: '/api/queryShareMan',
      batchAddCustomer: '/api/batchAddReader',
      wxConfig:'/wx/jsApi',
      editArticle:'/fzk/mk/article/update'
    }
  };

  // 开发环境
  let development = {
    contextShare: {
      queryList: '/api/queryArticleList',
      searchByKey: '/api/queryArticleByKey',
      addArticle: '/fzk/mk/article/insert',
      articleDetail: '/api/queryArticle',
      deleteArticle: '/api/deleteArticle',
      readRecordList: '/api/allReadRecord',
      queryShareMan: '/api/queryShareMan',
      batchAddCustomer: '/api/batchAddReader',
      wxConfig:'/wx/jsApi'
    }
  };

  let env = JSON.stringify(developmentT);
  return env;
}
