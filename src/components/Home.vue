<template>
	<!--布局: https://element-plus.org/#/zh-CN/component/container -->
	<el-container>

		<!--头部-->
		<el-header>
			<div class="header-logo-div">
				<img src="../assets/img/webLog.png" alt="">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" v-on:click="logout">退出</el-button>
		</el-header>


		<el-container>
			<!--侧边栏-->
			<el-aside :width="isCollapse ? '64px':'200px'">
				<!--折叠与展开-->
				<div class="toggle-button" v-on:click="toggleChick">
					|||
				</div>
				<el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"
						 :collapse="isCollapse"
						 mode="vertical"
						 menu-trigger="hover"
						 router
						 :default-active="activePath"
						 unique-opened>
					<!-- for循环-->
					<el-sub-menu v-bind:index="item.id +''"
								 v-for="item in menuList"
								 v-bind:key="item.id">

						<!-- 一级菜单-->
						<template #title>
							<i :class="iconsObj[item.id]"></i>{{item.authName}}</template>

						<el-menu-item-group
							:index="child.id +''"
							v-for="child in item.children"
							@click="jumpChildItem('/'+ child.path)"
							:key="child.id">

							<!-- 二级菜单-->
							<el-menu-item :index="'/'+ child.path"
										  @click="saveNavState('/' + child.path)"
							>
								<i class="el-icon-menu"></i>{{child.authName}}</el-menu-item>

						</el-menu-item-group>
					</el-sub-menu>
				</el-menu>
			</el-aside>

			<!--右侧内容-->
			<el-main>
				<!--路由占位符-->
				<router-view></router-view>
			</el-main>

		</el-container>
	</el-container>

</template>


<script>
import {ElButton} from 'element-plus'
import {Edit} from '@element-plus/icons'
import TipMessage from "@/tools/TipMessage";
import  { get, post } from '@/request/request'
import MsgBox from "@/tools/MsgBox";


export default {
	data() {
		const item = {
			date: '2016-05-02',
			name: '王小虎',
			address: '上海市普陀区金沙江路 1518 弄'
		};
		return {
			iconsObj: {
				'125': 'el-icon-s-custom',    //用户列表
				'103': 'el-icon-s-check', 	  //权限管理
				'101': 'el-icon-s-goods',  	  //商品管理
				'102': 'el-icon-s-order',  	  //订单管理
				'145': 'el-icon-s-marketing'  //数据统计
			},
			menuList: [],
			isCollapse: false,
			isCollapsedSideWidth: 200,
			activePath: "",
			tableData: Array(10).fill(item)
		}
	},

	//渲染
	created() {
		//获取所有菜单
		this.getSideList();
		//获取最后一次打开的菜单
		this.activePath = window.sessionStorage.getItem('activePath')
	},

	//函数
	methods: {

		//获取菜单
		getSideList(){
			get("/menus" , {}).then((res)=>{
			    console.log("打印请求的数据res: ", res);
			    if (res.data.meta.status == 200){
			        console.log("获取菜单, 请求数据成功, 打印: ", res.data);
					this.menuList = res.data.data;
			        // for (let item in res.data.data){
			        // 	console.log("item :", res.data.data[item]);
					// }
			    }else{
			        TipMessage.Wrong("获取数据列表数失败, 请检查网络是否畅通");
			    }

			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})

		},

		//链接跳转
		jumpChildItem(path){
			console.log("打印传递过来的path: ", path);
			this.activePath = path;
		},

		//激活菜单
		saveNavState(activePath){
			window.sessionStorage.setItem('activePath', activePath)
			this.activePath = activePath
		},

		logout() {
			this.$confirm("将退出登录, 是否继续?", '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				window.sessionStorage.clear(); //清除token
				this.$message({
					type: 'success',
					message: '退出登录成功!'
				});
				//TipMessage.Info("退出登录成功");
				this.$router.push("/login");  //重定向

			}).catch(() => {
				this.$message({
					type: 'info',
					message: '您已已取消'
				});
			});
		},

		//token测试
		testToken(){
			let data = {
				"pagenum": 1,
				"pagesize": 2
			}
			get("/users" , data).then((res)=>{
				console.log("打印请求的数据", res);
			}).catch((error)=>{
				console.log("请求错误, 原因是: ", error);
			})
		},

		//点击汉堡按钮, 切换菜单折叠展开
		toggleChick(){
			this.isCollapse = !this.isCollapse;
		},

	},

	//计算属性
	computed: {},

	//监听
	watch: {},

	//组件
	components: {
		ElButton,
		// 全名
		[Edit.name]: Edit,
	}

}
</script>


<style scoped>
.el-container{
	height: 100%;
}

/* Header Container */
.el-header {
	background-color: #373d41;
	display: flex;
	justify-content: space-between; /*两边对齐*/
	padding-left: 0;
	align-items: center;  			/*纵向居中*/
}

.el-header .header-logo-div {
	display: flex;
	align-items: center;
}

.el-header .header-logo-div img{
	width:  50px;
	height: 50px;
}

.el-header .header-logo-div span{
	color: white;
	font-size: 20px;
	margin-left: 15px;
}


/* Aside Container */
.el-aside {
	background-color: #333744;
}


.el-aside .el-menu{
	border-right: none;
}

/*顶部, 汉堡按钮*/
.toggle-button{
	background-color: #4a5064;
	font-size: 10px;
	line-height:24px;
	color: white;

	text-align: center;
	letter-spacing: 0.2em;

	cursor:pointer;
}


/* Main Container*/
.el-main {
	background-color: #eaedf1;

}


</style>
