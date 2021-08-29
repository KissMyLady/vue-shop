import {createRouter, createWebHistory} from 'vue-router'
import Login from "@/components/Login";
import Index from "@/components/Index"
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import Users from "@/components/user/Users";
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";


const routes = [

	{ path: "/login", name: "Login", component: Login},
	{ path: "/index", name: "Index", component: Index},
	{ path: "/home",  name: "Home",  component:Home, redirect: "/users",
		children: [
			{ path: "/welcome", name: "welcome",  component: Welcome},
			{ path: "/users",   name: "users",    component: Users},
			{ path: "/rights",  name: "rights",   component: Rights},
			{ path: "/roles",   name: "roles",    component: Roles},
		]
	},

	{ path: "/", redirect: "/login"},

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
