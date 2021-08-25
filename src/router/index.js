import {createRouter, createWebHistory} from 'vue-router'
import Login from "@/components/Login";
import Index from "@/components/Index";


const routes = [


	{ path: "/login", name: "Login", component: Login},
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

export default router
