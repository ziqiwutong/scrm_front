export default {
  // 修改token的值
  updateToken(state,token){
    state.token = token;
  },
  // 修改底部的tabBar被选中状态
  updateTabBarActive(state,active){
    state.tabBarActive = active;
  },
  // 更新store中的用户信息userMessage
  updateUserMessage(state,userMessage){
    state.userMessage = userMessage;
  },
  // 更新转载的公众号内容
  updateEditReqArticle(state,articleMessage){
    state.repArticleDetail.articleContext = articleMessage.articleContext;
    state.repArticleDetail.articleTitle = articleMessage.articleTitle;
    state.repArticleDetail.articleAuthor = articleMessage.articleAuthor;
    state.repArticleDetail.articleAccountName = articleMessage.articleAccountName;
    state.repArticleDetail.articlePower = articleMessage.articlePower;
    state.repArticleDetail.coverImg = articleMessage.coverImg;
  },
  // 更新转载的公众号内容
  updateReqArticleContext(state,articleContext){
    state.repArticleDetail.articleContext = articleContext;
  }
}
