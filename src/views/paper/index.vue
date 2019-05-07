<template>
<!-- 试卷管理 -->
	<div class="paper">
	  	<el-button icon="el-icon-plus" type="primary" size="mini" @click="dialogAddPaperVisible=true">新增试卷</el-button>

		<ul class="paper-list">
			<li v-for="item in paperList" :key="item.Paper_id">
				<div>试卷名: {{ item.Paper_name }}</div>
				<div>科目名: {{ item.Paper_Course_name }}</div>
				<div>考试开始时间: {{ item.Paper_start_time }}</div>
				<div>考试结束时间: {{ item.Paper_end_time }}</div>
				<div>考试总时间: {{ item.Paper_total_time }}</div>
			</li>
		</ul>
		

	  	<!-- 新增试卷 对话框 -->
		<el-dialog class="dialog" title="新增试卷" :visible.sync="dialogAddPaperVisible">
			<p class="label">科目名称</p>
			<el-select v-model="addPaperForm.courseName" placeholder="请选择科目">
				<el-option
				v-for="item in courseList"
				:key="item.Course_id"
				:label="item.Course_name"
				:value="item.Course_name">
				</el-option>
			</el-select>
			<p class="label">试卷名称</p>
			<el-input v-model="addPaperForm.paperName" autocomplete="off" placeholder="请输入试卷名称"></el-input>
			<div class="btn-group">
				<el-button @click="dialogAddPaperVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPaper">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data () {
		return {
			paperList: [],
			courseList: [],
			addPaperForm: { paperName: '', courseName: '', teacherId: sessionStorage.userId },
			dialogAddPaperVisible: false
		}
	},
	created () {
		// this.getCourseList()
		this.getPaperList()
	},
	methods: {
		// 得到课程列表
		getCourseList () {
			this.$http('/api/getcourselist', {
				params: { 
					userId: sessionStorage.userId,
					role: sessionStorage.role
				}
			}).then(res => {
				console.log('res', res)
				this.courseList = res.data
			})
		},
		// 得到试卷列表
		getPaperList () {
			this.$http('/api/getpaperlist',  { 
				params: { teacherId: sessionStorage.userId } 
			}).then(res => {
				this.paperList = res.data
				console.log('res', res)
				console.log('sessionStorage.userId ', sessionStorage.userId )
			})
		},
		// 新增试卷 
		addPaper (paperName, courseName) {
			//  let { paperName, courseName, teacherId } = req.query
			this.$http('/api/newpaper', {
				params: this.addPaperForm
			}).then(res => {
				this.$message(res.data.msg)
				if (res.data.code === 0) {
					this.dialogAddPaperVisible = false
				} 
			})
		}
	}
	
}
</script>

<style lang="scss">
.paper {
	.dialog .el-dialog__body {
		.label {
			padding-top: 8px;
			padding-bottom: 3px;
		}
		.btn-group {
			padding: 10px;
			text-align: right;
		}
	}
}
</style>