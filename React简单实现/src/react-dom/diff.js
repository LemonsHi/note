/***********************************************************************************************/
/* 参考文章地址：https://github.com/hujiulong/simple-react/blob/chapter-3/src/react-dom/diff.js */
/***********************************************************************************************/
import {
  setComponentProps,
  unmountComponent
} from './render'

/**
 * diff 算法入口
 * @param  {HTMLElement} dom       真实 dom
 * @param  {vnode}       vnode     虚拟 dom
 * @param  {HTMLElement} container dom 容器
 * @return {HTMLElement}           更新后的 dom
 */
function diff (dom, vnode, container) {

}

/**
 * diff 算法
 * @param  {HTMLElement} dom   真实 dom
 * @param  {vnode}       vnode 虚拟 dom
 * @return {HTMLElement}       更新后的 dom
 */
function diffNode (dom, vnode) {

  let out = dom;
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = '';
  if (typeof vnode === 'number') vnode = String(vnode);
  // diff 文本节点
  // 例如: "hello, world"
  if (typeof vnode === 'string') {
    // 如果是文本节点 -> 直接替换
    // Node.nodeType 参考类型 https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType
    if (dom && dom.nodeType === 3) {
      // Node.textContent 属性表示一个节点及其后代的文本内容
      if (dom.textContent !== vnode) {
        dom.textContent = vnode
      }
    } else {
      // 如果不是文本节点, 创建文本节点并替换
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(out, dom)
      }
    }
    return out
  }

  // 组件级别的 diff 处理
  if (typeof vnode.tag === 'function') {
    return diffComponent( dom, vnode )
  }

  // 如果真实DOM不存在
  // 表示此节点是新增的, 或者新旧两个节点的类型不一样
  // 那么就新建一个DOM元素, 并将原来的子节点(如果有的话)移动到新建的DOM节点下
  if (!dom || !isSameNodeType(dom, vnode)) {
    out = document.createElement(vnode.tag)
    if (dom) {
      // 将原来 dom 元素的子节点移到新 out 节点下
      [...dom.childNodes].map(out.appendChild)
      if (dom.parentNode) {
        // 替换原来的 dom 对象
        dom.parentNode.replaceChild(out, dom)
      }
    }
  }

  // 判断真实 dom 节点和虚拟 vnode 节点是否存在子节点
  if (vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
    diffChildren(out, vnode.children)
  }
}

/**
 * 组件级别的 diff 算法
 * @param  {[type]} dom       真实 dom 元素
 * @param  {[type]} vchildren 虚拟 vnode 元素子节点
 * @return {[type]}       [description]
 */
function diffComponent(dom, vnode) {

    // 真实 dom 元素上的 组价对象
    let c = dom && dom._component
    // 老真实 dom 元素
    let oldDom = dom

    // 如果组件类型没有变化，则重新 set props
    if (c && c.constructor === vnode.tag) {
        setComponentProps(c, vnode.attrs)
        dom = c.base;
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    } else {
      if (c) {
        // 卸载组件，触发组件 componentWillUnmount 事件
        unmountComponent(c)
        oldDom = null
      }
        c = createComponent( vnode.tag, vnode.attrs );

        setComponentProps( c, vnode.attrs );
        dom = c.base;

        if ( oldDom && dom !== oldDom ) {
            oldDom._component = null;
            removeNode( oldDom );
        }

    }

    return dom;

}

/**
 * 子节点级别的 diff 算法
 * @param  {[type]} dom       真实 dom 元素
 * @param  {[type]} vchildren 虚拟 vnode 元素子节点
 * @return {[type]}           [description]
 */
function diffChildren (dom, vchildren) {
  // 获取真实 dom 元素子节点
  const domChildren = dom.childNodes
  const children = []

  const keyed = {}

  if (domChildren.length > 0) {
    for (var i = 0; i < domChildren.length; i++) {
      const child = domChildren[i]
      const key = child.key
      if (key) {
        keyed[key] = child
      } else {
        children.push(child)
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    let min = 0
    let childrenLen = children.length

    for (var i = 0; i < vchildren.length; i++) {
      const vchild = vchildren[i]
      const key = vchild.key
      let child

      if (key) {
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if (min < childrenLen) {
        for (var j = min; j < childrenLen; j++) {
          // 没有 key 的子节点
          let c = children[j]
          // 找到相同的节点
          if (c && isSameNodeType(c, vchild)) {
            child = c
            children[j] = undefined
            if (j === childrenLen - 1) childrenLen--
            if (j === min) min++
            break
          }
        }
      }
      // 递归进行 diff 对比
      child = diff(child, vchild)
      const f = domChildren[i]
      if (child && child !== dom && child !== f) {
        if (!f) {
          // 如果更新前的对应位置为空，说明此节点是新增的
          dom.appendChild(child)
        } else if (child === f.nextSibling) {
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
          removeNode(f)
        } else {
          // 将更新后的节点移动到正确的位置
          dom.insertBefore(child, f)
        }
      }
    }
  }
}

/**
 * 对比属性
 * @param  {HTMLElement} dom   真实 dom
 * @param  {vnode}       vnode 虚拟 dom
 * @return {[type]}
 */
function diffAttributes (dom, vnode) {
  // 当前 dom 的属性
  const old = {}
  // 虚拟 dom 的属性
  const attrs = vnode.attrs

  // 将原 dom 上属性添加到 old 上
  for (let i = 0 ; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i]
    old[attr.name] = attr.value
  }
  // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
  for (let name in old) {
    if (!(name in attrs)) {
      setAttribute(dom, name, undefined)
    }
  }
  // 更新新的属性值
  for (let name in attrs) {
    if (old[name] !== attrs[name]) {
      setAttribute(dom, name, attrs[name])
    }
  }
}

/**
 * 判断是否是相同节点
 * @param  {HTMLElement} dom   真实 dom
 * @param  {vnode}       vnode 虚拟 dom
 * @return {Boolean}           是否是相同的节点
 */
function isSameNodeType (dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3
  }
  if (typeof vnode.tag === 'string') {
    return dom.nodeName.toLowerCase() === vnode.tag.toLowerCase()
  }
  return dom && dom._component && dom._component.constructor === vnode.tag
}
