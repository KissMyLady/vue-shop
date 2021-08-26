/**
 * 封装的消息组件
 * 参考Element-UI文档: https://element-plus.org/#/zh-CN/component/message
 *
 */
import { ElMessage } from 'element-plus'


export default {
	//Message消息提示: https://element-plus.org/#/zh-CN/component/message
	isOK(mgs="恭喜你, 这是一条成功消息") {
		ElMessage.success({
			message: mgs,
			type: 'success'
		});
	},

	Warning(msg="警告哦, 这是一条警告消息") {
		ElMessage.warning({
			message: msg,
			type: 'warning'
		});
	},

	Info(msg="注意消息") {
		ElMessage(msg);
	},

	Wrong(msg="错了哦, 这是一条错误消息") {
		ElMessage.error(msg);
	}
}
