import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./assets/css/global.css"     //全局样式
import "./assets/font/iconfont.css"  //导入字体图标
//import TreeTable from 'vue-table-with-tree-grid'
//import VueQuillEditor from 'vue-quill-editor'  //富文本, 运行依赖: npm install vue-quill-editor --D
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
app.component('QuillEditor', QuillEditor)
//app.use(TreeTable)       //这个组件仅支持2.0
//app.use(VueQuillEditor)  //这个组件不支持Vue3

//过滤器  Vue3 不再支持过滤器
// app.filter("dateFormat", function (originVal){
// 	const dt = new Date(originVal)
//
// 	const y = dt.getFullYear()
// 	const m = (dt.getMonth() + 1 + '').padStart(2, '0')
// 	const d = (dt.getDate() + '').padStart(2, '0')
//
// 	const hh = (dt.getHours() + '').padStart(2, '0')
// 	const mm = (dt.getMinutes() + '').padStart(2, '0')
// 	const ss = (dt.getSeconds() + '').padStart(2, '0')
//
// 	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// });

// 原始的启动
// createApp(App)
// 	.use(router)
// 	.use(ElementPlus)
// 	.mount('#app')
