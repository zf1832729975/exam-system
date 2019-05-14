/**
 * 新增课程
 */

const router = require('express').Router()
const db = require('../db')

function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}
router.get('/', (req, res) => {
    let { courseId,  newCategoryName } = req.query
    if (courseId  && newCategoryName) {
        let sql = {
            name: newCategoryName,
            teacher: req.query.user.id,
            course: courseId
        }
        db.query(`INSERT INTO category SET ?`, sql, result => {
            if (result.affectedRows == 1) {
                res.json({
                    code: 0,
                    msg: '添加分类成功'
                })
            } else {
                res.json({
                    code: 400,
                    msg: '添加分类失败'
                })
            }
        })
        // let courseId = getUUID().substr(-10, 10)
        // db.query(`INSERT into course VALUES('${courseId}', '${courseName}', ${pecialtyId});`, [], (result) => {
        //     if (result.affectedRows === 1) {
        //         res.json({
        //             code: 0, msg: 'success',
        //             data: {
        //                 Course_id: courseId, 
        //                 Course_name: courseName,
        //                 Course_Specialty: pecialtyId,
        //             }
        //         });
        //     } else {
        //         res.json({ code: 2, msg: 'error' })
        //     }
        // })

    } else {
        res.json({ code: 400, msg: 'error' })
    }
})
module.exports = router;