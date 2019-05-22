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
		<!-- ========================= 第二步  ========================= -->
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
				<div class="pull-right">
					<span class="margin-right">试题类型:</span>
					<el-select v-model="acitvieTestType">
						<el-option v-for="item in testType" :key="item.name" :value="item.name" :label="item.label"></el-option>
					</el-select>
				</div>
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

			<!-- -------------------------------------------------------------------- -->
			<!-- 表格 -->
			<div class="paper-contet">
				<el-table :data="paperContent.fixed[acitvieTestType]" style="width:100%">
					<!-- 选择框  -->
					<!-- <el-table-column type="selection" width="40"></el-table-column> -->
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

					<el-table-column prop="score" label="分数" sortable width="50"></el-table-column>
					<!-- <el-table-column label="操作" width="145">
						<template slot-scope="scope">
							<el-button title="编辑" type="primary" plain @click="handleEdit(scope.$index, scope.row)">
								<i class="el-icon-edit"></i>
							</el-button>
							<el-button title="删除" type="danger" plain @click="handleDelete(scope.$index, scope.row)">
								<i class="el-icon-delete"></i>
							</el-button>
						</template>
					</el-table-column>-->

					<el-table-column label="操作" width="145">
						<template slot-scope="scope">
							<el-popover placement="bottom-status" width="80%" title="详细内容" trigger="click">
								<TestDeatil :test="scope.row"/>
								<el-button slot="reference" type="primary" plain>
									查看
									<i class="el-icon-view"></i>
								</el-button>
							</el-popover>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 表格结束 -->
			<!-- ---------------------------------------------------------------------------------- -->
		</div>
		<!-- ========================= 第三步  ========================= -->
		<div v-show="currStop === 2">
			<div>
				<PaperSetting :classList="classList" :paper="paper"/>
			</div>
		</div>

		<div v-show="currStop === 3">
			<div>
				<!-- <PaperSetting :classList="classList" :paper="paper"/> -->
				试卷预览.....
				<div>
					试卷标题：
					<b>{{paper.title}}</b>
				</div>
				<div>试卷开放时间： {{paper.startDate}} 至 {{paper.endDate}}</div>
				<span>考试总时间 {{paper.totalTime}}</span> 分钟
				<!-- <div>
                    能考试的班级 
                    <span v-show="paper.canJoinClassId.length < 1"> 所有班级可考 </span>
                    <span v-for="paper in paper.canJoinClassId"></span>
				</div>-->
				<el-button
					@click="submit"
					:disabled="handing"
					:icon="handing ? 'el-icon-loading' : 'el-icon-thumb' "
				>保存</el-button>
			</div>
		</div>
		<div class="pull-right" style="margin-top: 12px;">
			<el-button v-show="currStop !== 0" @click="backStop" type="warning" plain>上一步</el-button>
			<el-button v-show="currStop < 2" @click="nextStop" :disabled="false" type="primary" plain>下一步</el-button>
			<el-button
				v-show="currStop === 2"
				@click="submit"
				:disabled="handing"
				:icon="handing ? 'el-icon-loading' : 'el-icon-thumb' "
			>保存</el-button>
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
import TestDeatil from "@/components/test-detail";
import PaperSetting from "./paper-setting";
export default {
	components: {
		RandomTest,
		TestDeatil,
		PaperSetting
	},
	data() {
		return {
			currStop: 0,
			courseList: [],
			dialogVisible: false,
			acitvieTestType: "qst_single", // 当前激活的试题类型
			testType: [
				// 试题类型
				{
					name: "qst_single",
					label: "单项选择题"
				},
				{
					name: "qst_more",
					label: "多项选择题"
				},
				{
					name: "qst_judge",
					label: "判断题"
				},
				{
					name: "qst_gap_fillging",
					label: "填空题"
				},
				{
					name: "qst_design",
					label: "问答题"
				}
			],

			paperContent: {
				fixed: {},
				random: {}
			},
			classList: [],
			paper: {
				title: "",
				courseId: "",
				teacherId: parseInt(sessionStorage.userId),
				content: "",
				startDate: new Date(),
				endDate: new Date().getTime() + 3600 * 1000 * 24 * 7, // 往后一周
				totalTime: 60,
				status: 2,
				canJoinClassId: []
			},
			difficultLabel: ["简单", "一般", "困难"],
			handing: false
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
		info() {
			console.log("this.paper", this.paper);
		},
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
			if (this.currStop === 2) {
				// 第三步  得到能考的班级
				this.$http("/api/class/getName", {
					params: { courseId: this.paper.courseId }
				}).then(({ data }) => {
					console.log("班级列表data", data);
					this.classList = data.data;
				});
			}
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
				this.paperContent.fixed[tName] = data[tName];
			}
			console.log("this.paperContent", this.paperContent);
			this.dialogVisible = false;
		},
		submit() {
			if (this.handing) return;
			this.handing = true;
			let obj = {};
			let data = JSON.parse(JSON.stringify(this.paper));
			data.canJoinClassId = JSON.stringify(data.canJoinClassId);
			for (let fixed in this.paperContent) {
				obj[fixed] = {};
				for (let type in this.paperContent[fixed]) {
					obj[fixed][type] = [];
					this.paperContent[fixed][type].map(test => {
						obj[fixed][type].push(test.id);
					});
					// 排序
					obj[fixed][type].sort(function(a, b) {
						return a - b;
					});
				}
			}
			data.content = JSON.stringify(obj);
			this.$http
				.post("/api/paper/save", data)
				.then(({ data }) => {
					console.log("data", data);
					if (data.code === 0) {
						this.$message({ type: "success", message: data.msg });
					}
					this.handing = false;
				})
				.catch(err => {
					console.log("err", err);
					this.$message.error("保持失败请稍后重试");
					this.handing = false;
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

