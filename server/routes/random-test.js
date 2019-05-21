// 随机生成试题

const router = require('express').Router()
const db = require('../db')



/**
 * 有循环，必须要有数组才能判断是否执行完，或者用同步的方法
req.boyd = 
{	categorys: [分类id， 分类id],
    分类id: {
        types: ['单项']
        单选: {
            count: 5
        },
        多选： {

        }
        .....
    },
    .....
    ...
}
*/

router.post('/', (req, res) => {

    let data = req.body
    if (typeof data !== 'object') {
        res.json({ code: 400, msg: 'Data is not an object' })
        return
    }
    let rData = {}
    let cLen = data.categorys.length;
    console.log('data', data)
    for (let index = 0; index < cLen; index++) {
        let cName = data.categorys[index]
        let tLen = data[cName].types.length
        for (let j = 0; j < tLen; j++) {
            let tName = data[cName].types[j]
            if (!rData[tName]) rData[tName] = []
            console.log('tName', tName)
            let count = data[cName][tName].count
            db.query(`SELECT * FROM ${tName}  order by rand()  LIMIT ${count}`, [], result => {
                // console.log('result, index', result, index)
                rData[tName] = rData[tName].concat(result)
                console.log('rData', rData)
                if (index === cLen - 1 && j == tLen - 1) {
                    res.json({
                        code: 0,
                        data: rData
                    })
                }
            })

        }
    }
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
