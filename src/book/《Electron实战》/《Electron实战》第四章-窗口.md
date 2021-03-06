
### 1. 窗口的控制按钮

```
const { remote } = window.require('electron');

onWindowMax(){
    remote.getCurrentWindow().maximize();
},
onWindowMin(){
    remote.getCurrentWindow().minimize();
},
onWindowRestore(){
    remote.getCurrentWindow().restore();
},
onWindowClose(){
    remote.getCurrentWindow().close();
}
```

remote.getCurrentWindow()获取到的窗口对象，是一个存在于主进程中的远程对象。

### 2. 防抖与限流

#### 防抖就是短期内有大量事件触发时，只执行最后一次事件关联的任务。

```
function debounce(fn, interval){
    let timeout = null;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, interval);
    }
}
```

#### 节流就是短期内有大量事件触发时，只会执行第一次触发的事件。

```
function throttle(fun, interval){
    let timeout = null;
    return function(){
        if(timeout) return;
        timeout = setTimeout(() => {
            fun.apply(this, arguments);
            timeout = null;
        }, interval);
    }
}
```

### 3. 窗口的显示与隐藏

实例化窗口对象时，show值设为false隐藏窗口。

```
const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,  //不显示窗口
    frame: false,  //不显示顶部工具栏
    ...
  })
```

win.close()，win.destroy()都可以关闭窗口。调用win的show()则可以显示窗口。


```
win.show();
```

窗口对象的 setIgnoreMouseEvents 方法可以使窗口忽略窗口内所有的鼠标事件，并且将此窗口中的鼠标事件传递到此窗口背后的内容上。

### 4. 多窗口竞争资源

有三种解决方案推荐：

- 两个窗口通过渲染进程间的消息通信来保证读写操作有序进行。用户操作窗口A修改内容后，窗口A发消息给窗口B，通知窗口B更新内容。当一个渲染进程准备写文件时，先广播消息给其它渲染进程，禁止其它渲染进程访问该文件；当此渲染进程完成文件写操作后，再广播消息给其它渲染进程，说明已经释放了该文件，其它窗口就可以修改该文件了。类似于锁机制。
- 使用Node.js的fs.watch来监视文件的变化，一旦文件发生变化，则加载最新的文件。文件的写操作交给主进程执行。如果渲染进程需要写文件，发消息给主进程，由主进程来完成写文件操作。如果多个窗口需要写文件，由主进程来保证顺序，排队依次执行。（推荐使用）
- 在主进程中设置一个令牌 global.fileLock = false; 在渲染进程中读取这个令牌值，判断这个令牌是否被其它渲染进程拿走了；如果没有，则该渲染进程拿走令牌（发消息给主进程修改令牌值），完成文件写操作，然后再释放令牌。


### 5. 模态窗口和子窗口

```
this.win = new remote.BrowserWindow({
    parent: remote.getCurrentWindow(),
    modal: true,  // true打开模态窗口，禁用父窗口所有操作；false为子窗口，不禁用父窗口操作
    webPerferences: {
        nodeIntegration: true
    }
})
```

## 扩展阅读

- Node.js提供两个API来监听文件的变化：fs.watch和fs.watchFile，fs.watch会更高效。
- process.platform 和 require('os').platform() 可以判断系统的平台， process.platform: 'darwin'（mac系统）/ 'win32'（windows系统）/linux（linux系统）。
- process.argv表示当前进程的启动命令参数。
- process.env表示用户的环境信息。
- process.kill() 结束某个进程。
- process.versions.electron 获取当前使用的electron的版本号。