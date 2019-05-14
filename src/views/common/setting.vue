<template>
	<!-- 账号信息 -->
	<div class="setting">
        <p>个人信息</p>
		 <ul>
			 <li>
					<span>专业</span>
					<span>{{reqUserInfo.specialty}}</span>
			 </li>
			 <li>
					<span>{{role == 'student' ? '班级' : '所教班级' }}</span>
                    <span v-if="role == 'student'">{{reqUserInfo.className}}</span>
                    <div v-else>
                        <span v-for="_class in reqUserInfo.teacherClassList" :key="_class.id">
                            {{ _class.name }}&nbsp;&nbsp;
                        </span>
                    </div>
			 </li>
			 <li>
					<span> {{ role == 'student' ? '学号' : '教师号' }}</span>
					<span>{{ userId }}</span>
			 </li>
			 <li>
					<span>性别</span>
					<span>{{reqUserInfo.sex}}</span>
			 </li>
			 <li>
					<span>
						<el-button type="text" @click="updatePasswordVisible = true">修改密码</el-button>
					</span>
			 </li>
		 </ul>
		 <el-dialog title="修改密码" :visible.sync="updatePasswordVisible">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="原始密码" prop="oldPass">
                    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="updatePasswordVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm(ruleForm)">确 定</el-button>
                </el-form-item>
            </el-form>
		 </el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value.length < 8 || value.length > 32) {
                callback(new Error('密码长度必须在8-32位之间'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                } 
                callback();
            }
		 };
		 var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
		 };
	    return {
            reqUserInfo: { // 需要请求的信息
                specialty: "",
                className: "",
                teacherClassList: [],  // 教师所教班级
                sex: "",
            },
            userId: sessionStorage.userId,
            userName: sessionStorage.userName,
            role: sessionStorage.role,
            updatePasswordVisible: false,
            ruleForm: {
                oldPass: '',
                pass: '',
                checkPass: ''
            },
            rules: {
                oldPass: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
                }
            };
    },
    created () {
        // 请求个人信息
        this.$http('/api/userInfo/query').then(res => {
            console.log('res.data', res.data)
            if (res.data.code === 0) {
                this.reqUserInfo = res.data.data
            }
        })
    },
    methods: {
        submitForm (data) {
            this.$refs['ruleForm'].validate((valid) => {
                if(valid) {
                    let { pass, oldPass } = data
                    this.$http('/api/userInfo/updataPass', {
                        params: { pass, oldPass }
                    }).then(res => {
                        if (res.data.code === 0) {
                            this.updatePasswordVisible = false
                        }
                        this.$message(res.data.msg)
                    })
                }
            })
        }
    }
    
};
</script>

<style lang="scss" scoped>
.setting {
    max-width: 600px;
    margin: 0 auto;
    p {
        text-align: center;
    }
}
ul {
	> li {
        border-top: 1px solid #ccc;
        display: flex;
        align-items: center;
        > span,
        > div {
            width: 50%;
            display: inline-block;
            padding: 5px;
            text-align: center;
        }
	}
}
</style>
