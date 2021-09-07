import {createRouter, createWebHistory} from 'vue-router'
import Login from "@/components/Login";
import Index from "@/components/Index"
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import Users from "@/components/user/Users";
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";

//Good
import Add from "@/components/goods/Add"
import Category from "@/components/goods/Category";
import List from "@/components/goods/List";
import ParamsList from "@/components/goods/ParamsList";

import Order from "@/components/order/Order";
import Report from "@/components/report/Report";

const routes = [

	{ path: "/login", name: "Login", component: Login},
	{ path: "/index", name: "Index", component: Index},
	{ path: "/home",  name: "Home",  component:Home, redirect: "/users",
		children: [
			{ path: "/welcome", name: "welcome",  component: Welcome},
			{ path: "/users",   name: "users",    component: Users},
			{ path: "/rights",  name: "rights",   component: Rights},
			{ path: "/roles",   name: "roles",    component: Roles},

			//Goods
			{ path: "/goods",      name: "goodsList",  component: List},
			{ path: "/goods/add",  name: "add",        component: Add},
			{ path: "/categories", name: "categories", component: Category},
			{ path: "/params",     name: "params",     component: ParamsList},

			{ path: "/orders",    name: "orders",      component: Order},
			{ path: "/reports",   name: "reports",     component: Report},

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
