// 随机生成试题

const router = require('express').Router()
const db = require('../db')

router.post('/', (req, res) =>　{
    console.log('req.body', req.body)
    let data =  req.body.data
    console.log('data', data)
    console.log('Object.getOwnPropertyNames(foo)', Object.getOwnPropertyNames(data))
    // for (let categoryId, index in data) {
    //     console.log('categoryId, index', categoryId, index)
    // }
    // data.map((category, index) => {
    //     category.map((table, j) => {
    //         db.query(`select * from ${table} WHERE categoryId=23 order by rand() LIMIT 2`, {}, result => {

    //         })
    //     })
    // })
    // db.query('select * from qst_single WHERE categoryId=23 order by rand() LIMIT 2', {}, result => {
    //     res.json({
    //         code: 0,
    //         result
    //     })
    // })
   
})

module.exports = router
