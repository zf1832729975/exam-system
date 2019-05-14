// 设置， 修改个人资料
const router = require('express').Router()
const db = require('../db')

// 修改密码
router.get('/updataPass', (req, res) => {
    let { pass, oldPass, user } = req.query
    if (pass && oldPass) {
        db.query(`SElECT id FROM ${user.role} WHERE password = '${oldPass}';`, [], result => {
            if (result[0] && result[0].id) {
                db.query(`update ${user.role} set password = '${pass}' where id = '${user.id}';`)
                res.json({ code: 0, msg: '密码修改成功' })
            } else {
                res.json({ code: 400, msg: '密码输入错误' })
            }
        })
    } else {
        res.json({ code: 400, msg: 'no params' })
    }
})
// 查询个人信息
router.get('/query', (req, res) => {
    let { role, id } = req.query.user
    if (role === 'student') {
        db.query(`SELECT Student_Class, sex  FROM student WHERE id = '${id}'; `, [], result => {
            db.query(`SELECT * FROM class WHERE id = ${result[0].Student_Class}`, [], result2 => {
                res.json({
                    code: 0,
                    data: {
                        sex: result[0].sex,
                        specialty: result2[0].Class_Specialty_name,
                        className: result2[0].year + '级' + result2[0].Class_Specialty_name + result2[0].Class_number + '班'
                    }
                })
            })
        })
    } else if(role == 'teacher') {
        var data = {}
        db.query(` SELECT sex, specialty FROM teacher WHERE id='${id}'; `, [], result => {
            data = {
                sex: result[0].sex,
                specialty: result[0].specialty,
                teacherClassList: []
            }
            db.query(`SELECT * FROM teacher_class WHERE teacher = '${id}';`, [], result => {
                let params = []
                result.map((item, i) => {
                    params[i] = item.class
                })
                db.query(`SELECT * FROM class WHERE id IN(?)`, [params], result2 => {
                    result2.map((item) => {
                        data.teacherClassList.push(item)
                    })
                    res.json({
                        code: 0,
                        data
                    })
                })
            })
        })
    }

})


module.exports = router