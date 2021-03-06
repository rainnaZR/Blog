
### 1. 调试工具

以下方法注意提高性能：

- 引入第三方模块需要谨慎。electron依赖于系统内容，尽量少的减少内存占用。
- 尽量避免等待。不应该在窗口创建前处理业务逻辑，主进程避免采用同步方法，以免阻塞进程。如果有耗时任务，采用web worker来处理或是浏览器空闲的时候处理。判断系统是否空闲状态，powerMonitor.getSystemIdleState(idleThreshold)。还有可以将静态资源打包到应用中。
- 尽量合并资源。web应用是把资源拆分，来最大化利用浏览器的并发下载能力。但是electron是本地应用，下载速度不是问题，所以尽量将资源合并。

### 2. 日志

#### 崩溃报告

```
let electron = require('electron');
electron.crashReporter.start({
    productName: 'yourName',
    companyName: 'yourCompanyName',
    submitURL: 'http://localhost:8989',
    uploadToServer: true
})
```


## 扩展阅读

- Spectron用来做测试工具。
- electron内置的contentTracing模块自动追踪性能问题。
- Devtron是Electron官方团队开发的调试工具。Devtron开发环境调试，Debugtron生产环境调试。
- electron-log模块可以用来记录日志。
- electron内置crashReporter模块来记录崩溃报告。