/************************************************************************************************/
/* 参考文章地址：https://github.com/hujiulong/simple-react/blob/chapter-2/src/react/component.js */
/************************************************************************************************/

import { renderComponent } from '../react-dom/render'

class Component {
  constructor (props = {}) {
    this.isReactComponent = true

    this.state = {}
    this.props = props
  }

  setState (stateChange) {
    // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
    // Object.assign() 将返回目标对象。
    Object.assign(this.state, stateChange)
    // renderComponent 方法重新渲染组件
    renderComponent(this)
  }
}

export default Component
