<template>
	<el-tabs type="border-card" class="add-paper-test">
		<el-tab-pane label="从题库中随机选取">
			<p class="title">已选择的分类</p>
			<p>将从{{showCategorys.length}}个分类随机抽取 {{randomSelecltTestCount}} 个试题</p>
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
							<el-input-number v-model="num" controls-position="right" :min="0" :max="type.count"></el-input-number>&nbsp;道试题
						</dd>
					</li>
				</ul>
			</div>

			<el-button round @click="dialogVisible = true" type="success" plain icon="el-icon-s-grid">选择分类</el-button>
            <!-- el-icon-check -->
			<el-button round @click="currDialogConfirm" type="primary" plain v-show="showCategorys.length >= 1">
				确定
				<i :class="true ? 'el-icon-check' : 'el-icon-loading'"></i>
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
		<!--  -->
		<el-tab-pane label="手动从题库中选取"></el-tab-pane>
		<!--  -->
		<el-tab-pane label="新增试题"></el-tab-pane>
	</el-tabs>
	<!-- 分类对话框 -->
</template>

<script>
export default {
	props: {
		courseId: Number
	},
	data() {
		return {
			selectedCategorys: [], // 选择的分类
			showCategorys: [], // 选择分类之后要显示的分类
			allCategorys: [],
			dialogVisible: false,
			randomSelecltTestCount: 0,
			show3: true,
			num: 0,
			selectValue: {
				分类id: {
					单项题: {
						count: 5
					}
				},
				dxt: [[1, 2]]
			},
			randomValue: {
				分类id: {
					单选: {
						count: 5
					}
				}
			}
		};
	},
	watch: {
		courseId() {
			this.getCategory();
		}
	},
	created() {
		console.log("created");
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
					console.log("data", data);
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
					console.log("0000000000000000000");
					console.log("data", data);
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
					console.log("data", data);
				});
		},
		// 得到随机试题
		getRandomTest() {
			this.$http
				.post("/api/getRandomTest", {
					data: {
						23: {
							qst_single: 5
						},
						24: {
							qst_single: 6
						}
					}
				})
				.then(({ data }) => {
					console.log("data", data);
				});
		},
		// 选择分类对话框点击确定按钮
		cetegoryDialogConfirm() {
			this.showCategorys = JSON.parse(
				JSON.stringify(this.selectedCategorys)
			);
			console.log("this.selectedCategorys", this.selectedCategorys);
			this.dialogVisible = false;
        },
        // 当前对话框点击确定
        currDialogConfirm () {
            console.log('当前对话框点击确定')   
        }
	}
};
</script>

<style lang="scss" scoped>
.add-paper-test {
	min-height: 400px;
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
.add-paper-test.el-tabs.el-tabs--top.el-tabs--border-card {
	box-shadow: none;
	border: none;
}
</style>


