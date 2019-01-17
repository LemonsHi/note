## 2019-01-17

### JavaScript引擎概述

Google 的 V8 引擎

<div align=center>

![Aaron Swartz](https://image-static.segmentfault.com/214/767/2147671402-5a070ba2d4ee6_articlex)

</div>

V8 引擎由两个主要部件组成:

- emory Heap（内存堆） — 内存分配地址的地方
- Call Stack（调用堆栈） — 代码执行的地方

<div align=center>

![Aaron Swartz](https://image-static.segmentfault.com/276/457/2764574045-5ad54de7a8988_articlex)

</div>

浏览器提供 API 称为 Web API，比如说 DOM、AJAX、setTimeout 等等。

JavaScript 是一种单线程编程语言，这意味着它只有一个调用堆栈。因此，它一次只能做一件事。

[原文地址](https://segmentfault.com/a/1190000017352941)

### V8 引擎

在 V8 的 5.9 版本出来之前，V8 引擎使用了两个编译器：

- full-codegen：一个简单和非常快的编译器，产生简单和相对较慢的机器码
- Crankshaft：一种更复杂（Just-In-Time）的优化编译器，生成高度优化的代码

V8 引擎也在内部使用多个线程：

- 主线程执行你所期望的操作：获取代码、编译代码并执行它
- 还有一个单独的线程用于编译，因此主线程可以在前者优化代码的同时继续执行
- 一个 Profiler 线程，它会告诉运行时我们花了很多时间，让 Crankshaft 可以优化它们
- 一些线程处理垃圾收集器

当第一次执行 JavaScript 代码时，V8 利用 full-codegen 编译器，直接将解析的 JavaScript 翻译成机器代码而不进行任何转换。这使得它可以非常快速地开始执行机器代码。请注意，V8 [不使用中间字节码，从而不需要解释器](https://zhuanlan.zhihu.com/p/26838993)。

当代码已经运行一段时间后，分析线程已经收集了足够的数据来判断应该优化哪个方法。

接下来，Crankshaft 从另一个线程开始优化。它将 JavaScript 抽象语法树转换为被称为 Hydrogen 的高级静态单分配（SSA）表示，并尝试优化 Hydrogen 图，大多数优化都是在这个级别完成的。

**隐藏类**

如下，代码示例：

```javascript
function Point(x, y) {
  this.x = x
  this.y = y
}
var p1 = new Point(1, 2)
```

<div align=center>

![Aaron Swartz](https://image-static.segmentfault.com/400/635/4006356827-5ae2c8a2f300d_articlex)

</div>

**内联缓存**

无论何时在特定对象上调用方法时，V8 引擎都必须执行对该对象的隐藏类的查找，以确定访问特定属性的偏移量。在同一个隐藏类的两次成功的调用之后，V8 省略了隐藏类的查找，并简单地将该属性的偏移量添加到对象指针本身。对于该方法的所有下一次调用，V8 引擎都假定隐藏的类没有更改，并使用从以前的查找存储的偏移量直接跳转到特定属性的内存地址。这大大提高了执行速度。

**优化的 JavaScript 代码**
