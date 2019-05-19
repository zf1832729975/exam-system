/**
 * 题库管理
 */

// 新增试题
const express = require('express')
const router = express.Router()
const db = require('../db')


// router.use('/add', (req, res) => {
//     console.log('req------------------>', req.body)
//     let { courseId, userId, testType, level, qstStem, answer, aswOptContent } = req.body
//     let testTypeId = null
//     /*
//       type: this.btnActive,  // 类型
//         answer: this.answer,
//         qstStem,
//         analysis,
//         aswOptContent,
//         userId: sessionStorage.userId,
//         role: sessionStorage.roled
//     */

//     queryQuestion()
//     /**
//      * 查询题型
//     */
//     function queryQuestion() {
//         // SELECT * FROM question where Question_name = '单选题' and Question_level = '简单' and Question_Course = '1001' and Question_Teacher = '1001';
//         let query = `SELECT * FROM question where Question_name = '${testType}' and Question_level = '${level}' and Question_Course = '${courseId}' and Question_Teacher = '${userId}';`
//         db.query(query, [], result => {
//             if (result[0] && result[0].Question_id) {
//                 testTypeId = result[0].Question_id
//                 insertQuestion()
//             } else { // 如果没有就插入数据
//                 let query = `insert into question (Question_name, Question_level, Question_Course, Question_Teacher)
//                                                     VALUES('${testType}', '${level}', '${courseId}', '${userId}'); `
//                 db.query(query, [], () => {
//                     queryQuestion()
//                 })

//             }
//         })
//     }
//     /*      试题的插入
//     ----------------------------------------------------------------------------------------- */
//     let insertQuery
//     function insertQuestion() {
//         if (!testTypeId) {
//             res.json({ code: 2, msg: '添加试题失败' })
//             return false
//         }

//         if (testType === '单选题') {    // 单选题插入    
//             //                                   题型               题目
//             insertQuery = `insert into choiceqst (ChoiceQst_Question, ChoiceQst_Info, ChoiceQst_answ, ChoiceQst_OP1, ChoiceQst_OP2, ChoiceQst_OP3, ChoiceQst_OP4)
//                                                 VALUES ('${testTypeId}',     '${qstStem}',    ${answer},     '${aswOptContent[0]}',    '${aswOptContent[1]}', '${aswOptContent[2] || ''}', '${aswOptContent[3] || ''}');`
//         }
//         console.log('insertQuery', insertQuery)
//         db.query(insertQuery, [], result => {
//             console.log('result', result)
//             if (result.affectedRows === 1) {
//                 res.json({ code: 0, msg: '添加试题成功' })
//             } else {
//                 res.json({ code: 2, msg: '添加试题失败' })
//             }
//         })
//     }

// })

router.post('/add', (req, res) => {

    let data = {}
    console.log('req.body', req.body)
    let table = ['qst_single', 'qst_more', 'qst_judge', '填空', '问答']
    let sql = `INSERT INTO  ${table[req.body.testType]} SET ?`
    db.query(sql, [req.body.data], result => {
        res.json({
            code: 0,
            type: 'success',
            msg: '添加试题成功'
        })
    })
})

// 得到试题列表
router.use('/list', (req, res) => {
    // let { categoryId, limit = 10, page = 0 } = req.query
    // db.query(`SELECT * FROM qst_single_view WHERE ?  LIMIT ${page * limit}, ${limit}`, { categoryId }, result => {
    let { categoryId } = req.query
    db.query(`SELECT * FROM qst_single_view WHERE ?`, { categoryId }, result => {
        res.json({ code: 0, result })
    })
    let countRow

    // db.query('SELECT count(*) FROM `choiceqst`', [], result => {
    //     console.log(result[0])
    //     countRow = result[0]
    //     res.json({ code: 0, msg: 'success', 'countRow': countRow })
    // })

})
module.exports = router