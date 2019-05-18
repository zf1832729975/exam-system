<template>
	<div class="exam" :style="{background: backgroundColor, color: fontColor}">
		<div class="exam-inner">
			<h3>C语言考题</h3>
			<div class="single">
				<h4>一、 单项选择题</h4>
				<dl
					class="test-item qst-stem"
					v-for="(test, index) in paper.single"
					:key="test.id"
					:id="'test_' + (index + 1)"
				>
					<dt class="inline clearfix">
						<div class="pull-left">{{index + 1}}.&nbsp;</div>
						<div class="pull-left text" v-html="test.qstStem"></div>
						<div class="pull-left">({{test.score}}分)</div>
					</dt>
					<dd>
						<div v-for="j in 4" :key="j">
							<div class="inline option clearfix" v-if="test['opt' + j]">
								<div class="label pull-left">
									<!-- <el-radio v-model="answer.single[index][j-1]" :label="j" :name="'answer_' + index " >{{answerLabels[j - 1]}}</el-radio> -->
									<!-- <el-radio v-model="answer.single[index]" :label="j" :name="'answer_' + index " >{{answerLabels[j - 1]}}</el-radio> -->
									<label class="radio">
										<input
											:name="'single_' + index"
											type="radio"
											:value="j"
											v-model="answer.single[index][1]"
										>
										{{answerLabels[j - 1]}}&nbsp;
									</label>
								</div>
								<div class="text pull-left" v-html="test['opt' + j]"></div>
							</div>
						</div>
					</dd>
				</dl>
			</div>
			<button @click="submitForm">交卷</button>
		</div>
		<!-- 答题卡 -->
		<div class="answer-card">
			<div class="time">剩余时间: {{formatSeconds(remainSecond) }}</div>
			<div class="title">答题卡</div>
			<div class="content">
				<h5>单选题</h5>
				<div class="num">
					<a
						:class="{active: answer.single[i - 1][1]}"
						v-for="i in len"
						:key="i"
						:href="'#test_' + i"
					>{{i}}</a>
				</div>
			</div>
			背景颜色 <el-color-picker v-model="backgroundColor" show-alpha></el-color-picker>
			字体颜色 <el-color-picker v-model="fontColor" show-alpha></el-color-picker>
			<button @click="submitForm">保存答案</button>
		</div>
	</div>
</template>

<script>
import { setInterval } from "timers";
import { parse } from "path";
export default {
	data() {
		return {
			radio: 1,
			answerLabels: ["A", "B", "C", "D", "E", "F"],
			paper: {
				single: [[]]
			},
			answer: {
				single: [["", ""]]
			},
			remainSecond: 3600,
			countSecond: 3600,
			len: 0,
			backgroundColor: '#ccc',
			fontColor: '#4f4f4f'
		};
	},
	created() {
		this.getPaperTest();
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
		// 得到试卷
		getPaperTest() {
			this.$http("/api/exam/getPaperTest").then(({ data }) => {
				console.log("data", data);
				this.paper.single = data.single;
				// let arr = [];
				// for (let i = 0; i < data.single.length; i++) {
				// 	arr.push(["", "", "", ""]);
				// }
				// console.log("arr", arr);
				// this.answer.single = arr;
				let arr = new Array(data.single.length);
				this.answer.single = arr.join(",").split(",");
				this.answer.single = arr;
				// this.remainSecond = this.countSecond * 60;
				// arr = [[id, answer]]
				let singleAnser = [];
				data.single.map(item => {
					singleAnser.push([item.id, ""]);
				});
				this.answer.single = singleAnser;
				this.len = 9;
				console.log("singleAnswer", singleAnser);
				this.startTime();
			});
		},
		startTime() {
			setInterval(() => {
				this.remainSecond--;
			}, 1000);
		},
		formatSeconds(value) {
			let theTime = parseInt(value); // 秒
			let middle = 0; // 分
			let hour = 0; // 小时

			if (theTime > 60) {
				middle = parseInt(theTime / 60);
				theTime = parseInt(theTime % 60);
				if (middle > 60) {
					hour = parseInt(middle / 60);
					middle = parseInt(middle % 60);
				}
			}
			let result = "" + parseInt(theTime) + "秒";
			if (middle > 0) {
				result = "" + parseInt(middle) + "分" + result;
			}
			if (hour > 0) {
				result = "" + parseInt(hour) + "小时" + result;
			}
			return result;
		},
		submitForm() {
			this.$confirm(
				"请仔细检查试卷, 提交了就不可再更改, 是否交卷?",
				"提示",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}
			).then(() => {
				this.$message({
					type: "success",
					message: "删除成功!"
				});
			});
			console.log("this.answer", this.answer);

			this.$http
				.post("/api/exam/record/save", {
					answer: this.answer
				})
				.then(({ data }) => {
					console.log("data", data);
				});
			console.log("this.answer", this.answer);

			////////////////////////////////////
			this.$http
				.post("/api/exam/record/save", {
					answer: this.answer
				})
				.then(({ data }) => {
					console.log("data", data);
				});
		}
	}
};
</script>

<style lang="scss">
.exam {
	background: #f9f9f9;
	padding-bottom: 300px;
}
.radio {
	cursor: pointer;
	input {
		cursor: pointer;
	}
}
button {
	display: block;
	padding: 4px 15px;
	text-align: center;
	cursor: pointer;
	margin: 0 auto;
}
.exam-inner {
	// color: #4f4f4f;
	max-width: 920px;
	padding: 10px;
	margin: 0 auto;
	h3 {
		text-align: center;
	}
	// .inline > div {
	// 	display: inline-block;
	// }
	.single {
		.radio {
			cursor: pointer;
			// margin-right: 15px;
			input {
				cursor: pointer;
			}
		}
		dd {
			margin-inline-start: 15px;
		}
	}
	.qst-stem,
	option {
		.text {
			max-width: calc(100% - 50px);
		}
	}
	.option {
		margin: 4px 0;
	}
}

.answer-card {
	position: fixed;
	right: 100px;
	top: 33%;
	width: 310px;
	border: 1px solid #878787;
	// text-overflow: auto;
    background: rgba($color: #fff, $alpha: 0.5);
	white-space: nowrap;
	z-index: 2px;
	.time {
		text-align: center;
	}
	.title {
		// background: #ccc;
		text-align: center;
	}
	.content {
		padding: 4px 5px;
		.num {
			display: inline-block;
			text-align: center;
		}
		a {
			float: left;
			width: 29px;
			height: 20px;
			margin: 2px;
			// margin-right: 5px;

			// margin-bottom: 5px;
			// padding: 1px 10px;
			border: 1px solid #999;
			&:hover {
				text-decoration: none;
			}
			&.active {
				background: #bbb;
			}
		}
	}
}
</style>

