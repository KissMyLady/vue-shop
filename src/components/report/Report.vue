<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>数据统计</el-breadcrumb-item>
			<el-breadcrumb-item>数据报表</el-breadcrumb-item>
		</el-breadcrumb>


		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
			<div id="main" style="width: 750px;height:400px;"></div>
		</el-card>


	</div>
</template>


<script>
//vue3使用echarts npm install echarts --save
import * as echarts from 'echarts';
import _ from 'lodash';

import TipMessage from "@/tools/TipMessage";
import {get, post, put, putUp, del, postUp} from '@/request/request';


export default {
	data() {
		return {

			// 需要合并的数据
			options: {
				title: {
					text: '用户来源'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#E9EEF3'
						}
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [
					{
						boundaryGap: false
					}
				],
				yAxis: [
					{
						type: 'value'
					}
				]
			},


		}
	},

	//函数
	methods: {

	},

	//此时, 页面上的元素, 已经被渲染完毕了
	mounted() {
		// 3. 基于准备好的dom，初始化echarts实例
		let myChart = echarts.init(document.getElementById('main'))

		get("/reports/type/1" , {}).then((res)=>{
		    if (res.data.meta.status !== 200){
		        return TipMessage.Wrong(res.data.meta.msg);
		    }
			// 4. 准备数据和配置项
			const result = _.merge(res.data.data, this.options);
			// 5. 展示数据
			myChart.setOption(result);

		}).catch((error)=>{
			TipMessage.Warning("连接失败, 请检查网络是否畅通");
		    console.log("请求错误, 原因是: ", error);
		})

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
