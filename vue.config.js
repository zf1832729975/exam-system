module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:3000',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''  //通过pathRewrite重写地址，将前缀/api转为/
				}
			}
		}
	}
}