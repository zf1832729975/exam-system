﻿const createError = require('http-errors')
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
// app.use(express.bodyParser({ uploadDir: "./public/upload" }));


/**
 * 设置跨越访问
*/
// app.all('*',function(req, res, next) {
// 	console.log('req.path', req.path)
// 	// res.header('Access-Control-Allow-Origin', '*') 
// 	// res.header("Access-Control-Allow-Headers", "X-Requested-With")
// 	// res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
//     // res.header("X-Powered-By", ' 3.2.1')
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By",' 3.2.1')

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



/* corse跨越设置
-------------------------------------------------- */
// app.use(cors({credentials: true, origin: 'http://www.7749tian.com'})); 
app.use(cors({
    credentials: true,
    origin: ['http://localhost:8080', 'http://192.168.199.187:8080', 'http://192.168.1.211:8080', 'http://192.168.1.203', 'http://www.7749tian.com']
}));

app.all('*', function (req, res, next) {
    // console.log('====================================================\n', req)
    console.log('req.path', req.path)
    // res.header('Access-Control-Allow-Origin', '*') 
    res.header('role', 'teacher')
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
    // res.header("Content-Type", "application/jsoncharset=utf-8")
    /* 报错的原因是前后端的请求头没有对应上，解决方法 */
    /* 后端不在设置数据类型，意思就是前端你随意发，我什么都接着。 */
    if (req.path === '/api/login' || req.path === '/api/svg' || req.path === '/api/uploadImage' || req.path.includes('upload')) { // 请求的是 login 页
        next()
    } else {
        let result = jwt.verify(req.headers.token)
        if (result) { // 验证通过
            req.query.user = result
            next()
        } else {
            res.json({ code: 401, msg: 'Not carrying token' })
        }
    }
})

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
app.use('/api/paper', _require('paper'))
app.use('/api/getpaperlist', _require('get-paper-list'))
app.use('/api/question', _require('question'))
app.use('/api/userInfo', _require('user-info'))
app.use('/api/class', _require('class'))
app.use('/api/category', _require('category'))
app.use('/api/uploadImage', _require('uploadImage'))
app.use('/api/student', _require('student'))
app.use('/api/teacher', _require('teacher'))
app.use('/api/exam', _require('exam'))
app.use('/api/getTest', _require('getTest'))
app.use('/api/getRandomTest', _require('random-test'))
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
