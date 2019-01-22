## 2019-01-22

### 懒加载的3种实现方式

[原文地址](https://segmentfault.com/a/1190000017795499?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly)

#### 优势

1. 性能收益：浏览器加载图片，decode，渲染都需要耗费资源，懒加载能节约性能消耗，缩短onload事件时间。
2. 节约带宽：这个不需要解释。

通常，我们在 *HTML* 中展示图片，会有两种方式：

1. img 标签
2. css background-image

#### img 懒加载实现

*img 有两种方式实现懒加载：*

1. 事件监听 - scroll、resize、orientationChange

- `orientationchange` 事件是在用户水平或者垂直翻转设备（即方向发生变化）时触发的事件。
- `resize` 事件是在用户改变浏览器窗口的大小来触发事件。
- `scroll` 事件是当该元素滚动时触发。

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>事件监听</title>
    <style media="screen">
      img {
          background: #F1F1FA;
          width: 400px;
          height: 300px;
          display: block;
          margin: 10px auto;
          border: 0;
      }
    </style>
  </head>
  <body>
    <img src="https://ik.imagekit.io/demo/img/image1.jpeg?tr=w-400,h-300" />
    <img src="https://ik.imagekit.io/demo/img/image2.jpeg?tr=w-400,h-300" />
    <img src="https://ik.imagekit.io/demo/img/image3.jpg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image2.jpeg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image3.jpg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image4.jpeg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image5.jpeg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image6.jpeg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image7.jpeg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image8.jpeg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image9.jpeg?tr=w-400,h-300" />
    <img class="lazy" data-src="https://ik.imagekit.io/demo/img/image10.jpeg?tr=w-400,h-300" />
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        var lazyloadImages = document.querySelectorAll("img.lazy");
        var lazyloadThrottleTimeout;

        function lazyload () {
          if(lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
          }

          lazyloadThrottleTimeout = setTimeout(function () {
            // pageXOffset 和 pageYOffset 属性返回文档在窗口左上角水平和垂直方向滚动的像素
            var scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function (img) {
              // innerheight 和 innerwidth	返回窗口的文档显示区的高度和宽度
              // offsetTop 为只读属性，它返回当前元素相对于其 offsetParent 元素的顶部的距离。
              // offsetParent 是一个只读属性，返回一个指向最近的（closest，指包含层级上的最近）包含该元素的定位元素。
              // 如果没有定位的元素，则 offsetParent 为最近的 table, table cell 或根元素（标准模式下为 html；quirks 模式下为 body）。
              if(img.offsetTop < (window.innerHeight + scrollTop)) {
                  // 当图片出现在可是区域：图片相对于顶部距离是否小于窗口可是区域的高度与页面滚动距离的高度
                  // 即：img.offsetTop < (window.innerHeight + scrollTop)
                  // 将 img 的 src 属性的值，设置为原 data-src 属性的值，加载图片
                  img.src = img.dataset.src;
                  // 删除 lazy 类，表明加载完一张图片
                  img.classList.remove('lazy');
                  lazyloadImages = document.querySelectorAll("img.lazy");
              }
            });
            // 如果图片全部加载完毕，则删除 window、document 添加的事件
            if(lazyloadImages.length == 0) {
              document.removeEventListener("scroll", lazyload);
              window.removeEventListener("resize", lazyload);
              window.removeEventListener("orientationChange", lazyload);
            }
          }, 20);
        }

        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
      });
    </script>
  </body>
</html>
```
