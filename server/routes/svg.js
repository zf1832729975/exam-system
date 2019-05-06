const express = require('express');
const svgCaptcha = require('svg-captcha');
const router = express.Router();
router.get('/',(req, res)=>{
	const cap = svgCaptcha.create({
		size: 4,  //验证码长度 个数
		width: 130,
		height: 40,
		background: '#f0f0f0',
		noise: 1, //干扰线条数
		fontSize: 40,	 // 字体大小
		// color: true,  // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有  
		ignoreChars: '0o1ij',   //验证码字符中排除'0o1i'
		// 翻转颜色
		inverse: false,		
	});
	req.session.captcha = cap.text.toLowerCase()// session 存储验证码数值
	res.type('svg'); // 响应的类型
	res.send(cap.data)
})
 
module.exports = router;