<!-- 新增试题 -->
<template>
	<div class="add-test-wrap">
		<div class="add-test">
			<h2 class="title">新增试题</h2>
			<div class="btn-group">
				<el-button
					size="small"
					v-for="(btn, i) in btnsTitle"
					:key="btn"
					:type="i === btnActive ? 'primary' : ''"
					@click="btnActive = i"
				>{{btn}}</el-button>
			</div>

			<h4>试题题干</h4>
			<div id="qst_stem"></div>
			<div>
				<h4>答案选项</h4>
				<!-- v-show 在这里比 v-if 好  单项和多项 -->
				<el-row v-show="btnActive === 0 || btnActive === 1" class="choice-question-asw" :gutter="15">
					<el-col class="asw_opt" v-for="(i) in aswOptCount" :key="i" :sm="12">
						<div>({{ answers[i - 1] }})</div>
						<div :id="'asw_opt' + i" class="content"></div>
					</el-col>
					<el-col class="asw_opt_handle" :sm="24" :xl="24">
						<el-button icon="el-icon-delete-solid del" @click="delAswOpt(aswOptCount)">删除最后一项</el-button>
						<el-button icon="el-icon-circle-plus-outline" @click="addAswOpt">添加新选项</el-button>
					</el-col>
				</el-row>
				<!-- 判断题 -->
				<div v-if="btnActive === 2">
					真项
					<el-input type="textarea" v-model="aswOptTrueContent"></el-input>假项
					<el-input type="textarea" v-model="aswOptFalseContent"></el-input>
				</div>
			</div>

			<div class="right-asw clearfix">
				<div class="pull-left inline">
                    正确答案
					<!-- 单项选择题 -->
					<div v-if="btnActive === 0" class="opt">
						<el-radio-group v-model="answer">
							<el-radio v-for="i in aswOptCount" :key="i" :label="i">{{answers[i - 1]}}</el-radio>
						</el-radio-group>
					</div>
					<!-- 多项选择题 -->
					<dir v-else-if="btnActive === 1" class="opt">
						<el-checkbox-group v-model="multipleAswList">
							<el-checkbox v-for="i in aswOptCount" :key="i" :label="i">{{answers[i - 1]}}</el-checkbox>
						</el-checkbox-group>
					</dir>
					<!-- 判断 -->
					<div v-else-if="btnActive === 2" class="opt">
						<el-radio-group v-model="answer">
							<el-radio :label="1">真</el-radio>
							<el-radio :label="0">假</el-radio>
						</el-radio-group>
					</div>
				</div>
				<div class="score pull-left">
					分数&nbsp;&nbsp;
                    <!-- 不是设计题 -->
					<el-input-number  :min="1" :max=" btnActive !== 4 ? 5 : 30"  v-model="score"></el-input-number>
				</div>
			</div>

			<div class="analysis">
				题目解析
				<div id="analysis"></div>
			</div>
			<!-- 试题类别 -->
			<div class="box">
				<div>分类</div>
				<!-- <el-select v-model="courseId" placeholder="请选择">
                    <el-option
                    v-for="item in courseList"
                    :key="item.Course_id"
                    :label="item.Course_name"
                    :value="item.Course_id">
                    </el-option>
				</el-select>-->
				<el-cascader
					:options="courseList"
					v-model="selectdeCategory"
					:props="{'label': 'name', 'value': 'id'}"
				></el-cascader>
				<el-button @click="getCourseList">重新加载</el-button>
			</div>

			<div class="box">
				<div>试题难易度</div>
				<el-radio-group v-model="difficult">
					<el-radio v-for="(item, i) in difficultList" :key="item" :label="i">{{difficultList[i]}}</el-radio>
				</el-radio-group>
			</div>
			<el-button type="primary" @click="submit">保存</el-button>
		</div>
	</div>
</template>

<script>
import E from "wangeditor";
import { setTimeout } from "timers";
// import '@/assets/js/wangEditor.js'
// import '@/assets/js/wangEditor-3.1.1.min.js'
export default {
	data() {
		return {
			editor: "",
			prevHtml: "",
			prevText: "",
			btnActive: 0, // 激活的 button的下标 0- 单选题 1-多选题。。
			btnsTitle: ["单选题", "多选题", "判断题", "填空题", "问答题"], // 试题类型
			aswOptCount: 4, // 答案选项个数
			answers: ["A", "B", "C", "D", "E", "F", "G"],
			answer: 1, // 答案，默认 A | 假
			qstStemContent: "", // 题干内容
			aswOptContent: [], // 答案选项的内容
			analysisContent: "", // 题目解析,
			multipleAswList: [2], // 多选不定项选择的答案

			aswOptTrueContent: "真", // 判断题答案选项
			aswOptFalseContent: "假",
			editorTxtCtnList: [], //
			difficult: 1, // 使用难易度
			difficultList: ["简单", "一般", "困难"],
			courseList: [{ name: "占位", id: 1 }], // 课程列表
			// courseId: ''    // 课程 id
			selectdeCategory: [], // 选中的课程
			props: {},
			score: 1
		};
	},
	created() {
		this.getCourseList();
	},
	mounted() {
		this.qstStemContent = new E("#qst_stem");
		this.analysisContent = new E("#analysis");
		//   // 关闭粘贴样式的过滤
		// this.qstStemContent.customConfig.pasteFilterStyle = true
		//  // 忽略粘贴内容中的图片
		// this.qstStemContent.customConfig.pasteIgnoreImg = false
		// editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器

		this.qstStemContent.customConfig.uploadImgServer = "/api/uploadImage";
		this.analysisContent.customConfig.uploadImgServer = "/api/uploadImage";

		this.qstStemContent.create();
		this.analysisContent.create();
		for (let i = 0; i < this.aswOptCount; i++) {
			this.createAswEditor(i);
		}

		/* 去掉 editor 默认的样式 */
		this.editorTxtCtnList = document.getElementsByClassName(
			"w-e-text-container"
		);
		for (let i = 0; i < this.editorTxtCtnList.length; i++) {
			this.resetEdtiorStyle(i);
		}
	},

	methods: {
		getCourseList() {
			this.$http("/api/getcourselist")
				.then(res => {
					console.log("res", res);
					this.courseList = res.data;
					this.selectdeCategory = [];
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].children.length == 0) {
							res.data[i].children.push({
								name: "默认",
								id: -1
							});
						}
					}
					// this.courseId = res.data[0].Course_id
				})
				.catch(err => {
					this.$message("加载科目列表出错");
				});
		},
		resetEdtiorStyle(i) {
			this.editorTxtCtnList[i].style.height = "";
			let text = this.editorTxtCtnList[i].getElementsByClassName(
				"w-e-text"
			)[0];
			text.style.height = "";
			// i = 0 , 题干
			text.style.minHeight = i == 0 ? "100px" : "50px";
			text.style.maxHeight = "330px";
		},
		createAswEditor(i) {
			this.aswOptContent[i] = new E("#asw_opt" + (i + 1));
			this.aswOptContent[i].customConfig.uploadImgServer =
				"/api/uploadImage";
			this.aswOptContent[i].create();
		},
		getHtml() {
			console.log("this.editor.txt.html()", this.editor.txt.html());
			this.prevHtml = this.editor.txt.html();
		},
		getText() {
			console.log("this.editor.txt.text()", this.editor.txt.text());
			this.prevText = this.editor.txt.text();
		},

		delAswOpt(index) {
			if (this.aswOptCount <= 2) {
				// 小于两个的时候不操作
				this.$message("不能删除啦！");
				return false;
			}
			this.aswOptContent.splice(index, 1);
			this.aswOptCount--;
			this.resetEdtiorStyle(index);
		},
		addAswOpt() {
			// 单选题最多4项，多选题最多6项
			if (
				(this.btnActive === 0 && this.aswOptCount >= 4) ||
				this.aswOptCount >= 6
			) {
				this.$message("不能再添加啦！");
				return false;
			}
			this.aswOptCount++;
			setTimeout(() => {
				this.createAswEditor(this.aswOptCount - 1);
				this.resetEdtiorStyle(this.aswOptCount);
			}, 100);
		},
		submit() {
			console.log("this.multipleAswList", this.multipleAswList);

			if (!this.qstStemContent.txt.text()) {
				this.$message("题干不能为空！");
				return false;
			}
			////////////////////////////// 多选题 ////////////////////////////////
			if (this.btnActive === 1) {
				// 不定项
				if (this.multipleAswList.length < 1) {
					this.$message({
						message: "请选择答案",
						type: "warning"
					});
					return;
				}
				let binStr = "1000000"; // 最多6个	在前面加 1 转换成二进制字符串 刚好最大值 127
				for (let i = 0; i < this.multipleAswList.length; i++) {
					let value = this.multipleAswList[i];
					binStr =
						binStr.slice(0, value + 1) +
						"1" +
						binStr.slice(value + 2);
				}
				this.answer = parseInt(binStr, 2);
			}
			if (this.selectdeCategory.length <= 1) {
				this.$message("请选择分类");
				return false;
			}

			let qstStem = this.qstStemContent.txt.html(); // 题干
			let analysis = ""; // 解析
			if (this.analysisContent.txt.text()) {
				analysis = this.analysisContent.txt.html(); // 解析
			}

			let data = {
				qstStem,
				answer: this.answer,
				categoryId: this.selectdeCategory[1],
				difficult: this.difficult + 1,
                analysis,
                score: this.score
			};

			for (let i = 0; i < this.aswOptCount; i++) {
				let text = this.aswOptContent[i].txt.text();
				if (!text) {
					this.$message(`${this.answers[i]}选项不能为空`);
					return false;
				} else {
					let prop = "opt" + (i + 1);
					data[prop] = this.aswOptContent[i].txt.html();
				}
			}
			console.log("data", data);
			this.$http
				.post("/api/question/add", {
					testType: this.btnActive,
					data
				})
				.then(res => {
					if (res.data.code === 0) {
						console.log("res.data", res.data);
						this.$message({
							message: res.data.msg,
							type: "success"
						});
						// 清空内容
						this.qstStemContent.txt.clear();
						this.aswOptContent.map(item => {
							item.txt.clear();
						});
					} else {
						this.$message.error(res.data.msg);
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 16px;
	padding: 5px 15px;
}
.add-test-wrap {
	position: fixed;
	top: 45px;
	right: 0;
	left: 0;
	bottom: 0;
	overflow: auto;
}
.add-test {
	max-width: 1100px;
	margin: 0 auto;
	overflow: hidden;
	padding-bottom: 150px;
	// background: #f5f5f5;
}
@media screen and (max-width: 1200px) {
	.add-test {
		padding: 0 10px;
		padding-bottom: 30px;
	}
}
.title {
	background: #409eff;
	color: #fff;
}
.btn-group {
	padding: 15px 0;
}
.asw_opt_handle {
	// padding: 15px;
	// padding-top: 0px;
	padding-bottom: 15px;
}
.del {
	cursor: pointer;
}
#qst_stem,
.asw_opt {
	margin: 20px 0;
	// .content {
	//     height: 200px;
	//     overflow: auto;
	//     .w-e-text-container {
	//         height: 200px;
	//     }
	// }
}
.right-asw {
	padding: 15px 0;
	.opt {
		padding: 5px 30px;
	}
}
.analysis {
	padding: 10px 0;
	// #analysis
}
.box {
	padding: 10px 0;
}
</style>
 <style lang="scss">
/* 编辑框默认样式修改 
		-------------------------------------------*/
.add-test {
	.w-e-toolbar,
	.w-e-text-container {
		// max-width: 700px;
		flex-wrap: wrap;
		.w-e-menu {
			padding: 3px 6px;
			.w-e-icon-happy,
			.w-e-icon-play {
				display: none;
			}
		}
	}
}
</style>