<template>
	<el-tabs type="border-card" class="add-paper-test">
		<!-- ----------------------------------------------------- -->
		<!-- 从题库中随机选取  -->
		<el-tab-pane label="从题库中随机选取">
			<p class="title">已选择的分类</p>
			<p class="label">
				将从
				<i>{{showCategorys.length}}</i>个分类随机抽取
				<i>{{randomSelecltTestCount}}</i> 个试题
			</p>
			<div v-show="showCategorys.length >= 1" class="content">
				<ul>
					<li v-for="item in showCategorys" :key="item.id">
						<dt>
							<!-- 删除 -->
							<h6>{{item.name}} ({{item.sum}} 道试题)</h6>
						</dt>
						<dd v-for="(type, index) in item.type" :key="index">
							<span>{{ type.tLabel }} ({{type.count}} 道试题)</span>
							抽选
							<el-input-number
								v-model="selectValue[item.id][type.tName].count"
								controls-position="right"
								:min="0"
								:max="type.count"
							></el-input-number>&nbsp;道试题
						</dd>
					</li>
				</ul>
			</div>
			<!-- el-icon-check -->
			<el-button round @click="dialogVisible = true" type="success" plain icon="el-icon-s-grid">选择分类</el-button>
			<el-button
				round
				@click="currDialogConfirm(selectValue, randomSelecltTestCount)"
				type="primary"
				plain
				v-show="showCategorys.length >= 1"
			>
				{{ currDialogConfirmBtn ? '生成中' : '确定'  }}
				<i :class="currDialogConfirmBtn ? 'el-icon-loading' : 'el-icon-check'"></i>
			</el-button>
			<!-- --------------------------------------------------------- -->
			<!-- 选择分类对话框 -->

			<el-dialog
				title="请选择试题分类"
				:visible.sync="dialogVisible"
				:modal-append-to-body="false"
				width="30%"
			>
				<div v-show="allCategorys.length < 1">
					<el-link type="info" @click="$router.push({path: '/question/add'})">该科目还没有录入试题，赶快去录入试题吧</el-link>
				</div>
				<el-checkbox-group v-model="selectedCategorys">
					<div v-for="category in allCategorys" :key="category.id">
						<el-checkbox
							:label="category"
							:disabled="!category.sum"
						>{{category.name}} ({{category.sum}}道试题)</el-checkbox>
					</div>
				</el-checkbox-group>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="success" plain @click="cetegoryDialogConfirm">确 定</el-button>
				</span>
			</el-dialog>
			<!-- --------------------------------------------------------- -->
		</el-tab-pane>
		<!-- --------------------------------------------------------- -->
		<!-- 手动从题库中选取  -->
		<el-tab-pane label="手动从题库中选取"></el-tab-pane>
		<!--  -->
		<el-tab-pane label="新增试题">
			<!-- <QuestionAdd /> -->
		</el-tab-pane>
	</el-tabs>
	<!-- 分类对话框 -->
</template>

<script>
import QuestionAdd from "@/views/question/add";
// im
export default {
	components: { QuestionAdd },
	props: { courseId: Number },
	data() {
		return {
			selectedCategorys: [], // 选择的分类
			showCategorys: [], // 选择分类之后要显示的分类
			allCategorys: [],
			dialogVisible: false,
			// randomSelecltTestCount: 0,
			show3: true,
			num: 0,
			currDialogConfirmBtn: false,
			selectValue: {
				categorys: []
				/*
				分类id: {
					单项题: {
						count: 5  // 方便以后增加其他的难度或者其他
					}
				},
				dxt: [[1, 2]] */
            },
            arr: [
                {single: []}
            ],
			randomValue: {
				/*
				分类id: {
					单选: {
						count: 5
					}
				}*/
			}
		};
    },
	computed: {
		randomSelecltTestCount() {
			let sum = 0;
			for (let i = 0; i < this.selectValue.categorys.length; i++) {
				let categoryId = this.selectValue.categorys[i];
				let category = this.selectValue[categoryId];
				for (let j = 0; j < category.types.length; j++) {
					sum += category[category.types[j]].count;
				}
			}
			return sum;
		}
	},
	watch: {
		courseId() {
			this.getCategory();
		}
	},
	created() {
		this.getCategory();
	},
	mounted() {},
	methods: {
		// 得到分类列表
		getCategory() {
			this.selectedCategorys = []; // 选择的分类
			this.showCategorys = [];
			this.$http
				.get("/api/category/get", {
					params: {
						course: this.courseId
					}
				})
				.then(({ data }) => {
					let categoryIds = [];
					data.data.map(category => {
						categoryIds.push(category.id);
					});
					this.allCategorys = data.data;
					this.getTestNumber(categoryIds);
				});
		},
		// 得到试题的数量
		getTestNumber(categoryIds) {
			this.$http
				.post("/api/getTest/number", { categoryIds })
				.then(({ data }) => {
					console.log("得到试题的数量", data);
					for (let i = 0; i < this.allCategorys.length; i++) {
						let obj = data.testNumber[this.allCategorys[i].id];
						for (let prop in obj) {
							this.allCategorys[i][prop] = obj[prop];
						}
					}
				});
		},
		getTest(tables, where) {
			this.$http
				.post("/api/getTest", {
					// tables: ["qst_single"],
					// where: {
					// 	categoryId: selectedCategorys
					// }
					tables,
					where
				})
				.then(({ data }) => {
					console.log("getTest", data);
				});
		},
		// 选择分类对话框点击确定按钮
		cetegoryDialogConfirm() {
			let data = this.selectedCategorys;
			console.log("选择分类对话框点击确定按钮,选中的数据\n", data);
			let selectValue = {
				/*分类id: {
                    types: []
					单项题: {
						count: 5
					}
				},..
                */
				categorys: []
			};
			data.map((category, index) => {
				let categoryId = category.id + "";
				selectValue.categorys.push(categoryId);
				selectValue[categoryId] = { types: [] };
				for (let type in category.type) {
					selectValue[categoryId].types.push(type);
					selectValue[categoryId][type] = {
						count: 0 // // 方便以后增加其他的难度或者其他
						// tName: category.type[type].tName // 存储tName避免每次都要用for in 循环拿表名
					};
				}
			});
			this.selectValue = selectValue;
			this.showCategorys = JSON.parse(JSON.stringify(data));
			this.dialogVisible = false;
		},
		// 当前对话框点击确定obj, count: 总数
		currDialogConfirm(obj, count) {
            if (this.currDialogConfirmBtn) return;
			if (count < 1) {
                this.$message({
                    message: "分类抽选试题不得少于1个",
					type: "warning"
				});
				return;
			}
			console.log("当前对话框点击确定obj", obj);
			this.currDialogConfirmBtn = true;
			this.$http
				.post("/api/getRandomTest", obj)
				.then(({ data }) => {
					// console.log("得到的随机试题", data);
					this.currDialogConfirmBtn = false;
					this.$emit("fixed-random-test", data.data);
				})
				.catch(err => {
					this.$message({
						message: "随机生成试题失败，请稍后重试",
						type: "warning"
					});
					this.currDialogConfirmBtn = false;
				});
		},
		// 得到随机试题
		getRandomTest(data) {
			// this.$http.post("/api/getRandomTest", data).then(({ data }) => {
			// 	console.log("data", data);
			// });
		}
	}
};
</script>

<style lang="scss" scoped>
dd {
    margin-top: 5px;
}
.add-paper-test {
	min-height: 400px;
	p.label > i {
		color: orange;
	}
}
.content {
	margin: 10px 0;
}
.title {
	font-size: 16px;
	margin-bottom: 5px;
	color: #999;
}
</style>
<style>
/* .add-paper-test.el-tabs.el-tabs--top.el-tabs--border-card {
	box-shadow: none;
	border: none;
} */
</style>


