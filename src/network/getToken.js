export function getToken(userID) {
  const jwt = require("jsonwebtoken");//引入jwt
  const secret = "scrm";// 设置秘钥
  const token = jwt.sign({userID: userID}, secret, {// 设置加密内容及有限时间
    expiresIn: "2h"
  })
  // console.log(`token is ${token}`);
  const isValid = jwt.verify(token, secret, (err, decoded) => { // 权限验证
    if (err) {
      return false;
    }
    // console.log(`token data is ${JSON.stringify(decoded)}`);
    return true
  });
  let hasToken = window.sessionStorage.getItem("token");
  if (!hasToken || !isValid) {// 缓存中没有token，或者token已失效时才生成新的token
    window.sessionStorage.setItem("token", token);
  }
}
