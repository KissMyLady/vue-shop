import { get, post, del ,put, } from '@/request/request'
import TipMessage from "@/tools/TipMessage";
import el from "element-plus/packages/locale/lang/el";

/**
 * 参考: https://juejin.cn/post/6844903652881072141
 *
 */

export const apiAddress = (p) => {
	post('api/v1/users/my_address/address_edit_before', p)
};


//get请求
const a = () => {
	let data = {

	}
	get("/" , data).then((res)=>{
		console.log("打印请求的数据res: ", res);
		let jsonData = JSON.parse(res.request.response);
		if (jsonData.meta.status == 200){
			console.log("ok");
		}else{
			TipMessage.Info(jsonData.meta.msg);
		}

	}).catch((error)=>{
		console.log("请求错误, 原因是: ", error);
	})
}

const b = () => {
	let data = {
	}
	//发送get请求
	post("/", data)
		.then( (res) =>{
			let jsonData = JSON.parse(res.request.response);
			console.log("jsonData :", jsonData);
			if (jsonData.meta.status == 200){
				console.log("token :", jsonData.data.token);
				window.sessionStorage.setItem('token', jsonData.data.token)
				TipMessage.isOK("登录成功");
				this.$router.push("/home");
			}else {
				TipMessage.Info(jsonData.meta.msg);
			}
		}).catch( (err) =>{
		TipMessage.Info("对不起, 我们这里出现了点问题");
		console.log("登录请求错误: ", err);
	})
}
