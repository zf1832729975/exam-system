<template>
	<div>
		<el-form :inline="true">
			<el-form-item>
				<el-input v-model="search" placeholder="学号或姓名"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button>查询</el-button>
				<el-button type="primary" @click="newStudentDialogVisible = true">新增</el-button>
				<el-button type="danger" :disabled="!checkBoxSelected" @click="batchDel">批量删除</el-button>
				<el-button type="info" @click="batchEditor">批量编辑</el-button>
				<el-button type="info" @click="getClassStudent">刷新</el-button>
			</el-form-item>
		</el-form>
		<el-row :gutter="10" class="class">
			<el-table
				:data="teacherList"
				row-key="id"
				style="width: 100%"
				ref="table"
				@selection-change="handleSelectionChange"
			>
				<!-- 选择框  -->
				<el-table-column type="selection" width="40"></el-table-column>
				<el-table-column prop="id" label="教师号"></el-table-column>
				<el-table-column prop="name" label="姓名"></el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="specialty" label="专业"></el-table-column>
				<el-table-column label="操作" width="145">
					<template slot-scope="scope">
						<el-button title="编辑" type="primary" plain @click="edior(scope.$index, scope.row)">
							<i class="el-icon-edit"></i>
						</el-button>
						<el-button title="删除" type="danger" plain @click="singleDel(scope.$index, scope.row)">
							<i class="el-icon-delete"></i>
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>
		<!-- <el-dialog class="new-student-dialog" title="新增学生" :visible.sync="newStudentDialogVisible"> -->
		<NewTeacher :classList="classList"/>
		<!-- </el-dialog> -->
	</div>
</template>

<script>
import NewTeacher from "./new-teacher.vue";
export default {
	data() {
		return {
			classList: [],
			studentData: [],
			teacherList: [],
			selectClassId: "",
			checkBoxSelected: false,
			search: "",
			newStudentDialogVisible: false,
			multipleSelection: [],
			isHandling: false // 在操作中， 增删改查
		};
	},
	components: {
		NewTeacher
	},
	created() {
		this.getTeacherList();
	},
	methods: {
		// 得到班级列表
		getTeacherList() {
			this.$http("/api/teacher/list").then(({ data }) => {
			    console.log("data", data);
				this.teacherList = data.data;
			});
		},
		getClassList() {
			this.$http("/api/class/get").then(res => {
				this.selectClassId = res.data.data[0].id;
				this.newStudentClassId = res.data.data[0].id;
				this.classList = res.data.data;
				this.getClassStudent();
			});
		},
		// 得到一个班级的所有学生
		getClassStudent() {
			this.$http("/api/class/getStudentList", {
				params: { classId: this.selectClassId }
			})
				.then(res => {
					this.studentDataList[this.selectClassId] = res.data;
					this.studentData = res.data;
				})
				.catch(err => {});
		},
		classClick(item) {
			this.selectClassId = item.id;
			//   没有值
			if (!this.studentDataList[this.selectClassId]) {
				this.getClassStudent();
			} else {
				this.studentData = this.studentDataList[this.selectClassId];
			}
		},
		// 批量编辑
		batchEditor() {
			console.log("===================", this.$refs.table);
		},
		edior() {},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			if (val.length < 1) {
				this.checkBoxSelected = false;
			} else {
				this.checkBoxSelected = true;
			}
		},
		// 批量删除
		batchDel() {
			if (this.isHandling) return;
			this.isHandling = true;
			let data = [];
			this.multipleSelection.map(item => {
				data.push(item.id);
			});
			this.$http
				.post("/api/student/del", data)
				.then(({ data }) => {
					this.$message({
						message: data.msg,
						type: data.type
					});
					this.isHandling = false;
				})
				.catch(err => {
					this.isHandling = false;
				});
		},
		// 单个删除
		singleDel(index, row) {
			if (this.isHandling) return;
			this.isHandling = true;
			this.$http.post("/api/student/del", [row.id]).then(({ data }) => {
				this.$message({
					message: data.msg,
					type: data.type
				});
				this.studentDataList[this.selectClassId].splice(index, 1);
				this.isHandling = false;
			});
		}
	}
};
</script>

<style lang="scss" >
</style>