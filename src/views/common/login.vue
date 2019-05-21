<template>
	<div class="site-wrapper site-page--login">
		<div class="login-main">
			<h2 class="login-title">在线考试系统</h2>
			<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
				<el-form-item prop="id">
					<el-input v-model="dataForm.id" placeholder="帐号" :size="size"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="dataForm.password" type="password" placeholder="密码" :size="size"></el-input>
				</el-form-item>
				<el-form-item prop="captcha">
					<el-row :gutter="20">
						<el-col :span="14">
							<el-input v-model="dataForm.captcha" placeholder="验证码" :size="size">
							</el-input>
						</el-col>
						<el-col :span="10" class="login-captcha">
							<!-- <div class="svg" @click="getCaptcha()" v-html="svg"></div> -->
							<img class="svg" :src="captchaPath" @click="getCaptcha()" v-html="svg"></img>

						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item>
					<el-radio-group v-model="dataForm.role">
						<el-radio label="admin">管理员</el-radio>
						<el-radio label="teacher">教师</el-radio>
						<el-radio label="student">学生</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item>
					<el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()" :size="size">
                        登录
                        <i :class="submiting ? 'el-icon-loading' : ''"></i>
                    </el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	// import { getUUID } from '@/utils'
	// import md5 from 'md5'
	export default {
		data () {
			return {
				size: 'media',
				dataForm: {
					id: '1002',
					password: '123456',
					captcha: '',
					role: 'teacher'
				},
				dataRule: {
					id: [
						{ required: true, message: '帐号不能为空', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '密码不能为空', trigger: 'blur' }
					],
					captcha: [
						{ required: true, message: '验证码不能为空', trigger: 'blur' }
					]
				},
				svg: '',
				captchaPath: '',
				submiting: false	// 提交中
			}
		},
		created () {
			this.getCaptcha()
			console.log('process.env', process.env)	
		},
		methods: {
			// 提交表单
			dataFormSubmit () {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.submiting = true
						this.$http.get('/api/login', {
							params: {
								id: this.dataForm.id,
								password: this.dataForm.password,
								captcha: this.dataForm.captcha,
								role: this.dataForm.role
							}
						}).then(({data}) => {
							this.submiting = false
							if (data && data.code === 0) {
								sessionStorage.setItem('userName',data.userName)
								sessionStorage.setItem('token', data.token)
								sessionStorage.setItem('userId', this.dataForm.id)
								sessionStorage.setItem('role', this.dataForm.role)
								this.$router.replace({ path: '/' })
							} else {
								this.getCaptcha()
								this.$message.error(data.msg)
							}
						}).catch( err => {
							this.$message.error('系统错误，登录失败，请联系管理员')
							this.submiting = false
						})
					}
				})
			},
			// 获取验证码
			getCaptcha () {
				// this.dataForm.uuid = getUUID()
				// this.captchaPath = this.$http.get('/api/svg?' + Math.random())
				console.log('process.env', process.env)
				// this.captchaPath = 'http://127.0.0.1:3000/api/svg?' + Math.random()	
				this.captchaPath =  process.env.VUE_APP_API + '/api/svg?' + Math.random()	
				// this.captchaPath =  '/api/svg?' + Math.random()	
				// this.svg = ''
				// this.$http('/api/svg').then(res => {
				// 	console.log('res', res)
				// 	this.svg = res.data
				// }).catch(err => {
				// 	this.svg = '<img alt="验证码">'
				// })

				// 在上线环境中确保能运行
				// this.captchaPath = 'http://148.70.239.67:3000/api/svg?' + Math.random()
			}
		}
	}
</script>

<style lang="scss">
	.site-wrapper.site-page--login {
		position: absolute;
		padding-top: 100px;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(38, 50, 56, .6);
		overflow: hidden;
		&:before {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			content: "";
			background-image: url(~@/assets/login_bg.jpg);
			background-size: cover;
		}
		.login-main {
			margin: 0 auto;
			padding: 40px;
			width: 100%;
			max-width: 420px;
			background-color: #fff;
			border-radius: 10px;
		}
		.login-title {
			text-align: center;
			color: #409eff;
		}
		.login-captcha {
			overflow: hidden;
			cursor: pointer;
			> .svg {
				width: 100%;
				height: 40px;
			}
		}
		.login-btn-submit {
			width: 100%;
			margin-top: 38px;
		}
	}

	 @media screen and (max-width: 560px) {
       .site-wrapper.site-page--login {
           padding-top: 0 !important;
		   background-color: #fff;
		   &:before{
			   background: #fff;
		   }
       }
    }
</style>