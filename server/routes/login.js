const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('../utils/auth')

router.get('/', (req, res) => {
    let query
    let {id, password, captcha, role } = req.query

    let sessionCaptcha = req.session.captcha
    console.log('login --------------->\nreq.session', req.session)
    if (role === 'student') {
        query = `SELECT * FROM stu_info WHERE id='${id}'`
    } else if (role === 'teacher'){ 
        query = `SELECT * FROM teacher WHERE id='${id}'`
    } else {
        // 
    }
    
    db.query(query, [], (results, fields) => {
        if (!results[0]) {
            res.json({code: 401, msg: '没有该用户'})
        } else if (results[0].password === password) {
            if (captcha.toLowerCase() === sessionCaptcha) {
                let token = jwt.sign({ name: id })
                res.json({code: 0, token})
            } else {
                res.json({ code: 401, msg: '验证码不正确'})
            }
        } else {
            res.json({code: 401, msg: '密码输入错误'})
        }
    })
})

module.exports = router