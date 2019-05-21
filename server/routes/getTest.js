/**
 * 得到试题
 * 根据发送过来的表名数组和限制条件查询
 * 限制条件是一个数组， 用in语句查询
 */

const router = require('express').Router()
const db = require('../db')

router.post('/', (req, res) => {

    console.log('res.body', req.body)
    let data = {}
    console.log('req.body.tables', req.body.tables)
    if (req.body.tables && req.body.tables.length > 0) {
        let len = req.body.tables.length
        req.body.tables.map((tName, i) => {
            let sql = toWhere(tName, req.body.where)
            db.query(sql[0], sql[1], result => {
                data[tName] = result
                if (i === len - 1) {
                    res.json({ code: 0, data })
                }
            })
            // db.query('select * from qst_single where categoryId in (?) and id = ?', [[22], 3], result => {
            //     console.log('result', result)
            // })
        })

    }

})

// 根据分类id得到试题数
router.post('/number', (req, res) => {
    let { categoryIds } = req.body
    let tables = ['qst_single', 'qst_more', 'qst_judge', 'qst_gap_filling', 'qst_design']
    let tableLabels = ['单选题', '多选题', '判断题', '填空题', '设计题']
    let testNumber = {  }

    console.log('categoryIds', categoryIds)
    categoryIds.map((categoryId, index) => {
        testNumber[categoryId] = { sum: 0, type: {}, types: [] }
        tables.map((tName, j) => {
            db.query(`SELECT COUNT (*) FROM ${tName} WHERE categoryId = ${categoryId}`, {}, result => {
                console.log('result', result)
                if (result[0]['COUNT (*)'] > 0) {
                    testNumber[categoryId].sum += result[0]['COUNT (*)']
                    testNumber[categoryId].types.push(tName)
                    testNumber[categoryId]['type'][tName] = {
                        count: result[0]['COUNT (*)'],
                        tLabel: tableLabels[j],
                        tName: tName
                    }
                }
                if (j === tables.length - 1 && index === categoryIds.length - 1) {
                    res.json({ code: 0, testNumber })
                }
            })
        })
    })
})

function toWhere(tName, where) {
    console.log('where', where)
    let osql = 'SELECT * FROM ' + tName
    if (where.length < 1) {
        return [osql, []]
    }
    let sql = ''
    let params = []
    for (let prop in where) {
        if (where[prop].length > 0) {
            sql += 'and ' + prop + ' in (?) '
            params.push(where[prop])
        }
    }
    if (sql) {
        sql = osql + ' WHERE ' + sql.slice(3)
        return [sql, params]
    } else {
        return [osql, []]
    }
}

module.exports = router