/**
 * 新增考试
 */

const router = require('express').Router()
const db = require('../db')

// router.get('/', (req, res) => {
//     let { moreScore, singleScore, sumScore,  paperId, studentId } = req.query
//     let data = {
//         More_score: moreScore,
//         Single_score: singleScore,
//         Sum_score: sumScore,
//         Exam_Paper: paperId,
//         EXam_Student: studentId
//     }
//     db.query('INSERT into Paper SET ?', data, (result) => {
//         if (result.affectedRows === 1) {
//             res.json({ code: 0, msg: '试卷成功' })
//         } else {
//             res.json({ code: 2, msg: '添加试卷失败' })
//         }
//     })
// })

module.exports = router