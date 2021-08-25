<template>
	<div class="index">
		<h1>Index页</h1>

		<h3 v-on:click="test()">点击</h3>

	</div>
</template>


<script>

export default {
	data() {
		return {
			title: '组件标题',
			firstName: '',
			lastName: '',
		}
	},

	//计算属性
	computed: {
	},

	//监听
	watch: {
	},

	//函数
	methods: {
		test: function (){
			console.log("当前index, 被点击了");
		}
	},

	//组件
	components: {}

}

</script>


<style scoped>
h1 {
	color: #000;
}

</style>
