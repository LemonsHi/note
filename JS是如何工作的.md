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
