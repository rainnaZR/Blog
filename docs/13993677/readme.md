这个demo参考：https://github.com/unixzii/CyandevToys
文章介绍参考：http://www.jianshu.com/p/f5c0f9c4bc39

这是用canvas写的一个动画效果。页面上实现动画效果有多种方式，比如简单的动画用CSS3来实现，或者JS操作。复杂的则可以用canvas来做。
这个效果可用于页面中较少文字的大背景，具有比较强的视觉冲击力，而且有一定的趣味性。看到网上的这个例子后，就想自己也研究下源代码，也写个类似的效果。

#### 摘抄下原文：
这个效果就是个粒子系统，粒子间是用线条连接的，离得近的粒子线条颜色深，离的远的线条颜色浅。

### 实现步骤：
#### 1. 构建节点
用nodes数组存储构建粒子节点需要的数据。（数据包括坐标，偏移量，半径）其中第一个粒子为鼠标跟随的粒子节点。
用edges数组存储粒子节点之间线条的相关数据。（数据包括起始的粒子节点）

#### 2. 开始动画
遍历nodes数组，计算出每个粒子节点新的移动位置。如果新位置是在画布边缘外，则重新调整偏移方向。计算出新的位置后，执行步骤3，绘制新的线条以及新的粒子节点。
利用window.requestAnimationFrame方法重复执行此方法。

#### 3. 绘制
遍历edges数组，绘制线条。遍历nodes数组，绘制粒子。








