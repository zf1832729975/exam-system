module.exports = {
	devServer: {
		proxy: {
			'/api': {
                // target: 'http://192.168.1.211:3000',
                // target: 'http://192.168.199.187:3000/',
				target: 'http://127.0.0.1:3000',
                // target: 'http://148.70.239.67:3000',
                // target: 'http://0.0.0.0.:3000',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/api/'  //通过pathRewrite重写地址，将前缀/api转为/
				}
			}
        },
        open: true,
        host: '0.0.0.0',
        port: 8080
	},
	productionSourceMap:false
}