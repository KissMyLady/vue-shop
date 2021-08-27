//消息盒子确认

export default {

	checkOkMessageBox(msg="此操作将永久删除该文件, 是否继续?") {
		this.$confirm(msg, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			this.$message({
				type: 'success',
				message: '成功!'
			});
		}).catch(() => {
			this.$message({
				type: 'info',
				message: '已取消'
			});
		});
	},

	checkBox2(){
		this.$alert('这是一段内容', '标题名称', {
			confirmButtonText: '确定',
			callback: action => {
				this.$message({
					type: 'info',
					message: `action: ${ action }`
				});
			}
		});
	}


}
