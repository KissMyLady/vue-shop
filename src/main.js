import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//导入element
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./assets/css/global.css"     //全局样式
import "./assets/font/iconfont.css"  //导入字体图标


// const app = createApp(App)
// app.use(ElementPlus)
// app.use(router)
// app.mount('#app')


// 原始的启动
createApp(App)
	.use(router)
	.use(ElementPlus)
	.mount('#app')
