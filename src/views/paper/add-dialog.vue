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
							<el-input-number v-model="num" controls-position="right" :min="0" :max="type.count"></el-input-number>道试题
						</dd>
					</li>
				</ul>
			</div>

			<el-button round @click="dialogVisible = true" type="success" plain icon="el-icon-s-grid">选择分类</el-button>
			<el-dialog
				title="请选择试题分类"
				:visible.sync="dialogVisible"
				:modal-append-to-body="false"
				width="30%"
			>
				<el-checkbox-group v-model="selectedCategorys">
					<div v-for="category in allCategorys" :key="category.id">
						<el-checkbox
							:label="category"
							:disabled="!category.sum"
						>{{category.name}} ({{category.sum}} 道试题)</el-checkbox>
					</div>
				</el-checkbox-group>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button
						type="success"
						plain
						@click="showCategorys = selectedCategorys;  dialogVisible = false;"
					>确 定</el-button>
				</span>
			</el-dialog>
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
			allCategorys: "",
			dialogVisible: false,
			randomSelecltTestCount: 0,
			show3: true,
			num: 0
		};
	},
	created() {
		this.getCategory();
	},
	mounted() {},
	methods: {
		// 得到分类列表
		getCategory() {
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
		}
	}
};
</script>

<style lang="scss" scoped>
.add-paper-test {
	min-height: 600px;
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

