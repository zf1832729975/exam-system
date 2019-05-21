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
				<el-radio-group v-model="paper.way" style="margin-right: 10px;">
					<el-radio label="fixed" border>固定</el-radio>
					<el-radio label="random" border>随机</el-radio>
					<el-radio label="both" border>固定+随机</el-radio>
				</el-radio-group>
			</div>
			<div class="test">
				<div class="add-test-btn">
					<el-button icon="el-icon-circle-plus-outline" @click="dialogVisible = true">添加试题</el-button>
				</div>
				<el-dialog class="add-paper-test-dialog" :visible.sync="dialogVisible" width="70%">
					<!-- <AddDialog :courseId="paper.courseId" @fixed-random-test="fixedRandomTest"/> -->
					<RandomTest :courseId="paper.courseId" @fixed-random-test="fixedRandomTest"/>
					<!-- <span slot="footer" class="dialog-footer">
						<el-button @click="dialogVisible = false">取 消</el-button>
						<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
					</span>-->
				</el-dialog>
			</div>

			<div class="paper-contet">
				<el-table :data="paperContent.fixed.qst_single" style="width:100%">
					<!-- 选择框  -->
					<el-table-column type="selection" width="40"></el-table-column>
					<el-table-column type="index" column-key="index"></el-table-column>
					<el-table-column
						prop="qstStem"
						label="试题标题"
						sortable
						:show-overflow-tooltip="true"
						header-align="center"
						align="center"
					>
						<template slot-scope="scope">
							<p v-html="delHtmlTag(scope.row.qstStem)"></p>
						</template>
					</el-table-column>
					<el-table-column
						prop="difficult"
						label="试题难度"
						width="100"
						:filters="[{ text: '简单', value: 1 }, { text: '一般', value: 2 }, { text: '困难', value:3}]"
						:filter-method="filterdifficult"
						filter-placement="bottom-end"
					>
						<template slot-scope="scope">
							<el-tag
								:type="scope.row.difficult === 1 ? 'primary' : ((scope.row.difficult === 2) ? 'success' :  'info')"
								disable-transitions
							>{{difficultLabel[scope.row.difficult - 1]}}</el-tag>
						</template>
					</el-table-column>

					<el-table-column prop="teacherName" label="教师" sortable width="72"></el-table-column>
					<el-table-column prop="category" label="试题分类" sortable width="100"></el-table-column>
					<el-table-column
						prop="type"
						label="题型"
						width="72"
						:filters="[{ text: '单选题', value: '单选题' }, { text: '多选题', value: '多选题' }, { text: '简答题', value: '简答题'}, { text: '判断题', value: '判断题'}]"
						:filter-method="filterType"
					></el-table-column>
					<el-table-column prop="score" label="分数" sortable width="50"></el-table-column>
					<el-table-column label="操作" width="145">
						<template slot-scope="scope">
							<el-button title="编辑" type="primary" plain @click="handleEdit(scope.$index, scope.row)">
								<i class="el-icon-edit"></i>
							</el-button>
							<el-button title="删除" type="danger" plain @click="handleDelete(scope.$index, scope.row)">
								<i class="el-icon-delete"></i>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div style="margin-top: 12px;">
			<el-button v-show="currStop !== 0" @click="backStop" type="warning" plain>上一步</el-button>
			<el-button @click="nextStop" :disabled="false">下一步</el-button>
		</div>
	</div>
</template>

<script>
/*
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
			category: {
				// 分类，来自于哪个分类，
				categoryId1: 20, // 分类 1 20道
				categoryId2: 30, // 分类 1 30道
				categoryId3: "random" // 分类 3 随机， 现在不考虑最多最少多少道题
				// 如果还有剩余的就从剩下的分类中选
			}
		},
		more: {
			count: 100, // 多选题数, 默认100道
			difficulty: {
				// 难度选择， 现在不考虑
			},
			category: {
				// 分类，来自于哪个分类
				categoryId1: 20, // 分类 1 20道
				categoryId2: 30, // 分类 1 30道
				categoryId3: "random" // 分类 3 随机
			}
		}
	}
};
*/

/* // 查看记录
// 考试记录内容
let examRecordContent = {
    qst_single: {
        // 试题的id要自增
        test: ["试题id1", "试题id2"],
        answer:["answer1", "anser2"]
    },
    qst_more: [
        ["试题id", "学生答案"]
    ]
}*/
// 必须要排序规则一样
/*
let table = ['qst_more', 'qst_single']
table.map((tName, i) => {
   if (examRecordContent[tName]) {
       db.query(`SELECT * FROM ${tName} WHERE id in (?)`,  [examRecordContent[tName].test], result => {

       })
   }
})
// mysql> select id, answer from qst_single where id in (23234, 2345, 78, 23, 14, 48, 47, 32,12);
// +----+--------+
// | id | answer |
// +----+--------+
// | 23 |      3 |
// | 32 |      2 |
// | 47 |      2 |
// | 48 |      1 |
// +----+--------+
// 4 rows in set (0.00 sec)
// id从小到大排序了
*/
// import AddDialog from "./add-dialog";
import RandomTest from "./random-test";

export default {
	components: {
		// AddDialog
		RandomTest
	},
	data() {
		return {
			currStop: 0,
			courseList: [],
			dialogVisible: false,
			paperContent: {
				fixed: {},
				random: {}
			},
			paper: {
				way: "fixed",
				title: "",
				courseId: "",
				teacherId: sessionStorage.userId,
				content: "",
				startDate: null,
				endDate: null,
				totalTime: ""
			},
			difficultLabel: ["简单", "一般", "困难"]
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
		delHtmlTag(str) {
			return str.replace(/<[^>]+>/g, "");
		},
		filterdifficult(value, row) {
			return row.difficult === value;
		},
		filterType(value, row) {
			return row.type === value;
		},
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
		},
		// 固定试题随机数据
		fixedRandomTest(data) {
			console.log("parent");
			console.log("固定试题随机数据data", data);
            // this.paperContent.fixed.qst_single = data.qst_single;
            for (let tName in data) {
                this.paperContent.fixed[tName] = data[tName]
            }
			console.log("this.paperContent", this.paperContent);
			this.dialogVisible = false;
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
	margin: 15px 0;
	// .add-test-btn {
	// 	position: absolute;
	// 	top: 40%;
	// 	left: 47%;
	// }
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

