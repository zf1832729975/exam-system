const jwt = require('jsonwebtoken')

// module.exports fun
// Token 数据
// const payload = {
//   name: 'wanghao',
//   admin: true
// }

// // 密钥
// const secret = 'ILOVENINGHAO'

// // 签发 Token
// const token = jwt.sign(payload, secret, { expiresIn: '1day' })

// // 输出签发的 Token
// // console.log(token)

// // 验证 Token


// jwt.verify(token, secret, (error, decoded) => {
//   if (error) {
//     console.log('不正确', error.message)
//     return
//   }
//   console.log('验证通过', decoded)
// })
let mySecret = 'XYOSHD;H=ysdfsdfsxxx-yyy_x&&2rsldf;'
/**
 * Header : 每个 JWT token 里面都有一个 header，也就是头部数据。
 * 里面包含了使用的算法，这个 JWT 是不是带签名的或者加密
 * Payload : Payload 里面是 Token 的具体内容，这些内容里面有一些是标准字段
 * Signature : 
 */
module.exports = {
  /**
   * 签发 Token
   * @param {Object} payload {name: , pwd: }
   * @param {*} secret 秘钥
   */
  sign (payload, secret = mySecret) {
    return jwt.sign(payload, secret, { expiresIn: '6h' })
  },
  /**
   * token: 要验证的token
   * secret: 秘密， 秘钥
   * 验证不正确会直接走 error 
   */
  verify (token, secret = mySecret) {
    let result = false
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        console.log('不正确', error.message)
      } else {
        console.log('验证通过', decoded)
        result = decoded
      }
    })
    return result
  }
}