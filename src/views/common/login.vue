<template>
	<div class="site-wrapper site-page--login">
		<div class="login-main">
			<h3 class="login-title">管理员登录</h3>
			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
				<el-form-item prop="id">
					<el-input v-model="dataForm.id" placeholder="帐号"></el-input>
				</el-form-item>
				<el-form-item prop="pwd">
					<el-input v-model="dataForm.pwd" type="password" placeholder="密码"></el-input>
				</el-form-item>
				<el-form-item prop="captcha">
					<el-row :gutter="20">
						<el-col :span="14">
							<el-input v-model="dataForm.captcha" placeholder="验证码">
							</el-input>
						</el-col>
						<el-col :span="10" class="login-captcha">
							<img :src="captchaPath" @click="getCaptcha()" alt="">
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { getUUID } from '@/utils'
	// import md5 from 'md5'
	export default {
		data () {
			return {
				dataForm: {
					id: '1000',
					pwd: 'admin',
					uuid: '',
					captcha: ''
				},
				dataRule: {
					id: [
						{ required: true, message: '帐号不能为空', trigger: 'blur' }
					],
					pwd: [
						{ required: true, message: '密码不能为空', trigger: 'blur' }
					],
					captcha: [
						{ required: true, message: '验证码不能为空', trigger: 'blur' }
					]
				},
				captchaPath: ''
			}
		},
		created () {
			this.getCaptcha()		 
		},
		methods: {
			// 提交表单
			dataFormSubmit () {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.$http.get('/api/login', {
							params: {
								id: this.dataForm.id,
								pwd: this.dataForm.pwd,
								captcha: this.dataForm.captcha
							}
						}).then(({data}) => {
							console.log('data', data)
							if (data && data.code === 0) {
								sessionStorage.setItem('token', data.token)
								console.log('sessionStorage.getItem("token")', sessionStorage.getItem("token"))
								this.$router.replace({ path: '/home' })
							} else {
								this.getCaptcha()
								this.$message.error(data.msg)
							}
						})

						// this.$http({
						//   url: this.$http.adornUrl('/sys/login'),
						//   method: 'post',
						//   data: this.$http.adornData({
						//     'username': this.dataForm.userName,
						//     'password': this.dataForm.password,
						//     'uuid': this.dataForm.uuid,
						//     'captcha': this.dataForm.captcha
						//   })
						// }).then(({data}) => {
						//   if (data && data.code === 0) {
						//     this.$cookie.set('token', data.token)
						//     this.$router.replace({ name: 'home' })
						//   } else {
						//     this.getCaptcha()
						//     this.$message.error(data.msg)
						//   }
						// })
					}
				})
			},
			// 获取验证码
			getCaptcha () {
				// this.dataForm.uuid = getUUID()
				// this.captchaPath = this.$http.get('/api/svg?' + Math.random())   
				this.captchaPath = '/api/svg?' + Math.random()
			}
		}
	}
</script>

<style lang="scss">
	.site-wrapper.site-page--login {
		position: absolute;
		display: flex;
		align-items: center;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(38, 50, 56, .6);
		overflow: hidden;
		&:before {
			position: fixed;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			content: "";
			// background-image: url(~@/assets/img/login_bg.jpg);
			background-size: cover;
		}
		.login-main {
			//  position: absolute;
			// top: 0;
			// bottom: 0;
			// margin: auto;
			// display: inline-block;
			margin: 0 auto;
			padding: 40px;
			width: 100%;
			max-width: 414px;
			background-color: #fff;
		}
		.login-title {
			font-size: 16px;
		}
		.login-captcha {
			overflow: hidden;
			> img {
				width: 100%;
				height: 36px;
				cursor: pointer;
			}
		}
		.login-btn-submit {
			width: 100%;
			margin-top: 38px;
		}
	}
</style>
