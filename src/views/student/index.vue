<template>
	<div>
		<el-row >
			<el-button plain>朴素按钮</el-button>
			<el-button type="primary" plain>主要按钮</el-button>
			<el-button type="success" plain>成功按钮</el-button>
			<el-button type="info" plain>信息按钮</el-button>
			<el-button type="warning" plain>警告按钮</el-button>
			<el-button type="danger" plain>危险按钮</el-button>
		</el-row>
		<el-form :inline="true">
			  <el-form-item >
					<el-input v-model="search" placeholder="学号或姓名"></el-input>
				</el-form-item>
				<el-form-item>
						<el-button>查询</el-button>
						<el-button type="primary" @click="newStudentDialogVisible = true">新增</el-button>
						<el-button type="danger" :disabled="!checkBoxSelected" @click="batchDelStudent">批量删除</el-button>
						<el-button type="info" @click="batchEditor">批量编辑</el-button>
						<el-button type="info" @click="getClassStudent">刷新</el-button>
				</el-form-item>
		</el-form>
		<el-row :gutter="10" class="class">
			<el-col :sm="8" :md="5" :lg="4">
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
				<el-table
					:data="studentData"
					row-key="id"
					style="width: 100%"
					ref="studentTable"
					@selection-change="handleSelectionChange"
				>
					<!-- 选择框  -->
					<el-table-column type="selection" width="40" ></el-table-column>
					<el-table-column
						prop="id"
						label="学号">
					</el-table-column>
					<el-table-column
						prop="name"
						label="姓名">
					</el-table-column>
					<el-table-column
						prop="sex"
						label="性别">
					</el-table-column>
					<el-table-column label="操作" width="145">
						<template slot-scope="scope">
							<el-button 	title="编辑" type="primary" plain @click="editorStudent(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
							<el-button  title="删除" type="danger" plain @click="singleDelStudent(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
		</el-row>
			<el-dialog class="new-student-dialog" title="新增学生" :visible.sync="newStudentDialogVisible">
				<NewStudent :classList="classList" />
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
      multipleSelection: [],
      isHandling: false // 在操作中， 增删改查
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
      console.log("===================", this.$refs.studentTable);
    },
    editorStudent() {},
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