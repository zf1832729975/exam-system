// 教师
const router = require('express').Router()
const db = require('../db')

// 得到教师列表
/*
除了这一列之外的其他列
*/
router.get('/list', (req, res) => {
    if (req.query.user.role !== 'admin') {
        res.json({ code: 403, msg: 'no permission' })
        return;
    }
    db.query('select id, name, sex, specialty from teacher', [], result => {
        res.json({ code: 0, msg: 'success', data: result })
    })
})


// 得到一个班级的所有学生
router.get('/getStudentList', (req, res) => {
    if (req.query.classId && req.query.role !== 'student') {
        db.query('SELECT id, name, sex, classId FROM student WHERE classId = ?;', req.query.classId, result => {
            res.json(result)
        })
    }
})

module.exports = router