// 这里服务端用了ws这个库。相比大家熟悉的socket.io，ws实现更轻量，性能更好。

// 引入依赖
const app = require('express')()
// const http = require('http').createServer(app)
const Websocket = require('ws')

const wss = new Websocket.Server({
  port: 8080, // websocket监听端口
})

let isServerOpen = '0' // 是否开启服务端
let isOpenInterval = '0' // 是否开启定时推送消息给客户端

// 监听websocket连接
wss.on('connection', ws => {
  console.log('服务端接受连接')
  ws.send('服务端：websocket连接已建立')
  let timer = null
  // 监听客户端连接
  ws.on('message', message => {
    // 监听客户端消息
    console.log('服务端接受数据: %s', message)
    // 发送消息给客户端
    ws.send(`服务端：client端数据${message}已接收`)
    // 解析客户端消息
    const messageArr = message.toString().split('&')
    // 解析客户端消息
    messageArr.forEach(item => {
      const itemArr = item.split('=')
      if (itemArr[0] === 'isOpenInterval') {
        isOpenInterval = itemArr[1].toString()
      }
    })
    // 定时推送消息给客户端
    if (message.toString().indexOf('isOpenInterval') > -1) {
      if (isOpenInterval === '1') {
        timer = setInterval(() => {
          ws.send('服务端：定时推送消息给客户端')
        }, 5000)
      } else {
        timer && clearInterval(timer)
        timer = null
        ws.send('服务端：定时推送已关闭')
      }
    }
  })
  // 监听客户端断开连接
  ws.on('close', () => {
    timer && clearInterval(timer)
    timer = null
    console.log('服务端断开连接')
    ws.send('服务端：websocket连接已断开')
  })
})

// 监听端口
app.listen(3000, () => {
  isServerOpen = '1'
  console.log('服务端口:3000')
})
