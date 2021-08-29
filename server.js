//服务器的静态资源托管


const express = require('express')
const app = express()


//托管静态资源
app.use(express.static('./dist'))


app.listen(80,()=>{
	console.log("服务器的端口是: 80");
})
