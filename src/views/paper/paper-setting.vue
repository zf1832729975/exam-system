<template>
	<!-- 第三步，试卷设置 -->
	<div>
		<!-- 班级选择 -->
		<div>
			<el-divider>能考试的班级</el-divider>
			<div class="clearfix">
				<div class="pull-left margin-right explain">说明： 如果没有选择代表所有的班级都能参加考试，所有的学生都可见</div>
				<div class="pull-right">
					<el-button @click="checkAll" icon="el-icon-open">全部选择</el-button>
					<el-button @click="clear" icon="el-icon-turn-off">取消全部选择</el-button>
				</div>
			</div>

			<el-checkbox-group v-model="paper.canJoinClassId" size="small">
				<el-checkbox
					v-for="item in classList"
					:key="item.classId"
					:label="item.classId"
					border
				>{{item.className}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<el-divider>试卷开放时间</el-divider>
		<!-- 时间选择 -->
		<div>
			<div>
				<el-date-picker
					v-model="paper.startDate"
					type="datetime"
					placeholder="选择日期时间"
					:picker-options="startDateRange"
				></el-date-picker>至
				<el-date-picker
					v-model="paper.endDate"
					type="datetime"
					placeholder="选择日期时间"
					:picker-options="paper.endDateRange"
				></el-date-picker>
				<span class="explain">说明： 在这个时间期间才能参加考试</span>
			</div>
			<div style="margin: 15px 0;">
				考试总时间：
				<el-input-number v-model="paper.totalTime" controls-position="right" :min="1"></el-input-number>&nbsp;&nbsp;分钟
			</div>
		</div>
		<div>
			
            试卷状态:
			<el-radio-group v-model="paper.status">
				<el-radio-button :label="1">草稿</el-radio-button>
				<el-radio-button :label="2">发布</el-radio-button>
			</el-radio-group>
		</div>
	</div>
</template>

<script>
export default {
	props: {
        classList: Array,
        paper: Object
	},
	data() {
		return {
			// startDate: new Date(),
			// endDate: new Date().getTime() + 3600 * 1000 * 24 * 7, // 往后一周
			startDateRange: {
				disabledDate: date => {
					return !(date.getTime() >= new Date().getTime());
				}
			},
			endDateRange: {
				disabledDate: date => {
					return !(
						date.getTime() - this.paper.totalTime * 60 * 1000 >
						this.paper.startDate.getTime()
					);
				}
			},
			// totalTime: 60,
			// status: 2
		};
	},
	methods: {
		checkAll() {
			this.paper.canJoinClassId = [];
			let len = this.classList.length;
			for (let i = 0; i < len; i++) {
				this.paper.canJoinClassId.push(i + 1);
			}
		},
		clear() {
			this.paper.canJoinClassId = [];
		}
	}
};
</script>
<style>
.explain {
	font-size: 70%;
	color: #999;
}
</style>

