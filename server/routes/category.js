// 分类
const router = require('express').Router()
const db = require('../db')

// 删除分类
router.get('/del', (req, res) => {
    if (req.query.user.role === 'student') return false;
    console.log('result', req.query.data)
    if (req.query.data && req.query.data.length >= 1) {
        db.query('DELETE FROM category WHERE id in(?)', [req.query.data], result => {
            console.log('result', result)
            res.json({
                code: 0,
                msg: '删除分类成功'
            })
        })
    } else {
        res.json({ code: 400, msg: 'erros' })
    }
})

// 得到分类 根据课程到得分类
router.get('/get', (req, res) => {
    // let { user, courseId } = req.query
    delete req.query.user 
    console.log('req.query', req.query)
    db.query('SELECT * FROM category WHERE ? ', req.query , data => {
        console.log('data', data)
        res.json({
            code: 0,
            type: 'success',
            data
        })
    })
})


module.exports = router