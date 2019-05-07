/**
 * 得到试卷列表
 */

const router = require('express').Router()
const db = require('../db')

router.get('/', (req, res) => {
    let teacherId = req.query.teacherId    
    db.query(`SELECT * FROM paper WHERE Paper_Teacher=${teacherId}`, [], (result) => {
        res.json(result)
    })
})

module.exports = router