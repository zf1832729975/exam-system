/**
 * 根据专业得到所有的课程列表
 */

const router = require('express').Router()
const db = require('../db')
router.get('/', (req, res) => {
    let { id, role } = req.query.user
    if (role === 'teacher') {
        // db.query(`SELECT name  FROM  teacher WHERE id = ${id};`, [], (result) => {
        //     console.log('result', result)
        //     if (result[0] && result[0].name) {
        //         db.query('SELECT * FROM course WHERE specialty= ?', result[0].name, (result) => {
        //             res.json(result)
        //         })
        //     } else {
        //         res.json({code: 2, msg: 'err' })
        //     }

        // })
        ////////////////////////////////
        //// 得到的是所教的科目
        db.query(` SELECT course FROM teacher_course WHERE teacher = '${id}'; `, [], result => {
            let params = []
            result.map((item, i) => {
                params[i] = item.course // 得到所教的课程号
            })
            db.query(`SELECT * FROM course WHERE id IN(?)`, [params], result => {
                db.query(`SELECT * FROM category WHERE teacher = ?`, id, result2 => {
                    for (let i = 0; i < result.length; i++) {
                        result[i].children = []
                        for (let j = 0; j < result2.length; j++) {
                            if (result[i].id == result2[j].course) {
                                result[i].children.push(result2[j])
                            }
                        }
                    }
                    res.json(result)
                })
            })
        })
    } else if (role === 'admin') {
        db.query(`SELECT * FROM course`, [], (result) => {
            res.json(result)
        })
    } else {
        res.json({ code: 2, msg: 'err' })
    }

})

module.exports = router;