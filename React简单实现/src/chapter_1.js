/***********************************************************/
/* 参考文章地址：https://github.com/hujiulong/blog/issues/4 */
/***********************************************************/

const React = {
  createElement
}

const ReactDOM = {
  render: (vnode, content) => {
    content.innerHTML = ''
    return render(vnode, content)
  }
}

// 返回虚拟 DOM
function createElement (tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

/**
 * render 将虚拟 DOM 渲染成真实 DOM
 * vnode: createElement 返回的对象
 * contant: 挂载的目标 DOM
 */
function render (vnode, contant) {
  // 文本对象
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode)
    return contant.appendChild(textNode)
  }
  const dom = document.createElement(vnode.tag)
  // 设置元素属性
  if (vnode.attrs) {
    Object.keys(vnode.attrs).forEach(key => {
      const value = vnode.attrs[key]
      setAttribute(dom, key, value)
    })
  }
  // 递归生成子元素
  vnode.children.forEach(child => {
    render(child, dom)
  })
  return contant.appendChild(dom)
}

/**
 * 将虚拟 DOM 中的属性，转换成真实 DOM 的属性
 * dom: 真实 DOM
 * name: 属性名称
 * value: 属性值
 */
function setAttribute (dom, name, value) {
  // 将 className 转换成 class
  if (name === 'className') name = 'class'

  // 对 onXXX 属性进行设置
  if (/on\w+/.test(name)) {
    name = name.toLocaleLowerCase()
    dom[name] = value || ''
  } else if (name === 'style') {
    // 对 style 属性进行设置
    if (!value || typeof value === 'string') {
      // 设置形式如 style = 'height: 20px' 的样式
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      // 设置如 style = { height: 40px } 或 style = { height: 40 } 形式的样式
      for (var name in value) {
        if (value.hasOwnProperty(name)) {
          dom.style[name] =
          typeof value[name] === 'number' ? `${value[name]}px` : `${value[name]}`
        }
      }
    }
  } else {
    // 普通属性进行设置
    if (name in dom) {
      dom[name] = vale || ''
    }
    if (value) {
      dom.setAttribute(name, value);
    } else {
      dom.removeAttribute(name);
    }
  }
}

function tick() {
    const element = (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {new Date().toLocaleTimeString()}.</h2>
      </div>
    );
    ReactDOM.render(
      element,
      document.getElementById('root')
    );
}

setInterval(tick, 1000);
