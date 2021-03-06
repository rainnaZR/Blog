### 1. 与web服务器通信

可以使用Node.js提供的http, https模块来通信。

#### 跨域问题处理

跨域是浏览器的一个安全功能，只有同源的脚本才具备读写Cookie, session, AJAX等的操作权限。**electron里webSecurity的设置可以关闭同源策略，允许跨域请求。**

```
const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,  // 此参数禁用当前窗口的同源策略
      allowRunningInsecureContent: true  // 此参数控制在https页面内可以访问http协议的接口内容
    }
})
```

#### websocket

websocket是HTML5提供的一个Web客户端与服务端进行全双工通信的协议。在websocket中，浏览器和服务器只需要完成一次握手，就可以建立持久性的链接，并进行双向数据传输。

```
onGetSocketRequest(){
    let websocket = new WebSocket('ws://www.aa.com/api_v2/business/linctex/video/view/26?id=26');
    websocket.onopen = evt => {
        alert('open');
    }
    websocket.onclose = evt => {
        alert('close')
    }
    websocket.onmessage = evt => {
        alert(evt.data);
    }
    // 向服务端发送数据
    websocket.sent('我要发送数据');
    // 关闭链接
    websocket.close();
}
```

### 2. 与系统其它应用通信

系统内进程间通信一般使用IPC命名管道技术实现。IPC命名管道分为客户端和服务端，服务端用于监听和接受数据，客户端用于连接和发送数据。

### 3. 使用socks5代理

常见的代理服务器有：

- http代理。
- https代理。
- socks代理，推荐使用，隐蔽性强，效率更高。

## 扩展阅读

- webPreferences.webSecurity可以设置请求服务时是否允许跨域，值为false代表可以跨域。
- webPreferences.allowRunningInsecureContent参数控制在https页面内可以访问http协议的接口内容，为true代表可以访问。
- HTTP响应码：200响应成功，3xx请求重定向，4xx请求错误，5xx服务器错误。
