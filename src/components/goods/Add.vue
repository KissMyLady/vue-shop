<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>



		<!-- 卡片视图 -->
		<el-card>

			<!-- 提示区域 -->
			<el-alert title="添加商品信息"
					  type="info"
					  center
					  show-icon
					  :closable="false"></el-alert>

			<!-- 水平步骤条 -->
			<el-steps :space="200"
					  :active="activeIndex - 0"
					  finish-status="success"
					  align-center>

				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>

			<!-- tab栏区域 -->
			<el-form :model="addForm"
					 :rules="addFormRules"
					 ref="addFormRef"
					 label-width="100px"
					 label-position="top">

				<!--纵向Tab栏参考文档: https://element-plus.org/#/zh-CN/component/tabs -->
				<el-tabs v-model="activeIndex"
						 :tab-position="'left'"
						 :before-leave="beforeTabLeave"
						 @tab-click="tabClicked">

					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addForm.goods_name"></el-input>
						</el-form-item>

						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addForm.goods_price" type="number"></el-input>
						</el-form-item>

						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addForm.goods_weight" type="number"></el-input>
						</el-form-item>

						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addForm.goods_number" type="number"></el-input>
						</el-form-item>

						<!--下拉菜单 选择三级分类-->
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader expand-trigger="hover"
										 :options="catelist"
										 :props="cateProps"
										 v-model="addForm.goods_cat"
										 @change="handleChange">
							</el-cascader>
						</el-form-item>

					</el-tab-pane>

					<el-tab-pane label="商品参数" name="1" style="text-align: left">
						<!-- 渲染表单的Item项 -->
						<el-form-item :label="item.attr_name" :key="item.attr_id"
									  v-for="item in manyTableData">

							<!-- 复选框组 -->
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox :label="cb"
											 v-for="(cb, i) in item.attr_vals"
											 :key="i" border></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>

					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name"
									  v-for="item in onlyTableData"
									  :key="item.attr_id">
							<el-input v-model="item.attr_vals"></el-input>
						</el-form-item>
					</el-tab-pane>

					<el-tab-pane label="商品图片" name="3">
						<!-- action 表示图片要上传到的后台API地址 -->
						<el-upload :action="uploadURL"
								   :on-preview="handlePreview"
								   :on-remove="handleRemove"
								   list-type="picture"
								   :headers="headerObj"
								   :on-success="handleSuccess">
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>

					<el-tab-pane label="商品内容" name="4">

						<!-- vue3不支持 vue-quill-editor
						     <quill-editor v-model="addForm.goods_introduce"></quill-editor> -->

						<!-- vue3支持的:     https://vueup.github.io/vue-quill/guide/options.html#globaloptions-prop -->
						<!-- 参考Github回答: https://github.com/vueup/vue-quill/issues/35 -->
						<quill-editor theme="snow"
									  ref="myQuillEditor"
									  v-model:content="content"
									  content-type="html"
									  :options="editorOption">
						</quill-editor>

						<!--添加商品的按钮 -->
						<el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
					</el-tab-pane>

				</el-tabs>
			</el-form>

		</el-card>

		<!-- 图片预览 -->
		<el-dialog title="图片预览"
				   v-model="previewVisible"
				   width="50%">
			<img :src="previewPath"
				 alt=""
				 class="previewImg">
		</el-dialog>

	</div>
</template>


<script>
import TipMessage from "@/tools/TipMessage";
import {get, post, put, putUp, del, postUp} from '@/request/request'
import { QuillEditor } from '@vueup/vue-quill'

export default {
	data() {
		return {
			activeIndex: '0',
			// 添加商品的表单数据对象
			addForm: {
				goods_name: '',
				goods_price: 0,
				goods_weight: 0,
				goods_number: 0,
				// 商品所属的分类数组
				goods_cat: [],
				// 图片的数组
				pics: [],
				// 商品的详情描述
				goods_introduce: '',
				attrs: []
			},

			addFormRules: {
				goods_name: [
					{ required: true, message: '请输入商品名称', trigger: 'blur' }
				],
				goods_price: [
					{ required: true, message: '请输入商品价格', trigger: 'blur' }
				],
				goods_weight: [
					{ required: true, message: '请输入商品重量', trigger: 'blur' }
				],
				goods_number: [
					{ required: true, message: '请输入商品数量', trigger: 'blur' }
				],
				goods_cat: [
					{ required: true, message: '请选择商品分类', trigger: 'blur' }
				]
			},

			//商品分类
			catelist: [],
			cateProps: {
				label: 'cat_name',
				value: 'cat_id',
				children: 'children'
			},

			// 动态参数列表数据
			manyTableData: [],

			// 静态属性列表数据
			onlyTableData: [],

			// 上传图片的URL地址
			uploadURL: 'http://139.198.178.12:9000/api/private/v1/upload',

			// 图片上传组件的headers请求头对象
			headerObj: {
				Authorization: window.sessionStorage.getItem('token')
			},
			previewPath: '',
			previewVisible: false,

			//富文本工具栏ctrl
			//editor: "",   // 富文本编辑器对象
			content: "",    // 富文本编辑器默认内容
			editorOption: { //  富文本编辑器配置
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
						['blockquote', 'code-block'],     //引用，代码块
						[{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
						[{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
						[{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
						[{ 'direction': 'rtl' }],             // 文本方向
						[{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
						[{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
						[{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
						[{ 'font': [] }],     //字体
						[{ 'align': [] }],    //对齐方式
						['clean'],    //清除字体样式
						['image','video']    //上传图片、上传视频
					]
				},
				theme: 'snow',
				placeholder: '请输入正文'
			},
		}
	},

	created() {
		this.getCateList();
	},

	//函数
	methods: {

		//获取商品分类
		getCateList(){
			get("/categories" , {}).then((res)=>{
			    if (res.data.meta.status !== 200){
			        return TipMessage.Wrong(res.data.meta.msg);
			    }
				this.catelist = res.data.data;
			}).catch((error)=>{
			    console.log("请求错误, 原因是: ", error);
			})
		},

		// 级联选择器选中项变化，会触发这个函数
		handleChange() {
			if (this.addForm.goods_cat.length !== 3) {
				this.addForm.goods_cat = []
			}
		},

		// 监听切换之前的检查
		beforeTabLeave(activeName, oldActiveName){
			// console.log('即将离开的标签页名字是：' + oldActiveName)
			// console.log('即将进入的标签页名字是：' + activeName)
			// if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
			// 	TipMessage.Warning("请选择商品分类");
			// 	return false
			// }
		},

		// 点击标签页
		tabClicked(){
			console.log("tab标签被点击了: ", this.activeIndex)
			// 证明访问的是动态参数面板
			if (this.activeIndex === "1"){
				let data1 = {
					 sel: 'many'
				};

				get(`categories/${this.cateId}/attributes`,data1).then((res)=>{
					console.log("打印请求的原始res数据: ", res);
					if (res.data.meta.status !== 200){
						return TipMessage.Wrong(res.data.meta.msg);
					};
					console.log(": 请求数据成功, 打印: ", res.data);
					res.data.data.forEach(item => {
						item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
					});
					this.manyTableData = res.data.data;
				}).catch((error)=>{
					console.log("请求错误, 原因是: ", error);
				});
			}else if (this.activeIndex === '2') {
				let data2 = {
					sel: 'only'
				};
				get(`categories/${this.cateId}/attributes`,data2).then((res)=>{
					console.log("打印请求的原始res数据: ", res);
					if (res.data.meta.status !== 200){
						return TipMessage.Wrong(res.data.meta.msg);
					};
					console.log(": 请求数据成功, 打印: ", res.data);
					this.onlyTableData = res.data.data;
				}).catch((error)=>{
					console.log("请求错误, 原因是: ", error);
				});
			}
		},

		//图片上传
		// 处理图片预览效果
		handlePreview(file) {
			console.log("处理图片预览效果file打印: ", file);
			this.previewPath = file.response.data.url;
			this.previewVisible = true;
		},

		// 处理移除图片的操作
		handleRemove(file) {
			console.log("处理移除图片的操作file打印: ", file);
			// 1. 获取将要删除的图片的临时路径
			const filePath = file.response.data.tmp_path;

			// 2. 从 pics 数组中，找到这个图片对应的索引值
			const i = this.addForm.pics.findIndex((x) => x.pic === filePath);

			// 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
			this.addForm.pics.splice(i, 1);
			console.log(this.addForm);
		},

		// 监听图片上传成功的事件
		handleSuccess(response) {
			console.log("监听图片上传成功的事件: ", response);
			// 1. 拼接得到一个图片信息对象
			const picInfo = { pic: response.data.tmp_path };

			// 2. 将图片信息对象，push 到pics数组中
			this.addForm.pics.push(picInfo);
			console.log("将图片信息对象，push 到pics数组中, 打印this.addForm: ", this.addForm);
		},

		//商品上传点击事件
		addGoods(){
			this.$refs.addFormRef.validate( (valid)=>{
				// if (!valid) {
				// 	return this.$message.error('请填写必要的表单项！')
				// }
				// 执行添加的业务逻辑
				const formData = this.addForm;
				formData.goods_cat = formData.goods_cat.join(',')
				formData.goods_introduce = this.content;

				//处理动态参数
				this.manyTableData.forEach(item => {
					const newInfo = {
						attr_id: item.attr_id,
						attr_value: item.attr_vals.join(' ')
					}
					this.addForm.attrs.push(newInfo)
				})

				//处理静态参数
				this.onlyTableData.forEach(item => {
					const newInfo = {
						attr_id: item.attr_id,
						attr_value: item.attr_vals
					}
					this.addForm.attrs.push(newInfo)
				})
				formData.attrs = this.addForm.attrs

				//发起请求
				let data = {
					"goods_name":      formData.goods_name,
					"goods_cat":       formData.goods_cat,
					"goods_price":     formData.goods_price,
					"goods_number":    formData.goods_number,
					"goods_weight":    formData.goods_weight,
					"goods_introduce": formData.goods_introduce,  //介绍
					"pics":            formData.pics,			  //上传的图片临时路径(对象)
					"attrs":           formData.attrs,            //商品的参数(数组), 包含 动态参数 和 静态属性
				};
				post("/goods" , data).then((res)=>{
				    console.log("打印请求的数据res: ", res);
				      if (res.data.meta.status !== 201){
				        return TipMessage.Wrong(res.data.meta.msg);
				    }
					TipMessage.isOK("商品添加成功");
				}).catch((error)=>{
				    console.log("post错误, 原因是: ", error);
				})
			});
		},

	},

	//计算属性
	computed: {
		cateId() {
			if (this.addForm.goods_cat.length === 3) {
				return this.addForm.goods_cat[2]
			}
			return null
		},
	},

	//监听
	watch: {

	},

	//组件
	components: {
		QuillEditor
	}

}
</script>


<style scoped>
.el-checkbox {
	margin: 0 10px 0 0 !important;
}

.previewImg {
	width: 100%;
}

.btnAdd {
	margin-top: 15px;
}

</style>
