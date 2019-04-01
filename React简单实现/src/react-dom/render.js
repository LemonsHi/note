/*************************************************************************************************/
/* 参考文章地址：https://github.com/hujiulong/simple-react/blob/chapter-2/src/react-dom/render.js */
/************************************************************************************************/

import Component from '../react/component'
import { setAttribute } from './dom'

/**
 * 创建组件
 * component: 组件(类组件、函数组件)
 * props: 属性值(vnode.attrs)
 */
function createComponent (component, props) {
  let inst
  // 类组件
  if (component.prototype && component.prototype.render) {
    // 实例化类组件
    inst = new component(props)
  } else {
    // 函数组件: 将函数组件 -> 类组件
    inst = new Component(props)
    inst.constructor = component
    // 执行函数: <Welcome name="..." />
    // function Welcome (props) {
    //   return <h1>...</h1>
    // }
    inst.render = function () {
      return this.constructor(props)
    }
  }
  return inst
}

/**
 * 设置组件 props
 * component: 类组件
 * props: 属性值(vnode.attrs)
 */
function setComponentProps (component, props) {
  // 通过 component.base 来观察, 该组件是否是首次创建
  // 1. 首次创建, 执行 React 生命周期中的 componentWillMount 方法
  // 2. 非首次创建(父组件重新 render() props 改变), 执行 componentWillReceiveProps 方法
  if (!component.base) {
    if (component.componentWillMount ) component.componentWillMount()
  } else {
    if (component.componentWillReceiveProps) component.componentWillReceiveProps(props)
  }
  component.props = props
  renderComponent(component)
}

export function renderComponent (component) {
  // render 后的对象, 可以用来判断组件是否已经 render
  let base
  const renderer = component.render()

  // 判断是否为更新操作, 执行 componentWillUpdate 生命周期
  // 相比于 React 少了 shouldComponentUpdate 过程
  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate()
  }

  // 执行 render
  base = _render(renderer)

  // 判断是否为更新操作, 执行 componentDidUpdate 生命周期
  if (component.base && component.componentDidUpdate ) {
    component.componentDidUpdate ()
  }
  // 执行 componentDidMount 生命周期
  if (component.componentDidMount) component.componentDidMount()

  // 用当前的节点替换父节点的一个子节点, 并返回被替换掉的节点
  if (component.base && component.base.parentNode) {
    component.base.parentNode.replaceChild(base, component.base)
  }

  component.base = base
  base._component = component
}

function _render ( vnode ) {

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''
  // 如果 vnode 为数值, 将其转换成字符串
  if (typeof vnode === 'number') vnode = String(vnode)
  // 如果 vnode 为文本, 将其转换成字符串
  if (typeof vnode === 'string') {
    let textNode = document.createTextNode(vnode)
    return textNode
  }
  // 如果 vnode 为组件
  if (typeof vnode.tag === 'function') {
    // 创建组件
    const component = createComponent(vnode.tag, vnode.attrs)
    // 设置 porps 值, 执行生命周期函数
    setComponentProps(component, vnode.attrs)
    return component.base
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
  if (vnode.children) {
    vnode.children.forEach(child => render(child, dom))
  }

  return dom
}

export function render (vnode, container) {
  return container.appendChild(_render(vnode))
}
