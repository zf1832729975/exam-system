<template>
	<div class="site-wrapper">
		<div class="site-header">
			<i class="el-icon-s-unfold fold" size="30" @click="navBtnActive = !navBtnActive "></i>
			<el-collapse-transition>
				<div class="nav" ref="nav" :class="{'nav-active': navBtnActive, mobile: mobile }">
					<el-menu class="navbar-menu-left" :mode="mode" >
						<el-menu-item v-for="(menu, index) in menuList" :key="index" :index="index + ''" @click="menuClick(menu)">
							{{menu.title}}
						</el-menu-item>
						<!-- <el-menu-item index="5">考生管理</el-menu-item>
						<el-menu-item index="6">试卷管理</el-menu-item>
						<el-menu-item index="7" @click="navClick">题库管理</el-menu-item>
						<el-menu-item index="8" @click="navClick">试题管理</el-menu-item> -->
					</el-menu>
					<el-menu class="navbar-menu-right" :mode="mode">
						<el-menu-item index="1">
							<i class="el-icon-setting"></i>
							<span slot="title">设置</span>
						</el-menu-item>
						<el-menu-item index="2">
							<i class="el-icon-user-solid" ></i>
							<span slot="title">{{userName}}</span>
						</el-menu-item>
						<el-menu-item index="3" @click="exit">
							<i class="el-icon-switch-button"></i>
							<span>退出</span>
						</el-menu-item>
					</el-menu>
				</div>
			</el-collapse-transition>
		</div>
		<div class="site-conten">
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>
	</div>
</template>

<script>
// fade/zoom 等
// 按需引入
import 'element-ui/lib/theme-chalk/base.css';
// collapse 展开折叠
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import Vue from 'vue'

Vue.component(CollapseTransition.name, CollapseTransition)

export default {
	data () {
		return {
			userName: 'admin',
			menuList: [
				{title: '考生管理', path: '/stu'},
				{title: '试卷管理', path: ''},
				{title: '题库管理', path: '/question'},
				{title: '试题管理', path: ''}
			],
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
				type: 'warning',
				center: this.mobile
			}).then(() => {
				this.$router.push({ path: '/login' })
				this.$message({
					type: 'success',
					message: '退出成功，请重新登录!',
					center: this.mobile					
				});
			}).catch(() => {
			this.$message({
				type: 'info',
				message: '已取消删除',
			});          
			});
		},

		// 导航栏菜单点击
		menuClick (menu) {
			console.log('menu', menu)
			if (menu.path) {
				this.$router.push({ path: menu.path })
			}
		}
	}
	
}
</script>

<style lang="scss">
.site-header {
	position: fixed;
	width: 100%;
	height: 45px;
	background: #262626;
	z-index: 99999;
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
			&:not(.is-disabled):focus,
			&:not(.is-disabled):hover {
				color: #3d91ff;
				background: rgba(255, 255, 255, 0);
				// background: #262626;
				border-bottom:0
			}
			// &.is-active {
			// 	border-bottom: 1px solid #3d91ff;
			// }
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
.site-conten {
	padding-top: 45px;
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

