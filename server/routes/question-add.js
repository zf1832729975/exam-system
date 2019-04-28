/**
 * 新增问题 ==> 新增试卷
 */

const express = require('express')
const router = express.Router()
const db = require('../db')


router.post('/', (req, res) => {
    console.log('req.body', req.body)
    let data = req.body
    // 选择题
    /**
     *                          id              类型 type           题干            答案
     * insert into choiceqst(ChoiceQst_id, ChoiceQst_Question, ChoiceQst_Info,  ChoiceQst_answ, ChoiceQst_OP1, ChoiceQst_OP2, ChoiceQst_OP3)
     * INSERT ChoiceQst SELECT 1003, 1001, '你吃饭了没', 1, '吃了', '没有吃', '不想吃', null
     */
    let  query = `INSERT ChoiceQst SELECT 1004, 1001, '${data.qstStem}', '${data.answer}', 
        '${data.aswOptContent[0]}', '${data.aswOptContent[1]}', '${data.aswOptContent[2]}', '${data.aswOptContent[3]}'`
    db.query(query, [], (results) => {
        res.json({
            code: 0,
            msg: 'success'
        })
    })
    
})

module.exports = router