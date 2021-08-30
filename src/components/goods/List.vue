<template>
	<div>

		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 卡片视图区域 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容"
							  v-model="queryInfo.query"
							  clearable
							  @clear="getGoodsList">
						<el-button slot="append" icon="el-icon-search"
								   @click="getGoodsList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="goAddpage">添加商品</el-button>
				</el-col>
			</el-row>

			<!-- table表格区域 -->
			<el-table
				:data="goodslist"
				border
				stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="商品名称"     prop="goods_name"></el-table-column>
				<el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
				<el-table-column label="商品重量"    prop="goods_weight" width="70px"></el-table-column>

				<el-table-column label="创建时间" prop="add_time" width="140px">
					<template #default="scope">{{scope.row.add_time}}</template> <!--dateFormat-->
				</el-table-column>

				<el-table-column label="操作" width="130px">
					<template #default="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini"
								   @click="removeById(scope.row.goods_id)"></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页区域 -->
			<!-- 分页区域 -->
			<el-pagination @size-change="handleSizeChange"
						   @current-change="handleCurrentChange"
						   :current-page="queryInfo.pagenum"
						   :page-sizes="[5, 10, 15, 20]"
						   :page-size="queryInfo.pagesize"
						   layout="total, sizes, prev, pager, next, jumper"
						   :total="total"
						   background>
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
			goodslist: [],  //商品列表

			// 查询参数对象
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 10
			},

			// 总数据条数
			total: 0
		}
	},

	created() {
		this.getGoodsList();
	},

	//函数
	methods: {

		//获取商品列表
		getGoodsList(){
			let params = {
				"query":    this.queryInfo.query,
				"pagenum":  this.queryInfo.pagenum,
				"pagesize": this.queryInfo.pagesize,
			}
			get("/goods" , params).then((res)=>{
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }
				this.goodslist = res.data.data.goods;
				this.total = res.data.data.total;
				console.log("获取商品列表数据成功......");
			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})
		},

		//添加商品
		goAddpage(){
			this.$router.push("/goods/add");
		},

		//table, 操作按钮牛点击
		removeById(id){
			this.$confirm("此操作将永久删除该条数据, 是否继续?", '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				del(`goods/${id}` , {}).then((res)=>{
				    if (res.data.meta.status !== 200){
						return TipMessage.Wrong(res.data.meta.msg);
				    }
					this.getGoodsList()
					TipMessage.isOK("删除商品成功");
				}).catch((error)=>{
				    console.log("请求错误, 原因是: ", error);
				})
			}).catch(() => {
				TipMessage.Info("已取消");
			});

		},

		//分页
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize
			this.getGoodsList()
		},

		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage
			this.getGoodsList()
		},

	},

	//计算属性
	computed: {},

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
