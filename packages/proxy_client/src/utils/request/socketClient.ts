import { io } from 'socket.io-client'

export default class SocketClient {
  socket
  constructor() {
    this.socket = io('http://localhost:4000')
    this.socket.on('connect', () => {
      console.log(`连接成功`)
    })
    this.socket.on('disconnect', () => {
      console.log(`断开连接`)
    })
    this.socket.on('error', (err) => {
      console.log(`连接错误: ${err}`)
    })
  }
  listen(eventName: string, callback: Function) {
    this.socket.on(eventName, (...args) => callback(args))
  }
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data)
  }

  removeAllListeners() {
    this.socket.removeAllListeners()
  }
}
