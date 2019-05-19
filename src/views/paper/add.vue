<template>
	<div class="add-paper">
		<h4>添加试卷</h4>
		<el-steps :active="currStop" finish-status="success">
			<el-step title="选择分类"></el-step>
			<el-step title="选择试题"></el-step>
			<el-step title="试卷设置"></el-step>
		</el-steps>
		<div v-show="currStop === 0">
			<p class="label">科目名称（所属科目）</p>
			<el-select v-model="paper.courseId" placeholder="请选择科目">
				<el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
			<p class="label">试卷标题</p>
			<el-input v-model="paper.title" autocomplete="off" placeholder="请输入试卷标题"></el-input>
		</div>
		<div v-show="currStop === 1">
			<div>
				<span>组卷方式</span>
				<el-radio-group v-model="paper.way">
					<el-radio label="fixed" border>固定</el-radio>
					<el-radio label="random" border>随机</el-radio>
					<el-radio label="both" border>固定+随机</el-radio>
				</el-radio-group>
			</div>
			<div class="test">
				<div class="add-test-btn">
					<el-button icon="el-icon-circle-plus-outline" @click="dialogVisible = true">添加试题</el-button>
				</div>
				<el-dialog class="add-paper-test-dialog" :visible.sync="dialogVisible">
					<AddDialog :courseId="paper.courseId"/>
					<span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
					</span>
				</el-dialog>
			</div>
		</div>
		<div style="margin-top: 12px;">
			<el-button v-show="currStop !== 0"  @click="backStop" type="warning" plain>上一步</el-button>
			<el-button  @click="nextStop" >下一步</el-button>
		</div>
	</div>
</template>

<script>
import AddDialog from "./add-dialog";
export default {
	components: {
		AddDialog
	},
	data() {
		return {
			currStop: 0,
			courseList: [],
			dialogVisible: false,
			paper: {
				way: "fixed",
				title: "",
				courseId: "",
				teacherId: sessionStorage.userId,
				content: "",
				startDate: null,
				endDate: null,
				totalTime: ""
			}
		};
	},
	created() {
		this.getCourseList();
		window.onbeforeunload = function(e) {
			e = e || window.event;
			// 兼容IE8和Firefox 4之前的版本
			if (e) {
				e.returnValue = "关闭提示";
			}
			// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
			return "关闭提示";
		};
	},
	methods: {
		backStop() {
			this.currStop--;
		},
		nextStop() {
			if (this.currStop === 0) {
				if (!this.paper.courseId) {
					this.$message({
						message: "请选择科目",
						type: "warning"
					});
					return;
				}
				if (this.paper.title !== 0 && !this.paper.title) {
					this.$message({
						message: "请输入试题标题",
						type: "warning"
					});
					return;
				}
			}
			if (this.currStop++ > 2) this.currStop = 0;
		},
		// 得到课程列表
		getCourseList() {
			this.$http("/api/getcourselist", {
				params: {
					userId: sessionStorage.userId,
					role: sessionStorage.role
				}
			}).then(res => {
				console.log("科目列表", res);
				this.courseList = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
.add-paper {
	padding: 10px;
	max-width: 920px;
	margin: 0 auto;
}
.test {
	// min-height: 200px;
	.add-test-btn {
		position: absolute;
		top: 40%;
		left: 47%;
	}
}
.add-paper-test-dialog > .el-dialog {
	> .el-dialog__header {
		// height: 0;
		display: none;
	}
	> .el-dialog__body {
		padding: 0;
	}
}
</style>

