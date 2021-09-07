/**
 * 封装参考: https://github.com/Mrmangmang/axios
 * Bilibili视频: https://www.bilibili.com/video/BV1Ft4y1m7n1
 */
import axiox from 'axios'

// 导入 NProgress 包对应的JS和CSS npm install nprogress --save
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


const instance = axiox.create({
	  baseURL: "http://139.198.178.12:9000/api/private/v1/",  //云服务器
	//baseURL: "http://192.168.1.11:8888/api/private/v1/",    //R720 ubuntu服务器, stnode 启动
	//baseURL: "http://127.0.0.1:8888/api/private/v1/",       //T14本地服务器       stnode 启动
	//baseURL: "https://www.mylady.top",
	  timeout: 3 * 1000,
})

//全局请求拦截
//所有的网络请求都会先走这个方法
// 添加请求拦截器,所有的网络请求都会先走这个方法，我们可以在它里面为请求添加一些自定义的内容
instance.interceptors.request.use(function (config) {
	// 在发送请求之前做些什么
	NProgress.start();
	//获取token,添加Authorization字段
	config.headers.Authorization = window.sessionStorage.getItem("token");
	return config;
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});


// 全局响应拦截配置
//此处可以根据服务器的返回状态码做响应的处理
//404 404 500
instance.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	NProgress.done();
	return response;
}, function (error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});

export function get(url, params) {
	return instance.get(url,{params});
}

export function post(url, data) {
	return instance.post(url, data);
}

export function postUp(url, data, body) {
	return instance.post(url, data, body);
}

export  function del(url) {
	return instance.delete(url);
}

export  function put(url, data) {
	return instance.put(url, data);
}

export  function putUp(url, data, body) {
	return instance.put(url, data, body);
}
