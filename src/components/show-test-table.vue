<template>
	<el-table :data="paperContent.qst_single" style="width:100%">
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
</template>

<script>
export default {
    data () {
        return {
            pageSize: 15, // 分页每一页的大小
			currentPage: 1, // 当前页
        }
    },
    computed: {
        // 过滤表格的数据并且分页
		filterAndPageing() {
			let filterData = this.tableData.filter(
				data =>
					!this.listSearch ||
					data.title
						.toLowerCase()
						.includes(this.listSearch.toLowerCase())
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
    }
}
</script>

