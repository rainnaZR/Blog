
screen模块只有在app.ready事件发生之后才能使用。可以使用kiosk参数来控制全屏。

### 1. 录屏

相关源代码如下：

```
async onGetCapture(){
    let { desktopCapturer } = window.require('electron');
    let sources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });
    let target = sources.find(v => v.name == 'vue-electron');
    let mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: target.id
            }
        }
    });
    var video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = () => video.play();
}
```

### 2. 电源信息

相关源代码如下：

```
async onViewBattery(){
    let batteryManager = await navigator.getBattery();
    let batteryInfo = `是否在充电：${batteryManager.charging}，还剩余电量：${batteryManager.dischargingTime}，当前充电水平：${batteryManager.level}`;
    alert(batteryInfo);
}
```

### 3. 监控系统挂起和锁屏

当系统睡眠时触发powerMonitor模块的suspend事件，系统从睡眠中恢复时触发powerMonitor模块的resume事件。powerMonitor模块还提供屏幕锁定lock-screen和unlock-screen事件。

### 4. 打印机

打印源代码如下：

```
onPrint(){
    let webContents = remote.getCurrentWebContents();
    let printers = webContents.getPrinters(); // 获取所有的打印机
    let printer = printers.filter(i => i.name == 'myprint')[0];  // 选择需要打印的打印机
    webContents.print({
        slient: false,
        printBackground: true,
        deviceName: printer?.name
    }, (success, errorType) => {
        !success && alert(errorType);
    })
}
```

导出pdf代码如下：

```
async onSavePdf(){
    let fs = window.require('fs');
    let webContents = remote.getCurrentWebContents();
    let data = await webContents.printToPDF({});
    let pathObj = await remote.dialog.showSaveDialog({
        title: '当前页面保存为pdf文件',
        filters: [{
            name: 'pdf',
            extensions: ['pdf']
        }]
    });
    if(pathObj.canceled) return; // 如果用户取消，则文件不保存
    fs.writeFile(pathObj.filePath, data, error => {
        error && console.log(error);
        alert('保存成功')
    });
}
```

## 扩展阅读

- document.body.requestPointerLock()，将鼠标锁定在窗口可见区域内。
- document.exitPointerLock()，取消鼠标锁定。
- powerSaveBlocker.start('prevent-display-sleep')阻止系统息屏。prevent-app-suspension阻止应用程序挂起。