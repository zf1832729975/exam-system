// 上传图标
const router = require('express').Router();
var fs = require('fs');
var path = require('path');
// 文件上传模块
const formidable = require('formidable');
router.post('/', (req, res) => {
	// 用formidable 来处理上传文件
	var form = new formidable.IncomingForm();
	// 设置上传文件 存放位置
    form.uploadDir = "./public/upload";
	form.parse(req, (err, fields, files) => {
		// console.log('fields===111\n', fields);
		// console.log('files===2222\n', files);
		var data = []
		for (let prop in files) {
			// extname = prop
			// console.log('files[prop]', files[prop].path)
						// 改文件名
			// 时间 + 随机数 + 后缀(文件名)

			// 引入的时间模块  silly-datetime 可自行下载
			// var time = datetime.format(new Date(),'YYYYMMDDHHmmss');
			var time = 'test_'
			// 生产5位的随机数
			var num = parseInt(Math.random()*100000);
			// 获取上传文件的扩展文件名
			var extname = path.extname(files[prop].name);
			console.log('extname', extname)
			// 获取旧名字
			// __dirname 代表当前项目 的根目录
			// 拼凑完整路径
			var oldname = __dirname + '/../' + files[prop].path;
			console.log('oldname', oldname)
			// 拼接新名
			var newname = __dirname + '/../public/upload/'+ time + num + extname;
			console.log('newname', newname)
			// 执行改名
			fs.renameSync(oldname , newname)
			data.push('http://localhost:3000/upload/' + time + num + extname)
			// data.push('http://www.7749tian.com:3000/upload/' + time + num + extname)
			console.log('data', data)
		}
		/*
		{
			// errno 即错误代码，0 表示没有错误。
			//       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
			"errno": 0,

			// data 是一个数组，返回若干图片的线上地址
			"data": [
				"图片1地址",
				"图片2地址",
				"……"
			]
		}
		*/
		console.log('data', data)
		res.json({
			errno: 0,
			data: data
		})
	});
	
})

module.exports = router;