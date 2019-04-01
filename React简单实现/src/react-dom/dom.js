/**********************************************************************************************/
/* 参考文章地址：https://github.com/hujiulong/simple-react/blob/chapter-2/src/react-dom/dom.js */
/**********************************************************************************************/

/**
 * 将虚拟 DOM 中的属性，转换成真实 DOM 的属性
 * dom: 真实 DOM
 * name: 属性名称
 * value: 属性值
 */
export function setAttribute (dom, name, value) {
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
