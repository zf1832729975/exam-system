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


module.exports = router