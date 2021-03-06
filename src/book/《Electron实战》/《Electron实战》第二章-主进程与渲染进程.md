### 概念

Electron应用程序区分主进程和渲染进程。线程是进程的子集，进程不共享内存，线程可以共享内存，一个进程会创建多个线程。例子中yarn start执行index.js中的代码就是在Electron的主进程中，主进程负责创建窗口并加载index.html，而index.html中编写的代码运行在Electron的渲染进程中。

- 主进程负责完成监听应用程序的生命周期事件，启动窗口，加载页面，应用程序关闭后回收资源，退出程序等工作。主进程管理窗口及其渲染进程。
- 渲染进程负责完成渲染界面，接收用户输入，响应用户交互等工作。

一个Electron应用只会有一个主进程，多个渲染进程。一个BrowserWindow实例代表一个渲染进程。

JS的事件循环机制使得JS适合处理高IO的应用，不适合处理CPU密集型的任务，所以一般使用Node.js来接管web请求（IO操作），复杂的业务逻辑（CPU操作）由node.js转交给java执行。

### 进程互访

- 渲染进程访问主进程：渲染进程使用electron.remote来调用主进程的方法。除了remote.getCurrentWindow()和remote.getCurrentWebContents()外，还可以通过remote对象访问主进程的app,BrowserWindow等对象和类型。渲染进程无法直接访问BrowserWindow等对象和类型。
- 主进程访问渲染进程对象。

### 进程间消息传递

- 渲染进程向主进程发送消息：渲染进程使用electron内置的ipcRenderer模块向主进程发送消息。

```
// 第一个参数是消息管道的名称，后面的参数是消息传递的数据
// 渲染进程发送消息
let { ipcRenderer } = require('electron');
ipcRenderer.send('msg', {
    name: 'name1'
},{
    name: 'name2'
})

// 主进程接收消息
let { ipcMain } = require('electron');
ipcMain.on('msg', (event, param) => {
    console.log(event.sender, param);
})
```

消息传递的原理都是进程间通信，通信过程中随消息发送的json对象会被序列化和反序列化，所以JSON对象中包含的方法和原型上的数据不会被传送。

### 扩展阅读

- mac下使用 Alt+Command+I 即可打开渲染进程的调试窗口。
- mac下使用 Command+R 刷新页面
- 使用 win.webContents.openDevTools(); 可以在页面启动时打开开发者工具
