<template>

	<!-- 面包屑导航 -->
	<el-breadcrumb separator-class="el-icon-arrow-right">
		<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
		<el-breadcrumb-item>权限管理</el-breadcrumb-item>
		<el-breadcrumb-item>权限列表</el-breadcrumb-item>
	</el-breadcrumb>

	<!-- 卡片视图 [数据渲染] -->
	<el-card>
		<el-table :data="rightsList" border stripe>
			<el-table-column type="index"></el-table-column>
			<el-table-column label="权限名称" prop="authName"></el-table-column>
			<el-table-column label="路径"    prop="path"></el-table-column>
			<el-table-column label="权限等级" prop="level">
				<!--作用域插槽, 自定义输出格式-->
				<template #default="scope">
					<el-tag v-if="scope.row.level === '0'">一级</el-tag>
					<el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
					<el-tag v-else type="warning" >三级</el-tag>
				</template>
			</el-table-column>
		</el-table>
	</el-card>


</template>


<script>
import {defineComponent, ref} from 'vue'
import TipMessage from "@/tools/TipMessage";
import {get, post, put, del, postUp} from '@/request/request'
import {ElButton} from "element-plus";
import {Edit} from "@element-plus/icons";


export default {
	data() {
		return {
			//权限列表
			rightsList: [],
		}
	},

	created() {
		//初始化加载
		this.getRightsList();
	},

	//函数
	methods: {
		//获取权限列表数据
		getRightsList(){

			get("/rights/list" , {}).then((res)=>{
			    if (res.data.meta.status === 200){
					this.rightsList = res.data.data;
					TipMessage.isOK("权限列表数据获取成功");
			    }else{
			        TipMessage.Wrong(res.data.meta.msg);
			    }

			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})

		},
	},

	//计算属性
	computed: {

	},

	//监听
	watch: {},

	//组件
	components: {}

}
</script>


<style scoped>
h1 {
	color: #000;
}

</style>
