<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary"
							   @click="showAddCateDialog">添加分类</el-button>
				</el-col>
			</el-row>


			<!-- 表格 -->
			<h3>教学带的tree-table 组件仅支持2.0</h3>


			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange"
						   @current-change="handleCurrentChange"
						   :current-page="querInfo.pagenum"
						   :page-sizes="[3, 5, 10, 15]"
						   :page-size="querInfo.pagesize"
						   layout="total, sizes, prev, pager, next, jumper"
						   :total="total">
			</el-pagination>
		</el-card>


	</div>
</template>


<script>
import TipMessage from "@/tools/TipMessage";
import {get, post, put, putUp, del, postUp} from '@/request/request'


export default {
	data() {
		return {
			// 查询条件
			querInfo: {
				type: 3,
				pagenum: 1,
				pagesize: 5
			},

			// 商品分类的数据列表，默认为空
			catelist: [],

			// 总数据条数
			total: 0,

			// 为table指定列的定义
			columns: []
		}
	},

	created() {
		this.getCateList();
	},

	//函数
	methods: {

		//加载分类数据
		getCateList(){
			let params = {
				"type":     this.querInfo.type,
				"pagenum":  this.querInfo.pagenum,
				"pagesize": this.querInfo.pagesize,
			}

			get("/categories" , params).then((res)=>{
			    console.log("打印请求的原始res数据: ", res);
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }
			    console.log(": 请求数据成功, 打印: ", res.data);
				this.catelist = res.data.data.result
				this.total = res.data.data.total

			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})
		},

		//分页 => 监听 pagesize 改变
		handleSizeChange(newSize) {
			this.querInfo.pagesize = newSize
			this.getCateList()
		},
		//分页 => 监听 pagenum 改变
		handleCurrentChange(newPage) {
			this.querInfo.pagenum = newPage
			this.getCateList()
		},

		//添加分类
		showAddCateDialog(){
			console.log("添加分类点击按钮点击......");
		},
	},

	//计算属性
	computed: {},

	//监听
	watch: {},

	//组件
	components: {
		//"tree-table": TreeTable   这个组件仅支持2.0
	}

}
</script>


<style scoped>
h1 {
	color: #000;
}

.treeTable {
	margin-top: 15px;
}

.el-cascader {
	width: 100%;
}
</style>
