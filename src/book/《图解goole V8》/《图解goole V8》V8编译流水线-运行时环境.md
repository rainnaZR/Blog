在执行JS之前，V8就准备好了代码的运行时环境，这个环境包括了堆空间和栈空间，全局执行上下文，全局作用域，内置的构建函数，宿主环境提供的扩展函数和对象，消息循环系统等。准备好运行时环境后，V8才开始执行JS代码：解析源码，生成字节码，解释执行和编译执行等操作。

![](https://user-gold-cdn.xitu.io/2020/7/27/17390f6699a54353?w=2284&h=588&f=png&s=291515)

### 1. 宿主环境

浏览器和Node.js都是V8的宿主环境，浏览器为V8提供基础的消息循环系统，全局变量，Web API。V8的核心是实现ECMAScript标准，提供ECMAScript定义的对象和核心函数，比如Object, function等，V8还提供垃圾回收器，协程等基础内容。V8使用不当会占用主线程资源，导致浏览器卡死。

![](https://user-gold-cdn.xitu.io/2020/7/27/17390fcba05e1bcf?w=2284&h=1285&f=png&s=531452)

### 2. 构造数据存储空间：堆空间和栈空间

V8在启动过程中，同时创建堆空间和栈空间，产生的数据都会放在这两个空间中。

栈空间用来存储原生数据，还用来管理JS的函数调用，栈结构是先进后出。函数执行结束，函数的执行上下文便会被销毁。栈空间的查找效率非常高，内存中很难找到比较大的连续空间，所以V8对栈空间的大小做了限制，如果函数调用过深，V8就有可能抛出栈溢出的错误。

如果是内存较大的数据，或是离散数据，可以使用堆空间存储。堆空间可以用来存储对象类型的离散数据。JS中除了基础数据外，其他的数据比如函数，对象，数组都存在堆空间中。

### 3. 全局执行上下文和全局作用域

V8初始化完基础的内存空间后，接下来初始化全局执行上下文和全局作用域。V8会用执行上下文来维护执行当前代码所需的变量声明，this指向等。

执行上下文中包括：变量环境，词法环境，this关键字。
- 变量环境：比如全局函数，全局window对象等。
- 词法环境：let, const定义的变量内容。
- this关键字：全局this的指向。

全局执行上下文在V8的生存周期内是不会被销毁的，会一直缓存在堆中。全局作用域是静态的，执行上下文是动态的。

### 4. 构造事件循环系统

有了堆空间和栈空间，生成了全局作用域和全局执行上下文，接下来就是V8利用事件循环系统执行任务。V8使用宿主环境提供的主线程，循环调用监听下个事件。模拟代码如下：

```
while(1){
    Task task = GetNewTask();
    RunTask(task);
}
```

如果V8正在处理DOM操作，此时有其他操作进来，这种情况下会引入消息队列，让待处理的事件暂存到消息队列中，等当前操作完成后，再从消息队列中取出排队的任务执行。事件循环系统会重复这个过程，直到消息队列中的任务清空。因为V8和浏览器公用主线程和消息队列，所以避免V8执行一个函数过久。

### 5. 总结

V8执行JS时，有部分环境是由浏览器或node.js等宿主环境提供的，包括堆空间和栈空间，全局执行上下文，全局作用域，事件循环系统。V8自己也提供JS的核心功能和垃圾回收系统。

宿主环境启动过程中，栈空间存储原生数据，堆空间存储对象数据。栈空间使用要避免栈溢出。

比如浏览器的window,node的global等全局对象都会在V8启动过程中准备好，存放到全局执行上下文中。全局执行上下文会一直存在，函数执行上下文会在函数执行结束后销毁。所以尽量不要将变量和数据放到全局对象中，避免占用过多内存。

宿主环境还提供事件循环系统来处理任务的排序和任务调度。

### 6. 写在后面

V8相关的学习总结来自于极客时间李兵老师的课程《图解goole V8》，如果想了解更多细节，可以进课程查看。