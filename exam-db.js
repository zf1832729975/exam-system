// 试卷内容
let paperContent = {
    fixed: {
        single: ["单选题id1", "单选题id2"],
        more: ["多选题id1", "多选题id2"],
        trueOrFalse: ["判断题id1", "判断题id2"],
        blank: ["填空题id1", "填空题id2"],
        design: ["设计题id1", "设计题id2"]
    },
    random: {
        single: {
            count: 100, // 单选题数, 默认100道
            category: {   // 分类，来自于哪个分类，
                categoryId1: 20,    // 分类 1 20道
                categoryId2: 30,    // 分类 1 30道
                categoryId3: "random",    // 分类 3 随机， 现在不考虑最多最少多少道题
                // 如果还有剩余的就从剩下的分类中选
            }
        },
        more: {
            count: 100, // 多选题数, 默认100道
            difficulty: {   // 难度选择， 现在不考虑

            },
            category: {   // 分类，来自于哪个分类
                categoryId1: 20,    // 分类 1 20道
                categoryId2: 30,    // 分类 1 30道
                categoryId3: "random",    // 分类 3 随机
            }
        }
    }

}

// 考试记录内容

let examRecordContent = {
    single: [
        ["试题id", "学生答案"]
    ],
    more: [
        ["试题id", "学生答案"]
    ]
}