const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const jwt = require('./utils/auth')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

/**
 * 设置跨越访问
 */
app.all('*',function(req, res, next) {
	// res.header('Access-Control-Allow-Origin', '*') 
	res.header("Access-Control-Allow-Headers", "X-Requested-With")
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
	res.header("X-Powered-By", ' 3.2.1')
	// res.header("Content-Type", "application/jsoncharset=utf-8")
	/* 报错的原因是前后端的请求头没有对应上，解决方法 */
	/* 后端不在设置数据类型，意思就是前端你随意发，我什么都接着。 */
	if (req.path === '/login') { // 请求的是 login 页
		next()
	} else if(jwt.verify(req.headers.token)) { // 验证通过
		next()
	} else {
		// res.json({code: 401, msg: 'illegal request'})
		res.status(403)
		console.log('403')
		res.render('error')
		Client.emit('disconnect')
	}
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/* 	router use 能处理get和post,
--------------------------------------------------*/
const _require = file => require('./routes/' + file)
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/login', _require('login'))
app.use('/question/add', _require('question-add'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500)
	res.render('error')
	
})

module.exports = app;
