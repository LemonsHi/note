## 2019-01-15

### 对 \_\_proto__ 的理解

当访问一个对象的某个属性的时候，如果这个对象自身不存在这个属性，那么就从这个对象的 **\_\_proto__** 属性上面 继续查找这个属性，如果 **\_\_proto__** 属性上面还存在 **\_\_proto__** 属性的话，那么就会继续在下一个 **\_\_proto__** 属性上面查找响应的属性，直到查找到这个属性，或者没有 **\_\_proto__** 属性为止。

当定义 `obj.a` 为 `1` 时，求 `obj.a` 过程如下

<div align=center>

![Aaron Swartz](https://raw.githubusercontent.com/dreamapplehappy/blog/master/2018/12/30/images/1.png)

</div>

当未定义 `obj.a` 时，求 `obj.a` 过程如下

<div align=center>

![Aaron Swartz](https://raw.githubusercontent.com/dreamapplehappy/blog/master/2018/12/30/images/2.png)

</div>

 **\_\_proto__** 所指的对象为 **原型**，同时修改原型的属性和方法，实现简单的继承。

 而 **原型链** ，**便是一个个 原型链接起来，直到最后的 `null` 为止，即为原型链**。

 **注意**：使用 **\_\_proto__** 属性来修改对象的原型是 **非常慢且影响性能的一种操作**。因此，推荐使用 `Object.getPrototypeOf` 或 `Reflect.getPrototypeOf`获取对象的原型，设置对象的原型推荐使用 `Object.setPrototypeOf` 或 `Reflect.setPrototypeOf`。

 ### 对 prototype 的理解

在函数层面上存在的是 **prototype** 这个属性。

这个 **prototype** 属性的作用就是：函数通过使用 `new` 操作符生成的一个对象，这个对象的原型（也就是 `__proto__`）指向该函数的 **prototype** 属性。

```javascript
var F = function () {}
f = new F()
```

实际 `new` 的过程解读，如下：

```javascript
var f = {}
f.__proto__ = F.prototype
F.call(f)
```
