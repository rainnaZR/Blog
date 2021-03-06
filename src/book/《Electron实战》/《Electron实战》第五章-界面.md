
### 1. 页面内容

webContents是Electron核心模块，负责渲染和控制应用内的web界面。在渲染进程中获取当前窗口代码如下：

```
let { remote } = require('electron');
let webContent = remote.getCurrentWebContents();
```

webcontents可以监听与页面跳转有关的事件，以navigate命名的事件，一般都是由客户端控制的跳转；以redirect命名的事件，一般都是由服务端控制的跳转，比如302跳转。301代表永久性转移，302代表临时性转移。单页应用的跳转方式有两种：

- hash模式，window.location.hash。
- history模式，window.history.pushState，需要在服务端做配置，所有的路由地址都映射到index.html上。

webcontents的setZoomFactor方法可以设置页面的缩放比例，getZoomFactor方法可以获取当前页面的缩放比例。或是setZoomLevel和getZoomLevel()。

#### JS与HTML在页面上绘制2D图形的技术有两种：

- Canvas：基于分辨率，绘制的是位图，能够以jpg或者png的格式保存为图片文件，适合在小的画布上绘制大量的元素，有着较强的频繁重绘能力。
- SVG：基于XML的，SVG Dom树中的每个被绘制的图形都是对象，如果SVG的属性发生变化，浏览器能够自动重绘图形。SVG绘制的图形是不依赖分辨率的矢量图形，适合在大型渲染区域绘制少量的元素，或绘制需要复杂交互逻辑的2D图形。


### 2. 页面容器

页面容器分为以下三种：

- webFrame
- webview
- BrowserView(推荐)

#### webFrame

使用webContents.isLoadingMainFrame()方法来判断mainFrame是否已经加载完成。

```
webPreferences: {
    nodeIntegrationInSubFrames: true  // 是否允许在子页面或子窗口集成Node.js
}
```

#### BrowserView

BrowserView依托于BrowserWindow存在。创建BrowserView代码如下：

```
onCreateBrowserView(){
    let view = new remote.BrowserWindow({
        webPerferences: {
            preload: true
        }
    });
    let win = remote.getCurrentWindow();
    win.setBrowserView(view);
    let size = win.getSize();
    view.setBounds({
        x: 80,
        y: 80,
        width: size[0],
        height: size[1]
    });
    view.webContents.loadURL('http://www.baidu.com');
}
```

如果存在多个BrowserView，可以使用win.addBrowserView和win.removeBrowserView(view)来控制显示和隐藏。推荐使用BrowserView来实现页面容器的需求。

### 3. 脚本注入

脚本注入有以下几种方法：

- preload
- webContents.executeJavaScript

#### preload

主进程脚本中加入如下代码可实现脚本注入：

```
let preload = require('path').join(__static, 'main.js');
const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        preload  // 预加载脚本文件
    }
})
win.loadURL('app://./index.html')
```

如果有多个脚本，可以在注入的脚本中使用reqire来引入其他的脚本。

#### webContents.executeJavaScript

插入JS代码如下：

```
win.webContents.executeJavaScript('document.querySelector(\'img\').src')
```

#### webContents.insertCSS

渲染进程插入CSS代码如下：

```
async onInsertCss(){
    let webContent = remote.getCurrentWebContents();
    this.cssKey = await webContent.insertCSS('body,html{background:red!important}');
}
```

渲染进程移除CSS代码如下：

```
async onRemoveCss(){
    let webContent = remote.getCurrentWebContents();
    await webContent.removeInsertedCSS(this.cssKey);
}
```

### 4. 页面动效

页面动效有以下实现方式：

- css animation
- web Animations API

## 扩展阅读

- PixiJS库对WebGL API进行了二次封装。有强大的硬件加速能力。
- 可以在loadUrl方法调用时，修改ua的值。也可以通过app.userAgent.fallback属性来全局设置UA值。

