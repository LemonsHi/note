import {renderComponent} from '../react-dom/render'

// 设置状态 state 的队列
const setStateQueue = []
// 需要渲染的组件
const renderQueue = []

// 延迟执行
function defer (fn) {
  return Promise.resolve().then(fn)
}

export function enqueueSetState (stateChange, component) {
  // 设置状态 state 队列，如果为空将 flush 方法添加到异步队列中
  if (setStateQueue.length === 0) {
    defer(flush)
  }

  // 添加设置状态 state 队列
  setStateQueue.push({
    stateChange,
    component
  })

  // 如果当前组件与需渲染组件队列中存在不相同的组件，便添加进队列中
  if (!renderQueue.some(item => item === component)) {
    renderQueue.push(component)
  }
}

function flush () {
  let item, component

  while (item = setStateQueue.shift()) {
    const { stateChange, component } = item

    // 如果 compoennt 组件没有 prevState 属性，便添加 prevState 属性
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state)
    }

    // 如果 stateChange 是一个方法, setState 的第二种传参方式
    if (typeof stateChange === 'function') {
      Object.assign(component.state, stateChange(component.prevState, component.props))
    } else {
      Object.assign(component.state, stateChange)
    }

    component.prevState = component.state
  }

  // 渲染组件
  while (component = renderQueue.shift()) {
    renderComponent(component)
  }
}
