<template>
	<div class="login-container">
		<div class="login-box">

			<div class="avatar-box">
				<img src="../assets/logo.png" alt="">
			</div>

			<!-- 表单 https://element-plus.org/#/zh-CN/component/form-->
			<el-form label-width="0" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm login-form">

				<!--用户名-->
				<el-form-item prop="name">
					<!--input: https://element-plus.org/#/zh-CN/component/input-->
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
import { ElMessage } from 'element-plus'

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
					this.open1("恭喜您, 登录成功");
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},

		onCancel(){
			console.log("取消了");
			this.ruleForm.name = "";
			this.ruleForm.password = "";

			this.$refs.ruleForm.resetFields();
			this.open3("您点击了取消");
		},

		//Message消息提示: https://element-plus.org/#/zh-CN/component/message
		open1(mgs="恭喜你, 这是一条成功消息") {
			ElMessage.success({
				message: mgs,
				type: 'success'
			});
		},

		open2(msg="警告哦, 这是一条警告消息") {
			ElMessage.warning({
				message: msg,
				type: 'warning'
			});
		},

		open3(msg="注意消息") {
			ElMessage(msg);
		},

		open4(msg="错了哦, 这是一条错误消息") {
			ElMessage.error(msg);
		}

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


	//组件
	components: {
		ElButton,
		// 全名
		[Edit.name]: Edit,
	},

	setup() {
		return {
			open() {
				ElMessage('只是一条消息提示')
			},
			openVn() {
				ElMessage({
					message: h('p', null, [
						h('span', null, '内容可以是 '),
						h('i', { style: 'color: teal' }, 'VNode')
					])
				});
			}
		}
	}

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
