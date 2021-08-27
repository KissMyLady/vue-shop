<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!--卡片-->
		<el-card style="margin-top:10px">
			<template #header>
				<div class="card-header">
					<!--栅格系统-->
					<el-row :gutter="20" style="width: 100%">
						<el-col :span="8">
							<!--搜索框-->
							<el-input placeholder="请输入内容"
									  clearable
									  v-model="queryData.query"
									  @click="loadUserData">
								<template #append>
									<el-button icon="el-icon-search" @click="loadUserData"></el-button>
								</template>
							</el-input>
						</el-col>

						<el-col :span="4">
							<el-button type="primary"
									   @click="addUserDialogVisible=true">添加用户</el-button>
						</el-col>
					</el-row>
				</div>


				<!-- 用户列表区域 -->
				<el-table :data="userList" border stripe>
					<el-table-column type="index" label="#"></el-table-column>
					<el-table-column label="姓名" prop="username"></el-table-column>
					<el-table-column label="邮箱" prop="email"></el-table-column>
					<el-table-column label="电话" prop="mobile"></el-table-column>
					<el-table-column label="角色" prop="role_name"></el-table-column>

					<el-table-column label="状态">
						<template #default="scope">
							<el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
									   @change="userStateChanged(scope.row)"
							></el-switch>
						</template>
					</el-table-column>

					<el-table-column label="操作" width="180px">
						<template #default="scope">
							<!-- 修改按钮 -->
							<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
							<!-- 删除按钮 -->
							<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
							<!-- 分配角色按钮 -->
							<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
								<el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
							</el-tooltip>
						</template>
					</el-table-column>

				</el-table>

			</template>

		</el-card>

		<!--分页-->
		<div class="block">0
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryData.pagenum"
				:page-sizes="[1, 5, 10, 15]"
				:page-size="queryData.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
		</div>


		<!-- 添加用户对话框 开始-->
		<el-dialog title="添加用户" width="50%"
				   v-model="addUserDialogVisible"
				   :before-close="handleClose">

			<!--对话框 Dialog主体 开始-->
			<el-form :model="ruleForm"
					 :rules="addFormRules"
					 ref="ruleForm"
					 label-width="70px">

				<el-form-item label="用户名" prop="username">
					<el-input v-model="ruleForm.username"></el-input>
				</el-form-item>

				<el-form-item label="密码" prop="password">
					<el-input v-model="ruleForm.password" type="password"></el-input>
				</el-form-item>

				<el-form-item label="邮箱" prop="email">
					<el-input v-model="ruleForm.email" type="email"></el-input>
				</el-form-item>

				<el-form-item label="手机" prop="mobile">
					<el-input v-model="ruleForm.mobile" type="email"></el-input>
				</el-form-item>

			</el-form>

			<!--对话框 Dialog主体 结束-->

			<template #footer>
				<span class="dialog-footer">
					<el-button @click="addUserDialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveUser">确 定</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 添加用户对话框 结束-->

	</div>
</template>


<script>
import {defineComponent, ref} from 'vue'
import TipMessage from "@/tools/TipMessage";
import {get, post, put, del, postUp} from '@/request/request'

export default {
	data() {

		// 验证邮箱的规则
		var checkEmail = (rule, value, cb) => {
			// 验证邮箱的正则表达式
			const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

			if (regEmail.test(value)) {
				// 合法的邮箱
				return cb()
			}

			cb(new Error('请输入合法的邮箱'))
		}

		// 验证手机号的规则
		var checkMobile = (rule, value, cb) => {
			// 验证手机号的正则表达式
			const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

			if (regMobile.test(value)) {
				return cb()
			}

			cb(new Error('请输入合法的手机号'))
		};

		return {
			userList: [],
			value: true,
			//获取用户列表的参数
			queryData: {
				"pagenum": 1,
				"pagesize": 10,
				"query": ""
			},
			total: 0,
			addUserDialogVisible: false,  //对话框是否显示
			ruleForm: {
				username: '',
				password: "",
				email: "",
				mobile: "",
			},
			addFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 1, max: 9, message: '长度在 4 到 9 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true,  message: '请输入密码', trigger: 'blur' },
					{ min: 1, max: 25, message: '长度在 6 到 25 个字符', trigger: 'blur' }
				],
				email: [
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					{ min: 4, max: 15, message: '请输入正确的邮箱地址', trigger: 'blur' }
				],
				mobile: [
					{ required: true, message: '请输入正确的手机号', trigger: 'blur' },
					{ min: 5, max: 12, message: '长度为11个字符', trigger: 'blur' }
				],
				emailUp: [
					{ required: false, message: '请输入用户邮箱', trigger: 'blur' },
					{ validator: checkEmail, trigger: 'blur' }
				],
				mobileUp: [
					{ required: false, message: '请输入用户手机', trigger: 'blur' },
					{ validator: checkMobile, trigger: 'blur' }
				]


			},

			// 修改表单的验证规则对象
			editFormRules: {
				email: [
					{ required: true, message: '请输入用户邮箱', trigger: 'blur' },
					{ validator: checkEmail, trigger: 'blur' }
				],
				mobile: [
					{ required: true, message: '请输入用户手机', trigger: 'blur' },
					{ validator: checkMobile, trigger: 'blur' }
				]
			},
		};
	},

	//
	created() {
		this.loadUserData();
	},

	//函数
	methods: {

		//添加用户
		saveUser(){
			console.log("点击了确定添加用户按钮");
			this.addUserDialogVisible = false;
			console.log("打印表单数据: ", this.ruleForm);

			console.log(" :", this.ruleForm.username);
			console.log(" :", this.ruleForm.password);

			let data = {
				"username": this.ruleForm.username,
				"password": this.ruleForm.password,
				"email": "",
				"mobile": ""
			};

			let body = {
				"username": this.ruleForm.username,
				"password": this.ruleForm.password,
				"email": "",
				"mobile": ""
			}

			postUp("/users" , data, body).then((res)=>{
			    console.log("打印请求的数据res: ", res);
			    if (res.data.meta.status == 201){
			        console.log("post数据成功, 打印: ", res.data);
					TipMessage.isOK("添加用户成功");
					this.loadUserData();
			    }else{
			        TipMessage.Wrong("添加用户失败, 请检查网络是否畅通");
			    }

			}).catch((error)=>{
			    console.log("post错误, 原因是: ", error);
			})






		},

		//显示对话框
		showDialogVisible(){
			console.log("显示对话框 被点击了");
			this.addUserDialogVisible = true;
		},

		//对话框
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {});
		},

		//分页 pagination
		handleSizeChange(newPage) {
			console.log(`每页 ${newPage} 条`);
			this.queryData.pagesize = newPage
			this.loadUserData()
		},
		handleCurrentChange(newPage) {
			console.log(`当前页: ${newPage}`);
			this.queryData.pagenum = newPage
			this.loadUserData()
		},

		//发起用户数据请求
		async loadUserData() {
			let data = this.queryData;
			get("/users", data).then((res) => {
				if (res.data.meta.status == 200) {
					console.log("res.data.data :", res.data.data);
					console.log(" :",res.data.data.users );
					this.userList = res.data.data.users;
					this.total = res.data.data.total;
					TipMessage.isOK("数据加载完成");
				} else {
					TipMessage.Wrong("获取数据列表数失败, 请检查网络是否畅通");
				}

			}).catch((error) => {
				console.log("请求错误, 原因是: ", error);
			})
		},

		//改变用户mg_state状态
		userStateChanged(userinfo){
			put(`/users/${userinfo.id}/state/${userinfo.mg_state}`, {}).then((res)=>{
			    if (res.data.meta.status == 200){
			        this.menuList = res.data.data;
			        TipMessage.isOK("用户状态改变成功");
			    }else{
			        TipMessage.Wrong("对不起, 我们这里出现了点问题");
			    }
			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})

		},

		//删除用户
		removeUserById(id){
			this.$confirm("将删除用户, 是否继续", '警告!', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				console.log("打印传递过来的id: ", id);

				//del请求
				del("/users/"+ id).then((res)=>{
					console.log("删除提交返回的消息打印: ", res);
					if (res.data.meta.status == 200){
						console.log("删除成功");
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
						//TipMessage.Info("退出登录成功");
						this.$router.push("/users");  //重定向
					}else{
						TipMessage.Wrong("删除失败, 我们这里出现了点问题");
					}

				}).catch((error)=>{
					console.log("删除失败, 我们这里出现了点问题");
				})



			}).catch(() => {
				this.$message({
					type: 'info',
					message: '您已已取消'
				});
			});

		},

	},

	//计算属性
	computed: {},

	//监听
	watch: {},

	//组件
	components: {},

	setup() {
		return {
			input1: ref(''),
			input2: ref(''),
			input3: ref(''),
			select: ref('')
		}
	}
}
</script>


<style scoped>


</style>
