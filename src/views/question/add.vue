<!-- 新增试题 -->
<template>
    <div class="add-test" >
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
                <div class="asw_opt" v-for="(i) in aswOptCount" :key="i">
                    <div>({{ answers[i - 1] }}) </div>
                    <div :id="'asw_opt' + i" class="content"> </div>
                </div>
                
               <div class="asw_opt_handle">
                   <el-button icon="el-icon-delete-solid del" @click="delAswOpt(aswOptCount)">删除最后一项</el-button>
                    <el-button icon="el-icon-circle-plus-outline" @click="addAswOpt">添加新选项</el-button>
               </div>
            </div>
            <!-- 判断题 -->
            <div v-if="btnActive === 2">
                真项 <el-input type="textarea" v-model="aswOptTrueContent"></el-input>
                假项 <el-input type="textarea" v-model="aswOptFalseContent"></el-input>
            </div>
        </div>

        <div class="right-asw">
            正确答案
            <!-- 单项选择题 -->
            <div v-if="btnActive === 0" class="opt">
                <el-radio-group v-model="answer">
                    <el-radio v-for="i in aswOptCount" :key="i" :label="i-1">{{answers[i - 1]}}</el-radio>
                </el-radio-group>
            </div>
            <!-- 多项选择题 -->
            <dir v-else-if="btnActive === 1" class="opt">
                <el-checkbox-group v-model="multipleAswList">
                    <el-checkbox v-for="i in aswOptCount" :key="i" :label="i-1">{{answers[i - 1]}} </el-checkbox>
                </el-checkbox-group>
            </dir>
            <!-- 判断 -->
             <div v-else-if="btnActive === 2" class="opt">
                <el-radio-group v-model="answer">
                    <el-radio :label="1">真</el-radio>
                    <el-radio :label="0">假</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="analysis">题目解析<div id="analysis"></div></div>
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
import { setTimeout } from 'timers';
// import '@/assets/js/wangEditor.js'
// import '@/assets/js/wangEditor-3.1.1.min.js'
export default {
    data () {
        return {
            editor: '',
            prevHtml: '',
            prevText: '',
            btnActive: 0, // 激活的 button的下标
            btnsTitle: ['单选', '多选', '判断', '填空', '问答'],
            aswOptCount: 4, // 答案选项个数
            answers: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            answer: 0, // 答案，默认 A | 假
            qstStemContent: '',   // 题干内容 
            aswOptContent: [], // 答案选项的内容
            analysisContent: '',    // 题目解析,
            multipleAswList: [0],

            aswOptTrueContent: '真',    // 判断题答案选项
            aswOptFalseContent: '假',
            editorTxtCtnList: []    // 
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
            this.createAswEditor(i)
        }
       
       /* 去掉 editor 默认的样式 */
        this.editorTxtCtnList = document.getElementsByClassName('w-e-text-container')
        for (let i = 0; i < this.editorTxtCtnList.length; i ++) {
            this.resetEdtiorStyle(i)
        }
    },
    
    methods: {
        resetEdtiorStyle (i) {
            this.editorTxtCtnList[i].style.height = ''
            let text = this.editorTxtCtnList[i].getElementsByClassName('w-e-text')[0]
            text.style.height = ''
            text.style.minHeight = '100px'
            text.style.maxHeight = '330px'
        },
        createAswEditor (i) {
            console.log('i', i)
            this.aswOptContent[i] = new E('#asw_opt' + (i + 1) )
            this.aswOptContent[i].create()
        },
        getHtml () {
           console.log('this.editor.txt.html()', this.editor.txt.html())
           this.prevHtml = this.editor.txt.html()
        },
        getText () {
           console.log('this.editor.txt.text()', this.editor.txt.text())
           this.prevText =  this.editor.txt.text()
        },
    
        delAswOpt (index) {
            console.log('index', index)
            console.log('this.aswOptContent', this.aswOptContent)
            if (this.aswOptCount <= 2) { // 小于两个的时候不操作
                this.$message('不能删除啦！')
                return false;
            }
            this.aswOptContent.splice(index, 1)

             console.log('this.aswOptContent', this.aswOptContent)

            this.aswOptCount--

            this.resetEdtiorStyle(index)

        },
        addAswOpt () { 
            if ( this.aswOptCount >= 7) {
                this.$message('不能再添加啦！')
                return false
            }
            this.aswOptCount++; 
            setTimeout(() => {
                this.createAswEditor(this.aswOptCount - 1)
            }, 100)
        },
        submit () {
            let txt = this.qstStemContent.txt.text()
            console.log('txt', txt)
            let qstStem = this.qstStemContent.txt.html()    // 题干
            let analysis = this.analysisContent.txt.html()   // 解析
            // 答案选项
            let aswOptContent = []
            this.aswOptContent.map((item, i) => {
                aswOptContent[i] = item.txt.html()
            })
            console.log('aswOptContent', aswOptContent)
            // this.$http.post('/api/question/add', {
            //     type: this.btnActive,  // 类型
            //     answer: this.answer,
            //     qstStem,
            //     analysis,
            //     aswOptContent
            // }).then(res => {
            //     console.log('>>>>>res', res.data)       
            // })
        }
    }
}
</script>

<style lang="scss" scoped>
    .title {
        padding: 5px 15px;
    }
    .add-test {
        max-width: 1200px;
        margin: 0 auto;
        overflow: hidden;
        padding-bottom: 100px;
        // background: #f5f5f5;
        
    }
     @media screen and (max-width: 1200px) {
         .add-test {
             padding: 0 10px;
             padding-bottom: 30px;
         }
     }
    .title {
        background: #409eff;
        color: #fff;
    }
    .btn-group {
        padding: 15px 0;
    }
    .asw_opt_handle {
        // padding: 15px;
        // padding-top: 0px;
        padding-bottom: 15px;
    }
     .del {
           cursor: pointer;
       }
    #qst_stem,
    .asw_opt {
       margin: 20px 0;
        // .content {
        //     height: 200px;
        //     overflow: auto;
        //     .w-e-text-container {
        //         height: 200px;
        //     }
        // }
    }
    .right-asw {
        padding: 15px 0;
        .opt {
            padding: 5px 30px;
        }
    }
    .analysis {
        padding: 10px 0;
        // #analysis
    }
</style>