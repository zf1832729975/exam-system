// 学生
const router = require('express').Router()
const db = require('../db')

// 批量插入学生数据
router.post('/add', (req, res) => {
   let {user} = req.query
   if (user.role == 'student')return;
   let sql = 'INSERT INTO student (name, sex, password, classId) VALUES ?'
   let values = req.body
   db.query(sql, [values], result => {
       res.json({
           code: 0,
           msg: '添加学生成功'
       })
   })
})

// 删除学生 可以批量
router.post('/del', (req, res) => {
    let {user} = req.query
    if (user.role == 'student')return; 
    let sql = 'DELETE FROM student WHERE id IN (?)'
    console.log('req.body', req.body)
    db.query(sql, [req.body], result => {
        console.log('result', result)
        res.json({
            code: 0,
            type: 'success',
            msg: '删除成功'
        })
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