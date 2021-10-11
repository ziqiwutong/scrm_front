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
  }
}
