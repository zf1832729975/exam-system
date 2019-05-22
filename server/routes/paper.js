/**
 * 新增试卷
 */

const router = require('express').Router()
const db = require('../db')

function toDate(time) {
    if (!time) return false
    console.log('new Date(time) + ', String(new Date(time)))
    return (new Date(time) + '').replace('Z', '')
}
router.post('/save', (req, res) => {
    console.log('req.body', req.body)
    let data = req.body
    let { courseId, teacherId } = req.body
    // data.startDate = toDate(data.startDate)
    // data.endDate = toDate(data.endDate)
    // 、、、、、、、、、、、、、、、、、、、、
    data.startDate = null
    data.endDate = null
    // 、、、、、、、、、、、、、、、、、、、、、
    console.log('data.startDate', data.startDate)
    if (courseId && teacherId && req.query.user.role !== 'student') {
        db.query('INSERT INTO paper SET ?', req.body, result => {
            console.log('result', result)
            if (result.affectedRows === 1) {
                res.json({ code: 0, msg: '添加试卷成功', insertId: result.insertId })
            } else {
                res.json({ code: 2, msg: '添加试卷失败' })
            }
        })
    }
})

module.exports = router