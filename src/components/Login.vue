<template>
	<div class="login-container">
		<div class="login-box">

			<div class="avatar-box">
				<img src="../assets/logo.png" alt="">
			</div>

			<!-- 表单 https://element-plus.org/#/zh-CN/component/form -->
			<el-form label-width="0" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm login-form">

				<!--用户名-->
				<el-form-item prop="name">
					<!--input: https://element-plus.org/#/zh-CN/component/input -->
					<el-input placeholder="用户名" v-model="ruleForm.name">
						<template #prefix>
							<i class="el-input__icon el-icon-user"></i>
						</template>
					</el-input>
				</el-form-item>

				<!--密码-->
				<el-form-item  prop="password">
					<el-input placeholder="密码" v-model="ruleForm.password" type="password" autocomplete="off">
						<template #prefix>
							<i class="el-input__icon el-icon-lock"></i>
						</template>
					</el-input>
				</el-form-item>

				<!--提交-->
				<el-form-item>
					<el-button type="primary" @click="onSubmit()">登录</el-button>
					<el-button type="info"    @click="onCancel()">重置</el-button>
				</el-form-item>
			</el-form>

		</div>
	</div>
</template>


<script>
import { ElButton } from 'element-plus'
import { Edit } from '@element-plus/icons'
import TipMessage from "@/tools/TipMessage";
import  { get, post } from '@/request/request'


export default {
	name: "Login",

	data() {
		return {
			ruleForm: {
				name: '',
				password: "",
			},
			rules: {
				name: [
					{ required: true, message: '请输入活动名称', trigger: 'blur' },
					{ min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true,  message: '请输入密码', trigger: 'blur' },
					{ min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
				],
			}
		}
	},

	//函数
	methods: {
		onSubmit() {
			this.$refs.ruleForm.validate((valid) => {
				if (valid) {

					// 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
					//   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
					//   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
					// console.log("this.ruleForm :", this.ruleForm);
					let username = this.ruleForm.name;
					let pwd = this.ruleForm.password;

					let data = {
						"username": username,
						"password": pwd
					}

					//发送get请求
					post("/login", data)
						.then( (res) =>{
							let jsonData = JSON.parse(res.request.response);
							console.log("jsonData :", jsonData);

							if (jsonData.meta.status == 200){

								console.log("token :", jsonData.data.token);
								window.sessionStorage.setItem('token', jsonData.data.token)
								TipMessage.isOK("登录成功");
								this.$router.push("/home");
							}else {
								TipMessage.Info(jsonData.meta.msg);
							}

						}).catch( (err) =>{
						TipMessage.Info("对不起, 我们这里出现了点问题");
							console.log("登录请求错误: ", err);
					})


					// 2. 通过编程式导航跳转到后台主页，路由地址是 /home
					this.route.push("/login");

				} else {
					TipMessage.Warning("请输入有效信息");
					return false;
				}
			});
		},

		onCancel(){
			console.log("取消了");
			this.ruleForm.name = "";
			this.ruleForm.password = "";
			this.$refs.ruleForm.resetFields();

			TipMessage.Info("您点击了取消");
		},

	},

	//计算属性
	computed: {
		fullName() {
			return this.firstName + this.lastName;
		}
	},

	//监听
	watch: {
		title(preVal, newVal) {
			console.log(`改变之前的值: : 改变之后的值: `);
		}
	},

	//检测是否登录
	created() {
		//从sessionStorage 中获token
		const token = window.sessionStorage.getItem("token");
		if (token){
			this.$router.push("/home");
		}

	},



	//组件
	components: {
		ElButton,
		// 全名
		[Edit.name]: Edit,
	},


}

</script>


<style scoped>
/**
*  使用scss编写样式，既可提高开发效率，也方便维护
*  scoped省略后，该样式片段会应用到页面全局
*  支持import语法引入css文件
*  @import "../base/reset.css";
*/

@import "../assets/font/iconfont.css";

h1 {
	color: #c23a3f;
}

.login-container {
	background-color: #2b4b6b;
	height: 100%;
}

.login-box {
	width: 450px;
	height: 300px;
	background-color: white;
	border-radius: 3px;

	position: absolute;
	left: 50%;
	top: 50%;

	transform: translate(-50%, -50%);
}

.avatar-box {
	height: 130px;
	width: 130px;
	border: 1px solid #eee;
	border-radius: 50%;
	padding: 10px;
	box-shadow: 0 0 10px #add;
	background-color: white;

	/*居中*/
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);

}

.avatar-box img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	background-color: #eee;
}

.login-form {
	position: absolute;
	bottom: 0;

	width:100%;
	padding: 0 20px;
	box-sizing: border-box;
}

</style>
