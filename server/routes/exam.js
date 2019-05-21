// 考试
const router = require('express').Router()
const db = require('../db')

// 得到试卷考试内容
router.get('/getPaperTest', (req, res) => {
    let { role, id } = req.query.user
    // let sql = 'select * from qst_single;'
    let sql = 'select * from qst_more'
    db.query(sql, [], result => {
        res.json({
            code: 0,
            // single: result
            qst_more: result
        })
    })
})

router.post('/record/save', (req, res) => {
    console.log('req.body', req.body)
    let { user } = req.query
    let addsql = 'INSERT INTO record SET ?'
    console.log('req.body.answer', req.body.answer.single)
    let params = {
        // studentId: user.id,
        studentId: 1,
        paperId: 1,
        content: JSON.stringify(req.body.answer),
        sumScore: 36,
        useTime: 36
    }
    // db.query(addsql, params, result => {
    //     res.json({
    //         code: 0,
    //         score: 50,
    //         result
    //     })
    // })
    let sql = 'SELECT * FROM qst_single WHERE id in(?)'
    // let sql = 'SELECT * FROM qst_single WHERE id = ? and answer=2'
    let tmp = []
    let answer = []
    req.body.answer.single.map(item => {
        console.log('item', item)
        tmp.push(item[0])
        answer.push(item[1])
    })
    console.log('tmp', tmp)
    db.query(sql, [tmp], result => {
        console.log('result', result)
        res.json({
            code: 0,
            score: 50,
            result
        })
    })
   
})

// 得到某个学生具体的考试记录信息
router.post('/record/getDetail', (req, res) => {
    console.log('req.body', req.body)
   
   
})
// function 
function getSingle() {
    let sql = 'SELECT * FROM qst_single WHERE id in() '
    db.query(addsql, params, result => {
        res.json({
            code: 0,
            score: 50,
            result
        })
    })
}

module.exports = router