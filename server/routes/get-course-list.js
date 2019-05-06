/**
 * 根据专业得到所有的课程列表
 */

const router = require('express').Router()
const db = require('../db')
router.get('/', (req, res)=>{
    // let { specialty } = req.query   // 专业
    let { userId = null, role } = req.query 
    if (role === 'teacher') {
        db.query(`SELECT *  FROM  teacher WHERE id = ${userId};`, [], (result) => {
            if (result[0] && result[0].specialty) {
                db.query(`SELECT * FROM course WHERE Course_Specialty = ${result[0].specialty};`, [], (result) => {
                    res.json(result)
                })
            } else {
                res.json({code: 2, msg: 'err' })
            }
           
        })
    } else if (role === 'admin'){
        db.query(`SELECT * FROM course`, [], (result) => {
            res.json(result)
        })
    } else {
        res.json({code: 2, msg: 'err' })
    }
    
})
 
module.exports = router;