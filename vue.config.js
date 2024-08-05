const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0', // 或者设置为你的服务器的实际 IP 地址
    port: 8080
  },
  transpileDependencies: true
})
