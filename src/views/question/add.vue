<!-- 新增试题 -->
<template>
    <div class="add-test">
        <h2 class="title">新增试题</h2>
        <div class="btn-group">
            <el-button size="small" v-for="(btn, i) in btnsTitle" :key="btn" :type="i === btnActive ? 'primary' : ''" @click="btnActive = i">{{btn}}</el-button>
        </div>
        
        <h3>试题题干</h3>
        <div id="qst_stem"></div>
        <div>
            <h3>答案选项</h3>
            <!-- v-show 在这里比 v-if 好  单项和多项 -->
            <div v-show="btnActive === 0 || btnActive === 1">
                <div class="asw_opt" v-for="i in aswOptCount" :key="i">
                    <div>({{ answers[i - 1] }}) </div>
                    <div :id="'asw_opt' + i" class="content"> </div>
                </div>
               <div>
                    <el-button icon="el-icon-circle-plus-outline">继续添加</el-button>
               </div>
            </div>
            <!-- 判断题 -->
            <div v-if="btnActive === 2">
                真项 <el-input type="textarea" v-model="aswOptTrueContent"></el-input>
                假项 <el-input type="textarea" v-model="aswOptFalseContent"></el-input>
            </div>
        </div>

        <div>
            正确答案
            <!-- 单项选择题 -->
            <div v-if="btnActive === 0">
                <el-radio-group v-model="answer">
                    <el-radio v-for="i in aswOptCount" :key="i" :label="i-1">{{answers[i - 1]}}</el-radio>
                </el-radio-group>
            </div>
            <!-- 多项选择题 -->
            <dir v-else-if="btnActive === 1">
                <el-checkbox-group v-model="multipleAswList">
                    <el-checkbox v-for="i in aswOptCount" :key="i" :label="i-1">{{answers[i - 1]}} </el-checkbox>
                </el-checkbox-group>
            </dir>
            <!-- 判断 -->
             <div v-else-if="btnActive === 2">
                <el-radio-group v-model="answer">
                    <el-radio :label="1">真</el-radio>
                    <el-radio :label="0">假</el-radio>
                </el-radio-group>
            </div>
        </div>
        
        <div>题目解析<div id="analysis"></div></div>
        <!-- 试题类别 -->
        <div>试题类别
            <div></div>
        </div>

        <div>试题标签</div>
        <el-button type="primary" @click="submit">保存</el-button>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
    data () {
        return {
            editor: '',
            prevHtml: '',
            prevText: '',
            btnActive: 0, // 激活的 button的下标
            btnsTitle: ['单选', '多选', '判断', '填空', '问答'],
            aswOptCount: 4, // 答案选项个数
            answers: ['A', 'B', 'C', 'D', 'E', 'F'],
            answer: 0, // 答案，默认 A | 假
            qstStemContent: '',   // 题干内容 
            aswOptContent: [], // 答案选项的内容
            analysisContent: '',    // 题目解析,
            multipleAswList: [0],

            aswOptTrueContent: '真',    // 判断题答案选项
            aswOptFalseContent: '假'
        }
    },
    created () {
    },
    mounted () {
        this.qstStemContent = new E('#qst_stem')
        this.qstStemContent.create()
        this.analysisContent = new E('#analysis')
        this.analysisContent.create()
        this.qstStemContent.customConfig.menus = [
            'head',
            'bold',
            'italic',
            'underline'
        ]
        for(let i = 0; i < this.aswOptCount; i ++) {
            this.aswOptContent[i] = new E('#asw_opt' + (i + 1) )
            this.aswOptContent[i].create()
        }
       
    },
    
    methods: {
        getHtml () {
           console.log('this.editor.txt.html()', this.editor.txt.html())
           this.prevHtml = this.editor.txt.html()
        },
        getText () {
           console.log('this.editor.txt.text()', this.editor.txt.text())
           this.prevText =  this.editor.txt.text()
        },
        submit () {
            let qstStem = this.qstStemContent.txt.html()    // 题干
            let analysis = this.analysisContent.txt.html()   // 解析
            // 答案选项
            let aswOptContent = []
            this.aswOptContent.map((item, i) => {
                aswOptContent[i] = item.txt.html()
            })
            this.$http.post('/api/question/add', {
                type: this.btnActive,  // 类型
                answer: this.answer,
                qstStem,
                analysis,
                aswOptContent
            }).then(res => {
                console.log('>>>>>res', res.data)       
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .add-test {
        overflow: hidden;
        padding-bottom: 50px;
    }
    .title {
        background: #409eff;
        color: #fff;
    }
    .asw_opt {
        // padding: 0 10px;
       
        // .content {
        //     height: 200px;
        //     overflow: auto;
        //     .w-e-text-container {
        //         height: 200px;
        //     }
        // }
    }
</style>