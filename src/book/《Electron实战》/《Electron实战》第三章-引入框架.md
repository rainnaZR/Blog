
### 引入webpack

- yarn add webpack --dev
- yarn add electron-webpack --dev
- package.json中的start命令修改下：

```
"scripts": {
    "start": "electron-webpack dev",
    "build": "electron-webpack build"
}
```
- 项目目录调整，具体见项目src目录结构。

#### package.json中配置如下内容，自定义渲染进程html模板页面：

```
"electronWebpack": {
    "renderer": {
      "template": "src/renderer/index.html"
    }
}
```

webpack打包时，会把渲染进程renderer/index.js的入口文件放到自定义模板页面里。

### 引入vue

- yarn global add @vue/cli
- vue create vue-electron-project
- cd vue-electron-project
- vue add electron-builder
- yarn electron:serve

#### src/background.js是主进程入口程序；src/main.js是渲染进程入口程序。


### 扩展阅读

- webpack的热更新原理是利用websocket技术和hash缓存。
- Node.js环境提供__dirname（所在目录的绝对路径）, __filename（当前文件的绝对路径）, global（全局环境）, process（当前进程）, console等变量。
- electron-webpack 和 webpack 包依赖的版本要保持一致，否则可能打包不了。
- es6模块打包机制，export default和export的区别。
