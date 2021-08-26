import {createRouter, createWebHistory} from 'vue-router'
import Login from "@/components/Login";
import Index from "@/components/Index"
import Home from "@/components/Home";


const routes = [

	{ path: "/login", name: "Login", component: Login},
	{ path: "/index", name: "Index", component: Index},
	{ path: "/home",  name: "Home",  component: Home},

	{ path: "/", redirect: "/login"},

	// {
	//   path: '/about',
	//   name: 'About',
	//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	// }
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

//导航守卫
router.beforeEach((to, from, next) => {
	//访问登录页, 放行
	if (to.path === "/login"){
		return next();
	}

	//从sessionStorage 中获token
	const token = window.sessionStorage.getItem("token");
	if (!token){
		return next("/login");
	}

	//放行
	next();
})





export default router
