<template>
	<!-- 试卷管理 -->
	<div class="paper">
		<el-button icon="el-icon-circle-plus" type="success" plain @click="$router.push({path: '/paper/add'})">新增试卷</el-button>

		<ul class="paper-list">
			<li v-for="item in paperList" :key="item.id">
				<div>试卷名: {{ item.name }}</div>
				<div>科目名: {{ item.Paper_Course_name }}</div>
				<div>考试开始时间: {{ item.startDate }}</div>
				<div>考试结束时间: {{ item.endDate }}</div>
				<div>考试总时间: {{ item.totalTime }}</div>
			</li>
		</ul>

		<!-- 新增试卷 对话框 -->
		<el-dialog class="dialog" title="新增试卷" :visible.sync="dialogAddPaperVisible">
			<p class="label">科目名称</p>
			<el-select v-model="addPaperForm.courseId" placeholder="请选择科目">
				<el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
			<p class="label">试卷名称</p>
			<el-input v-model="addPaperForm.title" autocomplete="off" placeholder="请输入试卷名称"></el-input>
			<div class="btn-group">
				<el-button @click="dialogAddPaperVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPaper">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			paperList: [],
			courseList: [],
			addPaperForm: {
				title: "",
				courseId: "",
				teacherId: sessionStorage.userId,
				content: "",
				startDate: null,
				endDate: null,
				totalTime: ""
			},
			dialogAddPaperVisible: false
		};
	},
	created() {
		this.getCourseList();
		// this.getPaperList()
	},
	methods: {
		// 得到课程列表
		getCourseList() {
			this.$http("/api/getcourselist", {
				params: {
					userId: sessionStorage.userId,
					role: sessionStorage.role
				}
			}).then(res => {
				console.log("res", res);
				this.courseList = res.data;
			});
		},
		// 得到试卷列表
		getPaperList() {
			this.$http("/api/getpaperlist", {
				params: { teacherId: sessionStorage.userId }
			}).then(res => {
				this.paperList = res.data;
				console.log("res", res);
				console.log("sessionStorage.userId ", sessionStorage.userId);
			});
		},
		// 新增试卷
		addPaper(title, courseId) {
			//  let { title, courseId, teacherId } = req.query
			console.log("000000000000000000000000");
			console.log("this.addPaperForm", this.addPaperForm);
			this.$http("/api/paper/save", {
				params: this.addPaperForm
			}).then(res => {
				this.$message(res.data.msg);
				if (res.data.code === 0) {
					this.dialogAddPaperVisible = false;
				}
			});
		}
	}
};
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