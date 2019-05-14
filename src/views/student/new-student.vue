<template>
    <div class="add-student">
        <div class="meta">
            班级:
            <el-select v-model="newStudentClassId" placeholder="请选择班级">
                <el-option v-for="_class in classList" :key="_class.id" :label="_class.name" :value="_class.id"></el-option>
            </el-select>
            <span>说明：姓名为字符少于等于1将被忽略, 密码为空设置默认密码123456</span>
         </div>
        <div class="table">
              <table class="add-student-table">
                <thead>
                    <th></th>
                    <th>姓名</th>
                    <th>性别</th>
                    <th>密码</th>
                </thead>
                <tbody>
                    <tr v-for="i in tableRowLength" :key="i">
                            <td >{{i}}</td>
                            <td><input type="text" v-model="newStudentList[i - 1][0]"></input></td>
                            <td>
                                <el-switch
                                    v-model="newStudentList[i - 1][1]"
                                    active-color="#539fed"
                                    inactive-color="#44f492"
                                    active-text="男"
                                    inactive-text="女"
                                    active-value="男"
                                    inactive-value="女">
                                </el-switch>
                            </td>
                            <td><input type="text" v-model="newStudentList[i - 1][2]"></input></td>
                    </tr>
                </tbody>
                <el-button class="add-row-btn" @click="tableRowLength++" icon="el-icon-plus" title="新增行"></el-button>
            </table>
        </div>
        <div style="text-align: right; padding: 10px 10px; 0">
            <el-button type="primary" @click="saveStudent">提交</el-button>
        </div>
        
    </div>
</template>

<script>
export default {
    name: 'NewStudent',
    data () {
       return {
        // ------ 新增学生
        tableRowLength: 10,
		newStudentClassId: '', // 新增学生时选择的班级id
		newStudentList: [],
		newStudentDefaultPassword: '123456',	// 密码
		newStudentDefaultSex: '男' 
       }
    },
    props: {
        classList: Array
    },
    watch: {
        tableRowLength () {
            this.initNewStudentList()
		}
    },
    created() {
        this.initNewStudentList()
        if (this.classList[0]) this.newStudentClassId = this.classList[0].id
        
    },
    methods: {
        // 初始化学生数据
		initNewStudentList () {
			for (let i = 0; i < this.tableRowLength; i++) {
				if (!this.newStudentList[i])
					this.newStudentList.push(['', this.newStudentDefaultSex, this.newStudentDefaultPassword])
			}
			console.log('this.newStudentList', this.newStudentList)
		},
		// 清空新增学生数据的姓名
		clearNewStudentList () {
            this.newStudentList = []  // 解决内容更新视图没有更新
			for (let i = 0; i < this.tableRowLength; i++) {
				this.newStudentList[i] = ['', this.newStudentDefaultSex, this.newStudentDefaultPassword]
			}
		},
        // 保存学生
		saveStudent () {
			console.log('this.newStudentList', this.newStudentList)
			let data = []
			let len = this.newStudentList.length;
			let classId = this.newStudentClassId
            // console.log('this.newStudentList', this.newStudentList)
            if (!classId) {
                this.$message('请选择班级')
                return;
            }
			for (let i = 0; i < len; i ++) {
				if (this.newStudentList[i][0].length > 1) {	//姓名不能小于两个个字
					if (this.newStudentList[i][2].length >= 6) {	// 密码不小于 6 位
							this.newStudentList[i][3] = classId
							data.push(this.newStudentList[i])
					} else {
						this.$message(`第 ${i + 1} 行的密码不能少于6字个符`)
					}
				} else if (this.newStudentList[i][0].length === 1) {
						this.$message(`第 ${i + 1} 行的姓名不能少于两个字符`)
						return;
				} 
			}
            if (data.length < 1) {
                this.$message('请输入学生')
                return;
            }
			this.$http.post('/api/student/add', data).then(({data}) => {
				this.$message({message:  data.msg,type: 'success'})
				this.clearNewStudentList()
			}).catch(err => {
                this.$message.error('添加学生失败，请重试')
            })
		},
    },
}
</script>

<style lang="scss" scoped>
.add-student {
    .table {
        max-height: 400px;
        overflow: auto;
    }
    > .meta {
        padding-bottom: 10px;
        padding-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        > span {
            color: #999;
            padding-left: 5px;
            font-size: 80%;
        }
    }
}

.add-student-table {
		width: 100%;
        max-width: 700px;
		margin: 0 auto;
		position: relative;
		.add-row-btn {
			position: absolute;
			height: 30px;
			right: 0;
			bottom: 1px;
		}
		tr {
			border: 1px solid #ccc;
		}
		th,
		tr>td:first-child {
			background: #eee;
			padding: 0 2px;
		}
        tr>td:nth-child(3) {
            padding: 0 5%;
        }
		th, td {
			height: 30px;
			line-height: 30px;
			border-right: 1px solid #ccc;
			border: 1px solid #ccc;
			text-align: center;
		}
		th span {
			padding-left: 10px;
			font-size: 50%;
			color: #999;
		}
		td input {
			display: block;
			height: 100%;
			width: 100%;
			border: none;
			text-align: center;
			color: #666;
		}

}   
</style>