const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const jwt = require('./utils/auth')
const cors = require("cors")
const app = express()


const session = require('express-session');
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
	secret: 'XXWWYY-XBYZHI',	// 用来对session数据进行加密的字符串.这个属性值为必须指定的属性。
	name: 'name',	// 表示cookie的name，默认cookie的name是：connect.sid
	cookie: { maxAge: 1000 * 60 },	// cookie过期时间，毫秒。
	resave: false,	// 是指每次请求都重新设置session cookie
	saveUninitialized: true, // 无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
}))


/**
 * 设置跨越访问
*/
// app.all('*',function(req, res, next) {
// 	console.log('req.path', req.path)
// 	res.header('Access-Control-Allow-Origin', '*') 
// 	res.header("Access-Control-Allow-Headers", "X-Requested-With")
// 	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
// 	res.header("X-Powered-By", ' 3.2.1')
// 	// res.header("Content-Type", "application/jsoncharset=utf-8")
// 	/* 报错的原因是前后端的请求头没有对应上，解决方法 */
// 	/* 后端不在设置数据类型，意思就是前端你随意发，我什么都接着。 */
// 	if (req.path === '/api/login' || req.path === '/api/svg') { // 请求的是 login 页
// 		next()
// 	} else if(jwt.verify(req.headers.token)) { // 验证通过
// 		next()
// 	} else {
// 		res.status(403)
// 		res.render('error')
// 	}
// })

// app.use("*", function (req, res, next) {
// 	//设置允许跨域的域名，*代表允许任意域名跨域
// 	res.header("Access-Control-Allow-Origin", "*");
// 	//允许的header类型
// 	res.header("Access-Control-Allow-Headers", "content-type");
// 	//跨域允许的请求方式 
// 	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
// 	if (req.method.toLowerCase() == 'options') {

// 		res.send(200);  //让options尝试请求快速结束
// 	}
// 	else {

// 		next();
// 	}
// });



app.use(cors({credentials: true, origin: 'http://localhost:8001'}));
/* 	router use 能处理get和post,
--------------------------------------------------*/
const _require = file => require('./routes/' + file)
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

app.use('/', indexRouter)
app.use('/api/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', _require('login'))
app.use('/api/svg', _require('svg'))
// app.use('/api/question/add', _require('question-add'))
app.use('/api/getcourselist', _require('get-course-list'))
app.use('/api/newcourse', _require('new-course'))
app.use('/api/newpaper', _require('new-paper'))
app.use('/api/getpaperlist', _require('get-paper-list'))

app.use('/api/question', _require('question'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500)
	res.render('error')

})

module.exports = app;
