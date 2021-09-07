<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 警告区域: https://element-plus.gitee.io/#/zh-CN/component/alert -->
			<el-alert show-icon
					  title="注意：只允许为第三级分类设置相关参数！"
					  type="warning"
					  :closable="false"></el-alert>

			<!-- 选择商品分类区域 -->
			<el-row class="cat_opt">
				<el-col style="flex: 0 0 33%">
					<span>选择商品分类：</span>
					<!-- 选择商品分类的级联选择框  expand-trigger="hover" -->
					<el-cascader :options="catelist"
								 :props="cateProps"
								 v-model="selectedCateKeys"
								 @change="handleChange"></el-cascader>
				</el-col>
			</el-row>


			<!-- tab 页签区域: https://element-plus.gitee.io/#/zh-CN/component/tabs-->
			<el-tabs v-model="activeName"
					 @tab-click="handleClick">

				<!--添加动态参数的面板 开始-->
				<el-tab-pane label="动态参数" name="many" style="text-align: left; vertical-align: center">

					<!--添加按钮-->
					<el-button type="primary"
							   size="mini"
							   :disabled="isBtnDisabled"
							   @click="addDialogVisible=true">添加动态参数</el-button>

					<!--表格渲染-->
					<el-table :data="manyTableData"
							  border stripe>

						<!-- expand: 展开行  -->
						<el-table-column type="expand">
							<template #default="scope">

								<!-- 循环渲染Tag标签 -->
								<el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
										closable
										@close="handleClose(i, scope.row)">{{item}}</el-tag>

								<!-- 输入的文本框 -->
								<el-input class="input-new-tag"
										  v-if="scope.row.inputVisible"
										  v-model="scope.row.inputValue"
										  ref="saveTagInput"
										  size="small"
										  @keyup.enter="handleInputConfirm(scope.row)"
										  @blur="handleInputConfirm(scope.row)"></el-input>

								<!-- 添加按钮 -->
								<el-button v-else
										   class="button-new-tag"
										   size="small"
										   @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>

						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>

						<!--作用域插槽, 操作选择-->
						<el-table-column label="操作">
							<template #default="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit"
										   @click="showEditDialog(scope.row.attr_id)">编辑</el-button>

								<el-button size="mini" type="danger" icon="el-icon-delete"
										   @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>

				</el-tab-pane>
				<!--添加动态参数的面板 结束-->



				<!--添加静态属性的面板-->
				<el-tab-pane label="静态属性" name="only" style="text-align: left; vertical-align: center">
					<!--添加按钮-->
					<el-button type="primary" size="mini"
							   :disabled="isBtnDisabled"
							   @click="addDialogVisible=true">添加静态参数</el-button>

					<!--表格渲染-->
					<el-table :data="onlyTableData" border stripe>
						<el-table-column type="expand">
							<template #default="scope">

								<!-- 循环渲染Tag标签 -->
								<el-tag v-for="(item, i) in scope.row.attr_vals" :key="i"
										closable
										@close="handleClose(i, scope.row)">{{item}}</el-tag>

								<!-- 输入的文本框  @keyup.enter.native="handleInputConfirm(scope.row)" -->
								<el-input class="input-new-tag"
										  v-if="scope.row.inputVisible"
										  v-model="scope.row.inputValue"
										  ref="saveTagInput"
										  size="small"
										  @keyup.enter="handleInputConfirm(scope.row)"
										  @blur="handleInputConfirm(scope.row)"></el-input>

								<!-- 添加按钮 -->
								<el-button v-else
										   class="button-new-tag"
										   size="small"
										   @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>

						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>

						<!--作用域插槽, 操作选择-->
						<el-table-column label="操作">
							<template #default="scope">
								<el-button size="mini" type="primary" icon="el-icon-edit"
										   @click="showEditDialog(scope.row.attr_id)">编辑</el-button>

								<el-button size="mini" type="danger" icon="el-icon-delete"
										   @click="removeParams(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>

				</el-tab-pane>
				<!--添加静态属性的面板 结束-->

			</el-tabs>
		</el-card>

		<!-- 添加参数的对话框 -->
		<el-dialog :title="'添加' + titleText" width="50%"
				   v-model="addDialogVisible"
				   @close="addDialogClosed">

			<!-- 添加参数的对话框 -->
			<el-form :model="addForm"
					 :rules="addFormRules"
					 ref="addFormRef"
					 label-width="100px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="addForm.attr_name"></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible=false">取 消</el-button>
				<el-button type="primary" @click="addParams">确 定</el-button>
			</span>
		</el-dialog>


		<!-- 修改参数的对话框 -->
		<el-dialog :title="'修改' + titleText"
				   v-model="editDialogVisible"
				   width="50%"
				   @close="editDialogClosed">
			<!-- 添加参数的对话框 -->
			<el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
				<el-form-item :label="titleText" prop="attr_name">
					<el-input v-model="editForm.attr_name"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editParams">确 定</el-button>
			</span>
		</el-dialog>


	</div>
</template>


<script>
import TipMessage from "@/tools/TipMessage";
import {get, post, put, putUp, del, postUp} from '@/request/request'


export default {
	data() {
		return {
			// 商品分类列表
			catelist: [],

			// 级联选择框的配置对象
			cateProps: {
				value: "cat_id",
				label: "cat_name",
				children: "children"
			},

			// 级联选择框双向绑定到的数组
			selectedCateKeys: [],

			//tabs
			activeName: 'many',  //被激活标签名称 many: 动态参数 only: 静态属性

			//表格数据
			manyTableData: [], 	//动态数据
			onlyTableData: [],  //静态数据

			//添加参数面板是否展示
			addDialogVisible: false,

			// 添加参数的表单数据对象
			addForm: {
				attr_name: ''
			},

			// 添加表单的验证规则对象
			addFormRules: {
				attr_name: [
					{ required: true, message: '请输入参数名称', trigger: 'blur' }
				]
			},

			// 控制修改对话框的显示与隐藏
			editDialogVisible: false,
			// 修改的表单数据对象
			editForm: {},
			// 修改表单的验证规则对象
			editFormRules: {
				attr_name: [
					{ required: true, message: '请输入参数名称', trigger: 'blur' }
				]
			},

		}
	},

	created() {
		this.getCateList();
	},

	//函数
	methods: {

		//编辑按钮点击, 展示编辑框出来
		showEditDialog(attrId){
			get(`categories/${this.cateId}/attributes/${attrId}`, {}).then((res)=>{
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }
			    this.editForm = res.data.data;
			    this.editDialogVisible = true;
			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})
		},

		//Post, 点击确定按钮, 修改参数信息
		editParams(attr_id){
			let data = {
				attr_name: this.editForm.attr_name,
				attr_sel: this.activeName
			}
			putUp(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, data).then((res)=>{
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }
			    TipMessage.isOK("修改成功");
				this.getParamsData()
				this.editDialogVisible = false
			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})
		},

		// 重置修改的表单
		editDialogClosed() {
			this.$refs.editFormRef.resetFields()
		},

		//删除按钮, 根据Id删除对应的参数项
		removeParams(attrId){
			this.$confirm("此操作将永久删除该项, 是否继续?", '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				del(`categories/${this.cateId}/attributes/${attrId}` , {}).then((res)=>{
				    if (res.data.meta.status !== 200){
				        return TipMessage.Wrong(res.data.meta.msg);
				    }
					this.getParamsData();
				    TipMessage.isOK("删除成功");
				}).catch((error)=>{
				    console.log("请求错误, 原因是: ", error);
				})

			}).catch(() => {
				// this.$message({
				// 	type: 'info',
				// 	message: '您已取消'
				// });
			});


		},

		//标签删除按钮点击, DEL数据; 删除对应的参数可选项
		handleClose(i, row){
			row.attr_vals.splice(i, 1)
			this.saveAttrVals(row)
		},

		//将对 attr_vals 的操作，保存到数据库
		saveAttrVals(row){
			let data = {
				attr_name: row.attr_name,
				attr_sel: row.attr_sel,
				attr_vals: row.attr_vals.join(' ')
			};
			putUp( `categories/${this.cateId}/attributes/${row.attr_id}`, data).then((res)=>{
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }
			    TipMessage.isOK("保存数据成功");
			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})
		},

		//文本框失去焦点, 或摁下了 Enter 都会触发
		handleInputConfirm(row){
			console.log("文本框失去焦点, 或摁下了 Enter 都会触发");
			if (row.inputValue.trim().length === 0) {
				row.inputValue = ''
				row.inputVisible = false
				return
			}

			// 如果没有return，则证明输入的内容，需要做后续处理
			row.attr_vals.push(row.inputValue.trim())
			row.inputValue = ''
			row.inputVisible = false

			// 需要发起请求，保存这次操作
			this.saveAttrVals(row)
		},

		//显示Tab添加框
		showInput(row){
			row.inputVisible = true
			// 让文本框自动获得焦点
			// $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
			try {
				this.$nextTick(() => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
				let msg = "这段展开tab添加标签会报错, 应该是vue版本和这个el不太兼容, 参考文档: https://element-plus.gitee.io/#/zh-CN/component/tag";
				TipMessage.Warning(msg);
			}catch (e){
				console.log("打印错误日志: ", e);
			}
		},


		//Post请求: 点击按钮, 添加参数按钮
		addParams(){
			if (this.selectedCateKeys.length !== 3) {
				TipMessage.Warning("未选择分类添加, 请选择需要添加的分类");
			}

			this.$refs.addFormRef.validate((valid) => {
				if ( !valid) return ;
				let data = {
					attr_name: this.addForm.attr_name,
					attr_sel: this.activeName
				};

				let params = {};
				postUp(`/categories/${this.cateId}/attributes` , data, params).then((res)=>{
				      if (res.data.meta.status !== 201){
				        return TipMessage.Wrong("添加失败, 请检查网络是否畅通");
				    }
				    TipMessage.isOK("创建成功");
					this.getParamsData();
				    this.addDialogVisible = false;
				}).catch((error)=>{
				    console.log("Post请求: 点击按钮, 添加参数按钮错误, 原因是: ", error);
				})
			})

		},

		// 监听添加对话框的关闭事件
		addDialogClosed(){
			this.$refs.addFormRef.resetFields()
		},

		//获取商品分类数据
		getCateList(){
			get("/categories" , {}).then((res)=>{
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }
			    this.catelist = res.data.data;
			}).catch((error)=>{
			    console.log("获取商品分类数据错误, 原因是: ", error);
			})
		},

		// 级联选择框选中项变化，会触发这个函数
		handleChange() {
			this.getParamsData()
		},

		// 获取参数的列表数据
		getParamsData(){
			// 选中的不是三级分类, 清空数组
			if (this.selectedCateKeys.length !== 3) {
				TipMessage.Warning("您选中的不是三级分类");
				this.selectedCateKeys = []
				this.manyTableData = []
				this.onlyTableData = []
				return
			}

			//选择了三级分类, 获取当前分类下的全部数据
			let data = {
				"sel": this.activeName
			}
			get( `categories/${this.cateId}/attributes`, data).then((res)=>{
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }

			    // 根据逗号遍历, 渲染 tab[标签], 逗号分隔; 淡黄色,紫色,宝蓝,红色,肤色,黑色,白色,均码
				res.data.data.forEach( (item) => {
					//判断空否, 三元表达式; xxx ? true返回: false返回
					item.attr_vals = item.attr_vals ? item.attr_vals = item.attr_vals.split(','): [];
					//控制文本框的显示与隐藏
					item.inputVisible = false;
					item.inputVal = "";
				})

				//参数绑定
				if (this.activeName === "many"){
					this.manyTableData = res.data.data;
				}else{
					this.onlyTableData = res.data.data;
				}

			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})




		},

		//Tabs标签页
		handleClick(tab, event) {
			// console.log("tab :", tab);
			// console.log("event :", event);
			console.log("打印选择tabs标签名称, 并触发get请求查询tabs标签数据 ", this.activeName);
			this.getParamsData();
		}
	},

	//计算属性
	computed: {
		// 如果按钮需要被禁用, 则返回true, 否则返回false
		isBtnDisabled(){
			if (this.selectedCateKeys.length !== 3){
				return true;
			}
			return false;
		},

		//当前选中三级分类Id
		cateId(){
			if (this.selectedCateKeys.length === 3){
				return this.selectedCateKeys[2]
			}
			return null;
		},

		// 动态计算标题的文本
		titleText() {
			if (this.activeName === 'many') {
				return '动态参数'
			}
			return '静态属性'
		}

	},

	//监听
	watch: {},

	//组件
	components: {}

}
</script>


<style scoped>
.cat_opt {
	margin: 15px 0;
}

.el-tag {
	margin: 10px;
}

.input-new-tag {
	width: 120px;
}
</style>
