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
  // 更新转载的公众号内容
  updateEditReqArticle(state, articleMessage) {
    state.repArticleDetail.articleContext = articleMessage.articleContext;
    state.repArticleDetail.articleTitle = articleMessage.articleTitle;
    state.repArticleDetail.articleAuthor = articleMessage.articleAuthor;
    state.repArticleDetail.articleAccountName = articleMessage.articleAccountName;
    state.repArticleDetail.articlePower = articleMessage.articlePower;
    state.repArticleDetail.coverImg = articleMessage.coverImg;
    state.repArticleDetail.productIds = articleMessage.productIds;
  },
  // 更新转载的公众号内容
  updateReqArticleContext(state, articleContext) {
    state.repArticleDetail.articleContext = articleContext;
  },
  // 更新文章关联的产品
  updateArticleProductList(state, productIds) {
    state.repArticleDetail.productIds = productIds;
  },
  // 更新微信给授权用户提供的code
  updateArticleOAuth(state, status) {
    state.hasOAuth = status;
  },
  // 更新微信用户转客户时存储的信息
  updateWxUserMsg(state, wxUser) {
    state.wxUser = wxUser;
  },
}
