

### 1. 应用安全

web安全主要有：

#### XSS

XSS: 跨站脚本攻击。恶意用户在提交内容时夹带恶意脚本，恶意脚本会窃取用户cookie，页面隐私信息等，然后利用这些信息假扮用户完成非法操作。

解决办法：
- 对用户输入的内容转码处理。
- cookie设置HttpOnly属性。
- cookie绑定环境信息，并在服务端校验。

#### CSRF

CSRF: 跨站请求伪造。用户打开恶意网站，恶意网站要求用户访问用户信赖的网站，并留下用户的敏感信息。

解决办法：
- 表单提交添加令牌验证。
- HTTP referrer的验证。
- 验证码。
- cookie设置HttpOnly属性。

electron应用有更高的权限，安全性更加重要。

#### 1.1 保护源码

#### 使用立即执行函数

```
(function(){
    ...
})()
```

使用立即执行函数有两个优势：

- 不必为函数命名，避免污染全局变量。
- 函数内部形成单独的作用域，外部代码无法访问内部的对象和方法。

#### 禁用调试工具

```
new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: false
    }
})
```

#### 混淆代码

uglify-js 或是webpack 混淆代码。

#### asar保护源码

#### V8字节码保护源码

Electron底层是基于Chrome和Node.js。核心部件是V8引擎。V8引擎重要职责是将JS编译成字节码，字节码是机器代码的抽象。将字节码编译为机器码更容易。发布electron应用时仅发布V8字节码文件，不发布JS源码给终端用户。

bytenode工具可以用来编译JS代码。

```
let bytenode = require('bytenode');
let compiledFileName = bytenode.compileFile({
    filename: 'D://test.js',
    output: 'D://output.jsc',
    compileAsModule: true
})
```

#### 1.2 保护客户

- 禁用Node.js，创建BrowserWindow或BrowserView时需要配置 webPreferences 参数，禁止node集成。
- 启用同源策略，创建BrowserWindow或BrowserView时,webPreferences的webSecuriy属性应该设置为true；allowRunningInsecureContent的默认值设为false。
- 启用沙箱隔离，webPreferences.sandBox = true。

#### 1.3 保护网络

- 屏蔽虚假证书。

```
let session = win.webContents.session;
session.setCertificateVerifyProc((request, callback) => {
    if(request.certificate.issuer.commonName == '安装证书的名字'){
        callback(-2);  // 驳回证书
    }else{
        callback(-3); // 使用chromium的验证结果
    }
})
```

- 添加防盗链。使用document.referrer来判断请求的来源。
- 请求中添加指定的cookie。根据cookie判断是否为盗链请求。

electron应用中可以通过 onBeforeSendHeaders() 来修改请求头的信息。


#### 1.4 保护数据

使用node.js内置的 crypto 加密和解密模块来保证数据安全性。

#### 1.5 保护用户界面

```
win.setContentProtection(true); // 避免黑客工具操作界面
```

### 2. 提升稳定性

程序崩溃时提供友好的提示：

```
async onAppCrash(){
    let webContent = remote.getCurrentWebContents();
    let result = await remote.dialog.showMessageBox({
        type: 'error',
        title: '应用程序崩溃',
        message: '当前程序发生异常，是否需要重新加载应用程序？',
        buttons: ['是', '否']
    });
    if(result.response == 0){
        webContent.reload();
    }else{
        remote.app.quit();
    }
}
```