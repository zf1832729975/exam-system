<template>
	<div style="padding: 10px 10%;">
		<el-row :gutter="10" class="class">
			<!-- 班级 -->
			<el-col :sm="10" :md="8" :lg="5">
				<el-menu>
					<el-menu-item
						v-for="item in classList"
						:index="item.id + ''"
						:key="item.id"
						@click="classClick(item)"
						contextmenu="showMenu"
					>
						<i class="el-icon-s-home"></i>
						<span>{{item.name}}</span>
					</el-menu-item>
				</el-menu>
			</el-col>
			<el-col :sm="12" :md="14" :lg="14">
				<el-form :inline="true">
					<el-form-item>
						<el-input v-model="search" placeholder="学号或姓名"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search">查询</el-button>
						<el-button type="primary" @click="newStudentDialogVisible = true" icon="el-icon-plus">新增</el-button>
						<el-button
							type="danger"
							:disabled="!checkBoxSelected"
							@click="batchDelStudent"
							icon="el-icon-delete"
						>批量删除</el-button>
						<!-- <el-button type="info" @click="batchEditor" icon="el-icon-edit">批量编辑</el-button> -->
						<el-button type="success" @click="getClassStudent" plain>
							{{ refreshing ? '加载中' : '刷新'}}
							<i
								:class=" refreshing ? 'el-icon-loading' : 'el-icon-refresh'"
							></i>
						</el-button>
					</el-form-item>
				</el-form>
				<!-- 学生表格 -->
				<el-table
					:data="studentData"
					row-key="id"
					style="width: 100%"
					ref="studentTable"
					v-loading="refreshing"
					@selection-change="handleSelectionChange"
				>
					<!-- 选择框  -->
					<el-table-column type="selection" width="40"></el-table-column>
					<el-table-column prop="id" label="学号"></el-table-column>
					<el-table-column prop="name" label="姓名"></el-table-column>
					<el-table-column prop="sex" label="性别"></el-table-column>
					<el-table-column label="操作" width="145">
						<template slot-scope="scope">
							<el-button
								title="编辑"
								type="primary"
								plain
								@click="editorStudentSelect(scope.$index, scope.row)"
							>
								<i class="el-icon-edit"></i>
							</el-button>
							<el-button title="删除" type="danger" plain @click="singleDelStudent(scope.$index, scope.row)">
								<i class="el-icon-delete"></i>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
		<el-dialog class="new-student-dialog" title="新增学生" :visible.sync="newStudentDialogVisible">
			<NewStudent :classList="classList"/>
		</el-dialog>
		<el-dialog class="new-student-dialog" title="编辑学生" :visible.sync="editorStudentDialogVisible">
			<el-form :inline="false" style="padding: 5px 5%;">
				<el-form-item label="班级">
					<el-select v-model="editorStudent.classId" placeholder="活动区域">
						<el-option :label="item.name" :value="item.id" v-for="item in classList" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="学号">
					<el-input v-model="editorStudent.id" type="number" min="1"></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="editorStudent.name"></el-input>
				</el-form-item>

				<el-form-item label="性别">
					<el-switch
						style="display: block"
						v-model="editorStudent.sex"
						active-color="#13ce66"
						inactive-color="#ff4949"
						active-text="男"
						active-value="男"
						inactive-text="女"
						inactive-value="女"
					></el-switch>
				</el-form-item>
				<el-form-item label="密码">
					<div class="el-input el-input--mini el-input--suffix">
						<input class="el-input__inner" v-model="editorStudent.password">
					</div>
					<span style="font-size:50%;color:#858585;">提示： 如果要更改原密码就输入密码，不更改密码就不输入</span>
				</el-form-item>
				<el-form-item label="密码">
					<el-button @click="editorStudentSubmit(editorStudent)" type="success" plain>修改</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import NewStudent from "./new-student.vue";
export default {
	data() {
		return {
			classList: [],
			studentData: [],
			studentDataList: {},
			selectClassId: "",
			checkBoxSelected: false,
			search: "",
			newStudentDialogVisible: false,
			editorStudentDialogVisible: false,
			editorStudent: {},
			multipleSelection: [],
			isHandling: false, // 在操作中， 增删改查
			refreshing: true // 刷新中
		};
	},
	components: {
		NewStudent
	},
	created() {
		this.getClassList();
	},
	methods: {
		// 得到班级列表
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
			this.refreshing = true;
			this.$http("/api/class/getStudentList", {
				params: { classId: this.selectClassId }
			})
				.then(res => {
					this.studentDataList[this.selectClassId] = res.data;
					this.studentData = res.data;
					this.refreshing = false;
				})
				.catch(err => {
					this.refreshing = false;
				});
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
			console.log("===================", this.$refs.studentTable);
		},
		editorStudentSelect(index, row) {
			console.log("index, row", index, row);
			this.editorStudent = JSON.parse(JSON.stringify(row));
			this.editorStudent.password = "";
			this.editorStudent.oldId = row.id;
			this.editorStudentDialogVisible = true;
		},
		editorStudentSubmit(student) {
			console.log("typeof student.id", parseInt(student.id));
			if (!student.id) {
				this.$message({
					message: "学号不能为和0",
					type: "warning"
				});
				return;
			}
			if (student.password) {
				if (student.password.length < 6) {
					this.$message({
						message: "密码不能小于6位",
						type: "warning"
					});
					return;
				}
			} else {
				delete student.password;
			}
			let oldId = student.oldId;
			delete student.oldId;
			console.log("student", student);
			this.$http("api/userInfo/editor", {
				params: {
					data: student,
					oldId,
					table: "student"
				}
			})
				.then(({ data }) => {
					if (data.code === 0) {
						this.$message({
							type: data.type,
							message: data.msg
						});
                    }
                    this.editorStudentDialogVisible = false
				})
				.catch(err => {
					this.$message.error("修改失败");
				});
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			if (val.length < 1) {
				this.checkBoxSelected = false;
			} else {
				this.checkBoxSelected = true;
			}
		},
		// 批量删除
		batchDelStudent() {
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
		singleDelStudent(index, row) {
			if (this.isHandling) return;

			this.$confirm("此操作将永久删除该学生, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				this.isHandling = true;
				this.$http
					.post("/api/student/del", [row.id])
					.then(({ data }) => {
						this.$message({
							message: data.msg,
							type: data.type
						});
						this.studentDataList[this.selectClassId].splice(
							index,
							1
						);
						this.isHandling = false;
					})
					.catch(() => {
						this.isHandling = false;
					});
			});
		}
	}
};
</script>

<style lang="scss" >
.class {
	.el-menu {
		padding-top: 10px;
		> .el-menu-item {
			height: 28px;
			line-height: 28px;
		}
	}
}
.new-student-dialog .el-dialog__body {
	padding: 20px 0;
}
</style>