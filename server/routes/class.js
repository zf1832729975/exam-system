// 班级
const router = require('express').Router()
const db = require('../db')

// 得到班级列表
router.get('/get', (req, res) => {
    let { role, id } = req.query.user
    if (role === 'admin') {
        db.query(' SELECT * FROM class', [], result => {
            res.json({ code: 0, data: result })
        })
    } else if (role === 'teacher') {
        db.query(`SELECT * FROM teacher_class WHERE teacher = '${id}';`, [], result => {
            let params = []
            result.map((item, i) => {
                params[i] = item.class
            })
            db.query(`SELECT * FROM class WHERE id IN(?)`, [params], result2 => {
                let data = []
                result2.map((item) => {
                    data.push(item)
                })
                res.json({
                    code: 0,
                    data
                })
            })
        })
    }
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