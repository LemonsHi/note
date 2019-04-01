/**************************************************************************************/
/* 参考文章地址：https://github.com/hujiulong/simple-react/blob/chapter-2/src/index.js */
/**************************************************************************************/

import React from './react'
import ReactDOM from './react-dom'

class Counter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      num: 1
    }
  }

  componentWillUpdate() {
    console.log('update');
  }

  componentWillMount() {
    console.log('mount');
  }

  onClick () {
    this.setState({ num: this.state.num + 1 });
  }

  render () {
    return (
      <div>
        <h1>count: { this.state.num }</h1>
        <button onClick={ () => this.onClick()}>add</button>
      </div>
    );
  }
}

ReactDOM.render(
  <Counter />,
  document.getElementById('root')
);
