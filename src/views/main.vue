<template>
	<div class="site-wrapper">
		<div class="site-header">
			<i class="el-icon-s-unfold fold" size="30" @click="navBtnActive = !navBtnActive "></i>
			<div class="nav" ref="nav" :class="{'nav-active': navBtnActive, mobile: mobile }">
				<el-menu class="navbar-menu-left" :mode="mode">
					<el-menu-item index="5">考生管理</el-menu-item>
					<el-menu-item index="6">试卷管理</el-menu-item>
					<el-menu-item index="7">题库管理</el-menu-item>
					<el-menu-item index="8">试题管理</el-menu-item>
				</el-menu>
				<el-menu class="navbar-menu-right" :mode="mode">
					<el-menu-item index="1">
						<i class="el-icon-setting"></i>
						<span slot="title">设置</span>
					</el-menu-item>
					<el-menu-item index="2">
						<i class="el-icon-user-solid" ></i>
						<span slot="title">棉花糖</span>
					</el-menu-item>
					<el-menu-item index="3" @click="exit">
						<i class="el-icon-switch-button"></i>
						<span>退出</span>
					</el-menu-item>
				</el-menu>
				
			</div>
		</div>
		<div class="site-conten">
			 <router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			navBtnActive: false,
			mobile: false	// 手机设备
		}
	},
	computed: {
		mode () {	// horizontal / vertical
			return this.mobile ? 'vertical' : 'horizontal' 		
		}
	},
	mounted () {
		this.resetDocumentClientHeight()
		window.onresize = this.resetDocumentClientHeight
	},
	methods: {
		 // 重置窗口可视高度
		resetDocumentClientHeight () {
			let width = document.documentElement['clientWidth']
			this.mobile = width <=  720
			if (width >= 720) this.navBtnActive = false
		},
		exit () {
			 this.$confirm('是否退出', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$router.push({ path: '/login' })
				this.$message({
					type: 'success',
					message: '退出成功，请重新登录!'
				});
			}).catch(() => {
			this.$message({
				type: 'info',
				message: '已取消删除'
			});          
			});
		}
	}
	
}
</script>

<style lang="scss" scoped>
.site-header {
	position: relative;
	height: 45px;
	background: #262626;
	.nav {
		display: flex;
		justify-content: space-between;
		&.mobile {
			display: none;
		}
		&.nav-active {
			display: block;
		}
		.el-menu {
			// background: rgba(0, 0, 0, 0)
			background: #262626;
			color: #909399;
			.el-menu-item {
				color: #909399;
			}
		}
		.el-menu--horizontal .el-menu-item,
		.el-menu .el-menu-item {
			height: 45px;
			line-height: 45px;
			&:hover,
			&.is-active,
			&::not(.is-disabled):focus,
			&::not(.is-disabled):hover {
				color: #f9f9f9;
				background: rgba(255, 255, 255, 0);
				// background: #262626;
				border-bottom: 1px solid #999;
			}
		}
	}
	.fold {
		position: absolute;
		display: none;
		right: 5px;
		font-size: 30px;
		line-height: 45px;
		z-index: 999;
	}
	.navbar-menu-right {
		float: right;
		z-index: 998;
	}
}
	
@media screen and (max-width: 720px) {
	.site-header {
		.nav {
			display: block;
			transition: all 3s;
			.navbar-menu-right.el-menu {
			   width: 100%;
			}
		}

		.fold {
			display: block;
			color: #c3d9dd;
			cursor: pointer;
		}
	}
	
}
	
</style>

