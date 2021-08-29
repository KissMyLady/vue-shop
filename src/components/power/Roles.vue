<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 卡片视图 -->
		<el-card>
			<!-- 添加角色按钮区域 -->
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>

			<!-- 角色列表区域 -->
			<el-table :data="rolelist" border stripe>
				<!-- 展开列 expand=展开列 -->
				<el-table-column type="expand">

					<!-- 作用域插槽 -->
					<template #default="scope">
						<!--栅格系统 el-row => el-col -->
						<el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
								v-for="(item1, i1) in scope.row.children"
								:key="item1.id">

							<!-- 一级权限 -->
							<el-col :span="5">
								<el-tag closable
										@close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>

							<!-- 二级权限 -->
							<el-col :span="19">
								<!-- 通过 for 循环 嵌套渲染二级权限 -->
								<el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
										v-for="(item2, i2) in item1.children"
										:key="item2.id">

									<el-col :span="6">
										<el-tag type="success" closable
												@close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>

									<el-col :span="18">
										<!-- 三级权限 -->
										<el-tag type="warning"
												v-for="item3 in item2.children"
												:key="item3.id" closable
												@close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>

<!--						 <pre>-->
<!--							{{scope.row}}-->
<!--                        </pre>-->
					</template>
				</el-table-column>

				<!-- 索引列 一级数据渲染 -->
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width="300px">
					<template #default="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
						<el-button size="mini" type="warning" icon="el-icon-setting"
								   @click="showSetRightDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>

		</el-card>


		<!-- 分配权限的对话框 -->
		<el-dialog title="分配权限" width="50%"
				   v-model="setRightDialogVisible"
				   @close="setRightDialogClosed">

			<!-- 树形控件 -->
			<el-tree :data="rightslist"
					 :props="treeProps"
					 show-checkbox
					 node-key="id"
					 default-expand-all
					 :default-checked-keys="defKeys"
					 ref="treeRef"></el-tree>

			<span slot="footer" class="dialog-footer">
				<el-button @click="setRightDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allotRights">确 定</el-button>
			</span>
		</el-dialog>

	</div>
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
			//角色列表
			rolelist: [],

			// 当前即将分配权限的角色id
			roleId: "",

			// 所有权限的数据
			rightslist: [],

			// 控制分配权限对话框的显示与隐藏
			setRightDialogVisible: false,

			// 默认选中的节点Id值数组 [105, 116, ...]
			defKeys: [],

			// 树形控件的属性绑定对象
			treeProps: {
				label: 'authName',
				children: 'children'
			},
		}
	},


	created() {
		this.getRolesList();
	},

	//函数
	methods: {

		//获取角色列表
		getRolesList(){
			get("/roles" , {}).then((res)=>{
			    console.log("打印请求的数据res: ", res);
			    if (res.data.meta.status === 200){
			        console.log("角色: 请求数据成功, 打印: ", res.data);

			        this.rolelist = res.data.data;
					TipMessage.isOK("数据刷新成功");

			    }else{
			        TipMessage.Wrong("获取数据列表数失败, 请检查网络是否畅通");
			    }

			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})
		},

		//移除权限[通用版]
		removeRightById(role, rightId){
			//提示框
			this.$confirm("此操作将移除当前用户权限, 是否继续?", '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				del( `roles/${role.id}/rights/${rightId}` , {}).then((res)=>{
				    if (res.data.meta.status != 200){
						return TipMessage.Wrong("获取数据列表数失败, 请检查网络是否畅通");
					}
					TipMessage.isOK("移除权限成功");
					this.getRolesList();
				}).catch((error)=>{
				    console.log("请求错误, 原因是: ", error);
				})

			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消'
				});
			});
		},


		//分配权限按钮
		showSetRightDialog(role){
			this.roleId = role.id;

			let data = {
				"id": role.id
			}

			//get请求
			get("/rights/tree" , data).then((res)=>{
			    console.log("打印请求的原始res数据: ", res);
			    if (res.data.meta.status !== 200){
					return TipMessage.Wrong("获取数据列表数失败, 请检查网络是否畅通");
			    }

				// 把获取到的权限数据保存到 data 中
				this.rightslist = res.data.data
				console.log("把获取到的权限数据保存到 data 中: ", this.rightslist)

				// ================================
				// 递归获取3级节点的Id [只获取三级权限]
				// ================================
				this.getLeafKeys(role, this.defKeys)

				this.setRightDialogVisible = true  //展开弹出框
			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})

		},

		// 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
		getLeafKeys(node, arr) {
			// 如果当前 node 节点不包含 children 属性，则是三级节点
			if (!node.children) {
				return arr.push(node.id)
			}
			node.children.forEach( (item) => {
				this.getLeafKeys(item, arr)
			});
		},

		// 监听分配权限对话框的关闭事件
		setRightDialogClosed() {
			//重置, 必须要有
			this.defKeys = []
		},

		// 点击为角色分配权限
		allotRights() {
			const keys = [
				//组件提供, 看文档 https://element-plus.org/#/zh-CN/component/tree
				...this.$refs.treeRef.getCheckedKeys(),      //全选id
				...this.$refs.treeRef.getHalfCheckedKeys()   //半选id
			]
			const idStr = keys.join(',')

			let data = {
				"rids": idStr
			}

			let params = {
				"rids": idStr
			}

			postUp(`/roles/${this.roleId}/rights` , data, params).then((res)=>{
			      if (res.data.meta.status !== 200){
			        return TipMessage.Wrong("获取数据列表数失败, 请检查网络是否畅通");
			    }
				this.$message.success('分配权限成功！')
				this.getRolesList()
				this.setRightDialogVisible = false

			}).catch((error)=>{
			    console.log("post错误, 原因是: ", error);
			})
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

.el-tag {
	margin: 7px;
}

.bdtop {
	border-top: 1px solid #eee;
}

.bdbottom {
	border-bottom: 1px solid #eee;
}

.vcenter {
	display: flex;
	align-items: center;
}
</style>
