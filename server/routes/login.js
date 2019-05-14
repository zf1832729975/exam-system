const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('../utils/auth')

router.get('/', (req, res) => {
    let { id, password, captcha, role } = req.query
    if (id && password && captcha && role) {
        let sessionCaptcha = req.session.captcha
        db.query(`SELECT * FROM ${role} WHERE id=?`, id, (results, fields) => {
            
            if (!results[0]) {
                res.json({ code: 401, msg: '没有该用户' })
            } else if (results[0].password === password) {
                if (captcha.toLowerCase() === sessionCaptcha) {
                    let token = jwt.sign({ id: id, role })
                    res.json({ code: 0, token, userName: results[0].name })
                } else {
                    res.json({ code: 401, msg: '验证码不正确' })
                }
            } else {
                res.json({ code: 401, msg: '密码输入错误' })
            }
        })
    } else {
        res.json({ code: 400, msg: 'request error, no params'})
    }

})

module.exports = router