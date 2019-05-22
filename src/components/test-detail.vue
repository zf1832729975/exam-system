<template>
	<div class="test_deatil">
		<div class="clearfix ">
			<div class="pull-left margin-right" v-html="delHtmlTag(test.qstStem)"></div>
			<div class="pull-right">{{test.score}}分</div>
		</div>
		<ul>
			<li v-for="j in 6" :key="j" class="clearfix">
				<div v-if="test['opt' + j]"> 
					<div class="pull-left">{{ numberToUpperCase(j) }}.&nbsp;</div>
					<div class="pull-left" v-html=" delHtmlTag(test['opt' + j])"></div>
				</div>
			</li>
		</ul>
        <el-divider></el-divider>
		<div class="clearfix">
			<div  class="pull-left margin-right"
				v-if=" typeof(test.answer) == 'number'"
			>答案： {{ numberToUpperCase(test.answer)}}</div>

            <div class="pull-right">难易度： {{ numberToDifficult(test.difficult) }}</div>
		</div>
		<div>题目解析： {{ test.analysis ? delHtmlTag(test.analysis) : "无解析" }}</div>
	</div>
</template>

<script>
export default {
	props: {
		test: Object
	}
};
</script>

<style scoped>
.test_deatil > div,
.test_deatil > ul > li {
	width: 100%;
}
</style>



