/**
 * 新增问题 ==> 新增试题（题库）
 */

const express = require('express')
const router = express.Router()
const db = require('../db')

router.use('/', (req, res) => {
   let { courseId, userId, testType, level, qstStem, answer, opt1,  op2, opt3 = null, opt4 = null } = req.body
   let testTypeId = null
    /*
      type: this.btnActive,  // 类型
        answer: this.answer,
        qstStem,
        analysis,
        aswOptContent,
        userId: sessionStorage.userId,
        role: sessionStorage.role
    */

    queryQuestion()
    /**
     * 查询题型
    */
   function queryQuestion () {
       // SELECT * FROM question where Question_name = '单选题' and Question_level = '简单' and Question_Course = '1001' and Question_Teacher = '1001';
        db.query(`SELECT * FROM question where Question_name = '${testType}' and Question_level = '${level}' and Question_Course = '${courseId}' and Question_Teacher = '${userId}';`, [], result => {
            console.log('res', result)
            if (result[0] && result[0].Question_id) {
                testTypeId = result[0].Question_id
            } else { // 如果没有就插入数据
                let query = `insert into question (Question_name, Question_level, Question_Course, Question_Teacher)
                                                    VALUES('${testType}', '${level}', '${courseId}', '${userId}'); `
                db.query(query, [], () => {
                    queryQuestion()
                })
                
            }
            res.json(result)
        })
    }
    /*      试题的插入
    ----------------------------------------------------------------------------------------- */
    let insertQuery 
    if (testTypeId === '单选题') { // 单选题插入    
                //                                   题型               题目
        insertQuery = `insert into choiceqst (ChoiceQst_Question, ChoiceQst_Info, ChoiceQst_answ, ChoiceQst_OP1, ChoiceQst_OP2, ChoiceQst_OP3, ChoiceQst_OP4)
                                                VALUES ('${testTypeId}',     '${qstStem}',    ${answer},     '${opt1}',    '${op2}', '${opt3}', '${opt4}');`
    }
 
    db.query(insertQuery, [], result => {
        console.log('result', result)
    })
})

module.exports = router