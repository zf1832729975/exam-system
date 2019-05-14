<template>
	<!-- 题库管理 -->
	<div class="question">
		<!-- xs、sm、md、lg 和 xl。 -->
		<el-row :gutter="10">
			<el-col class="categorys" :sm="6" :md="4" :lg="4">
				<p class="title">分类列表</p>
				<el-button type="primary" icon="el-icon-plus" @click="newDialogFormVisible=true">新增分类</el-button>
				<el-button type="danger" icon="el-icon-delete-solid" plain @click="delCategory" :disabled="$refs.categoryTree && $refs.categoryTree.getCheckedKeys().length<1">删除分类</el-button>
				<el-input placeholder="搜索分类" v-model="search">
					<el-button slot="append" icon="el-icon-search" ></el-button>
				</el-input>
				<!-- <el-menu>
					<el-menu-item
						v-for="category in categorys"
						:key="category.id"
						@click="categoryClick(category)"
						contextmenu="showMenu"
					>
						<i class="el-icon-folder"></i>
						<span>{{category.name}}</span>
					</el-menu-item>
				</el-menu> -->

				<el-tree
					class="filter-tree"
					:data="categorys"
					:props="defaultProps"
					show-checkbox
					default-expand-all
					node-key="id"
					:filter-node-method="filterNode"
					ref="categoryTree">
				</el-tree>

			</el-col>
			<el-col class="list" :sm="16" :md="16" :lg="16">
				<p class="title">试题列表</p>
				<el-button-group>
					<el-button icon="el-icon-plus" type="primary" @click="$router.push({path: '/question/add'})">新增试题</el-button>
					<el-button icon="el-icon-upload">导入试题</el-button>
					<el-input placeholder="输入题目标题搜索试题" v-model="listSearch">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
					<el-button icon="el-icon-delete-solid">删除试题</el-button>
				</el-button-group>
				<!-- 表格 -->
				<el-table :data="filterAndPageing" style="width:100%">
					<!-- 选择框  -->
					<el-table-column type="selection" width="40"></el-table-column>
					<el-table-column type="index" column-key="index"></el-table-column>
					<el-table-column prop="title" label="试题标题" sortable
						:show-overflow-tooltip="true" header-align="center" align="center"
					></el-table-column>
					<el-table-column
						prop="difficulty"
						label="试题难度"
						width="100"
						:filters="[{ text: '简单', value: '简单' }, { text: '一般', value: '一般' }, { text: '困难', value: '困难'}]"
						:filter-method="filterDifficulty"
						filter-placement="bottom-end"
					>
						<template slot-scope="scope">
							<el-tag
								:type="scope.row.difficulty === '简单' ? 'primary' : ((scope.row.difficulty === '一般') ? 'success' :  'info')"
								disable-transitions
							>{{scope.row.difficulty}}</el-tag>
						</template>
					</el-table-column>

					<el-table-column prop="author" label="作者" sortable width="72"></el-table-column>
					<el-table-column prop="category" label="试题分类" sortable width="100"></el-table-column>
					<el-table-column prop="type" label="题型" width="72"
							:filters="[{ text: '单选题', value: '单选题' }, { text: '多选题', value: '多选题' }, { text: '简答题', value: '简答题'}, { text: '判断题', value: '判断题'}]"
						:filter-method="filterType"
					>

					</el-table-column>
					<el-table-column prop="score" label="分数" sortable width="50"></el-table-column>
					<el-table-column label="操作" width="145">
						<template slot-scope="scope">
							<el-button 	title="编辑" type="primary" plain @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
							<el-button  title="删除" type="danger" plain @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
						</template>
					</el-table-column>
				</el-table>

				<!-- 分页 -->
				<el-pagination
					background
					layout="prev, pager, next"
					:total="tableData.length"
					@current-change="pageChange"
				></el-pagination>
			</el-col>
		</el-row>

		<!-- 新增科目分类对话框 -->
		<el-dialog class="dialog" title="新增分类" :visible.sync="newDialogFormVisible" style="max-width:800px; margin:0 auto;">
			<el-select v-model="courseId" size="media">
				<el-option v-for="item in categorys" :key="item.id" :value="item.id" :label="item.name"></el-option>
			</el-select>
			<el-input v-model="newCategoryName" autocomplete="off" placeholder="输入分类名称" size="media"></el-input>
			<el-button @click="newDialogFormVisible = false" size="small">取 消</el-button>
			<el-button type="primary" @click="newCategory" size="small">确 定</el-button>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			
			search: "",
			listSearch: "",
			loading: true, // 加载中
			pageSize: 12, // 分页每一页的大小
			currentPage: 1, // 当前页
			categorys: [],
			pecialty: '',	// 专业id
			courseId: '', // 新建科目名
			newCategoryName: '', 
			newDialogFormVisible: false,
			tableData: [
				{
					title: "2+345894*7934893459*3459358",
					difficulty: "简单",
					author: "王小虎",
					category: "C语言",
					type: "单选题",
					score: 1
				},
				{
					title: "水的密度是多少",
					difficulty: "简单",
					author: "李东",
					category: "物理",
					type: "单选题",
					score: 1
				},
				{
					title: "拖拽会用到哪些事件",
					difficulty: "困难",
					author: "王瑾",
					category: "网页制作",
					type: "简答题",
					score: 15
				},
				{
					title: "一个200*200的div在不同分辨率屏幕上下左右居中，用css实现",
					difficulty: "一般",
					author: "王瑾",
					category: "网页制作",
					type: "简答题",
					score: 10
				}
			],
			defaultProps: {
				children: 'children',
				label: 'name'
			}
		};
	},
	computed: {
		// 过滤表格的数据并且分页
		filterAndPageing () {
			let filterData = this.tableData.filter(
				data =>  !this.listSearch || data.title.toLowerCase().includes(this.listSearch.toLowerCase())
			);
			if (this.listSearch) {
				// 在搜索的时候就不进行分页了,全部搜索到的都显示出来
				return filterData;
			} else {
				return filterData.slice(
					(this.currentPage - 1) * this.pageSize,
					this.currentPage * this.pageSize
				);
			}
		}
	},
	created () {
		this.getCategoryList()
	},
	watch: {
		search(val) {
			this.$refs.categoryTree.filter(val);
		}
	},
	methods: {
		getCategoryList () {
			this.$http('/api/getcourselist').then(res => {
					console.log('res.data', res.data)
					this.categorys = res.data
					this.courseId = res.data[0].id
					this.pecialty = res.data[0].pecialty
				})	
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.name.toLowerCase().includes(value.toLowerCase());
		},
		// 新增分类
		newCategory () {
			// console.log('asdk')
			let { courseId, pecialty,  newCategoryName} = this
			if (courseId) {
				this.$http('/api/newcourse', {
					params: {
						courseId,
						pecialty,
						newCategoryName
					}
				}).then(res => {
					if (res.data.code === 0) {
						this.newDialogFormVisible = false
						// this.categorys.push(res.data.data)
						this.getCategoryList()
						this.$message(res.data.msg)
					} 
				})
			} else {
				this.$message.error('课程名不能为空')
			}			
		},
		//   分类点击
		categoryClick(category) {
			console.log("category", category);
		},
		handleEdit(index, row) {
			console.log("index, row", index, row);
		},
		handleDelete(index, row) {
			console.log("index, row", index, row);
		},
		filterDifficulty(value, row) {
			return row.difficulty === value;
		},
		filterType (value, row) {
			return row.type === value;
		},
		pageChange(currentPage) {
			this.currentPage = currentPage;
		},
		showMenu (parameter) {
			parameter.preventDefault()
			var x = parameter.clientX
			var y = parameter.clientY
			console.log('asdkfljal;')
			this.entityTreeContextMenu.axios = { x, y }
		},
		// 删除分类  
		delCategory () {
			if (this.$refs.categoryTree.getCheckedKeys().length < 1){
				this.$message('请选择分类'); return false;
			}
			this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// console.log('this.$refs.categoryTree.getCheckedKeys()', this.$refs.categoryTree.getCheckedKeys())
				console.log('this.$refs.categoryTree', this.$refs.categoryTree.getCheckedNodes())
				let arr = this.$refs.categoryTree.getCheckedNodes()
				let data = []
				arr.map(item => {
					// 没有孩子
					if (!item.children) {
						console.log('item', item)
						data.push(item.id + '');
					}
				})
				console.log('data', data)
				this.$http('/api/category/del', {
					params: {
						data: data
					}
				}).then(res => {
					this.getCategoryList()
					this.$message(res.data.msg)
				});
			})
		}
	}
};
</script>

<style lang="scss" >
.title {
		font-size: 14px;
		font-weight: bold;
		padding: 5px 0;
}
.categorys {
	.el-button {
		// padding: 6px 15px;
		// width: 100%;
		// border-radius: 0%;
		margin: 5px 0;
	}
	.el-input {
		margin: 5px;
	}
	.el-menu {
		.el-menu-item {
			height: 25px;
			line-height: 25px;
			i {
				color: #dfba49;
			}
		}
	}
}
.list {
	.el-button-group {
		.el-input,
		> .el-button {
			padding-top: 6px;
			padding-bottom: 6px;
			margin: 0 2px;
		}
		.el-input {
			width: 200px;
			padding-top: 0;
			> .el-input-group__append,
			> .el-input__inner {
				height: 28px;
			}
		}
	}
}
</style>

<style lang="scss">
.question {
	.list {
		.el-button-group {
			.el-input {
				> .el-input-group__append,
				> .el-input__inner {
					height: 28px;
				}
			}
		}
	}
	.dialog .el-dialog__body {
		text-align: right;
		.el-input {
			padding: 10px;
		}
	}
}
</style>