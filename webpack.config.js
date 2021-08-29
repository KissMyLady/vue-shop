const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlPlguin = new HtmlWebpackPlugin({
	template: './src/index.html',
	filename: 'index.html'
})

const VueLoaderPlugin = require('vue-loader/lib/plugin')


//参考: https://webpack.js.org/
module.exports = {
	mode: "development",  //development, production
	entry: path.join(__dirname, '/src/index.js'),
	output: {
		path: path.join(__dirname, './dist'), // 输出文件的存放路径
		filename: 'bundle.js', // 输出文件的名称
	},

	//自动打包工具服务
	devServer: {
		port: 9001,
		open: true,
		historyApiFallback: true
	},

	//limit用来设置字节数, 小于值的图片, 才会转换为base64图片
	module: {
		rules: [
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
			{ test: /\.jpg|png|gif|bmp|ttf|eot|svg|woff|woff2$/, use: 'url-loader?limit=16941' },
			{ test: /\.vue$/, loader: 'vue-loader' },
		]
	},

	plugins: [
		htmlPlguin,
		new VueLoaderPlugin()
	],


}
