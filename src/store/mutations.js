export default {
  // 修改token的值
  updateToken(state, token) {
    state.token = token;
  },
  // 修改底部的tabBar被选中状态
  updateTabBarActive(state, active) {
    state.tabBarActive = active;
  },
  // 更新store中的用户信息userMessage
  updateUserMessage(state, userMessage) {
    state.userMessage = userMessage;
  },
  // 更新微盟id
  updateWmId(state, wmId) {
    state.userMessage.wmId = wmId;
  },
  // 更新分销链接
  updateDistributeUrl(state, distributeUrl) {
    state.distributeUrl = distributeUrl;
  },
  // 更新转载的公众号内容
  updateEditReqArticle(state, articleMessage) {
    state.repArticleDetail = articleMessage;
  },
  // 更新转载的公众号内容-用户保存了页面
  updateReqArticleContext(state, articleContext) {
    state.repArticleDetail.articleContext = articleContext;
  },
  // 更新转载的公众号内容-素材类别
  updateReqArticleMaterialType(state, materialType) {
    state.repArticleDetail.materialType = materialType;
  },
  // 更新文章关联的产品
  updateArticleProductList(state, productIds) {
    state.repArticleDetail.productIds = productIds;
  },
  // 更新微信给授权用户提供的code的状态
  updateArticleOAuth(state, status) {
    state.hasOAuth = status;
  },
  // 更新微信用户转客户时存储的信息
  updateWxUserMsg(state, wxUser) {
    state.wxUser = wxUser;
  },
  // 更新转载的公众号内容-用户保存了页面
  updateContextListArticleType(state, articleType) {
    state.articleType = articleType;
  },
  // 更新文章的临时页面
  updateTempArticle(state, articleContextTemp) {
    state.articleContextTemp = articleContextTemp;
  }
}
