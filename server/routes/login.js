const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('../utils/auth')

router.get('/', (req, res) => {
    let obj = req.query
    let t_id = obj.id
    let t_pwd = obj.pwd
    if (t_id && t_pwd) {
        let query = `SELECT * FROM teacher WHERE Teacher_id='${t_id}'`
        db.query(query, [], (results, fields) => {
            console.log('results', results)
            if (!results[0]) {
                res.json({code: 401, msg: '没有该用户'})
            }  else if (results[0].Teacher_pwd === t_pwd) {   
                let token = jwt.sign({ name: t_id })
                res.json({code: 0, token})
            } else {
                res.json({code: 401, msg: '密码输入错误'})
            }
        })
    } else {
        res.send({ code: 401, msg: 'Token failure'})
    }
})

module.exports = router