/**
 * 新增试卷
 */

const router = require('express').Router()
const db = require('../db')

router.get('/', (req, res) => {
    let { paperName, courseName, teacherId } = req.query
    let data = {
        Paper_name: paperName,
        Paper_Course_name: courseName,
        Paper_Teacher: teacherId
    }
    db.query('INSERT into Paper SET ?', data, (result) => {
        if (result.affectedRows === 1) {
            res.json({ code: 0, msg: '添加试卷成功' })
        } else {
            res.json({ code: 2, msg: '添加试卷失败' })
        }
    })
})

module.exports = router