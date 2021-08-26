<template>
	<div>
		<h1>ThePage</h1>

		<el-row>
			<el-button type="info" v-on:click="logout">退出</el-button>
		</el-row>

	</div>
</template>


<script>
import { ElButton } from 'element-plus'
import { Edit } from '@element-plus/icons'
import TipMessage from "@/tools/TipMessage";

export default {
	data() {
		return {}
	},

	//函数
	methods: {

		logout(){
			window.sessionStorage.clear();
			TipMessage.Info("退出登录成功");
			this.$router.push("/login");
		}
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
h1 {
	color: #000;
}

</style>
