
### 1. 打开文件

```
async onOpenFile(){
    let filePath = await remote.dialog.showOpenDialog({
        title: '我要选择一个文件',
        buttonLabel: '选择按钮',
        defaultPath: remote.app.getPath('downloads'),
        files: [{
            name: '图片',
            extensions: ['jpg', 'png']
        }]
    });
    console.log('onOpenFile', filePath);
}
```

### 2. 设置目录

```
onSettingMenu(){
    let Menu = remote.Menu;
    let templateArr = [{
            label: ''
        },{
        label: '菜单A',
        submenu: [{
            label: '菜单A-1'
        },{
            label: '菜单A-2',
            click(){
                alert('菜单A-2点击');
            }
        },{
            label: '菜单A-3'
        }]
    }];
    let menu = Menu.buildFromTemplate(templateArr);
    Menu.setApplicationMenu(menu);
}
```

### 3. 事件监听

```
onKeyboardClick(){
    window.onkeydown = event => {
        if((event.ctrlKey || event.metaKey) && event.keyCode == 83){
            alert('Ctrl+S 按键监听');
        }
    }
}
```

### 4. 剪切板

clipboard模块是electron中少有的主进程和渲染进程能同时使用的模块，内容写入剪切板后，直接ctrl+v就可以将内容输出出来。

```
onCopyContent(type, value){
    let { clipboard, nativeImage } = window.require('electron');
    switch(type){
        case 'text':
            clipboard.writeText(value);
            break;
        case 'html':
            clipboard.writeHTML(value);
            break;
        case 'img':
            {
            let imgPath = window.require('path').join(__dirname, 'favicon.ico');
            let img = nativeImage.createFromPath(imgPath);
            clipboard.writeImage(img);
            break;
            }
    }
}
```

清除剪切板的内容：

```
clipboard.clear();
```

读取剪切板内容：

```
onReadContent(type){
    let { clipboard } = window.require('electron');
    switch(type){
        case 'text':
            alert(clipboard.readText());
            break;
        case 'html':
            alert(clipboard.readHTML());
            break;
    }
}
```

### 5. 系统通知

通过remote模块访问主进程中Notification类型。

```
onSendNotice(){
    let { Notification } = remote;
    let notification = new Notification({
        title: '消息的标题',
        body: '消息的正文，消息的正文，消息的正文，消息的正文，消息的正文，消息的正文'
    })
    notification.show(); // 需要调用show方法才能显示
    notification.on('click', () => {
        alert('用户点击了消息')
    })
}
```

### 6. 字体

CSS3提供的系统字体样式设置：

```
<div style="font:caption">我是标题</div>
<div style="font:menu">我是菜单</div>
<div style="font:message-box">我是对话框中的字体</div>
<div style="font:status-bar">我是状态栏中的字体</div>
```


## 扩展阅读

- clipboard-files模块可以用来操作剪切板里的内容。
- clipboard, shell等模块是主进程和渲染进程共有的。
- 使用app.addRecentDocument方法，可以给应用增加一个最近打开的文件，参数是文件路径。
- app.clearRecentDocuments()方法可以清除最近打开的文件列表。