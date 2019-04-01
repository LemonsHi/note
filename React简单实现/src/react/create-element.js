/************************************************************************************************/
/* 参考文章地址：https://github.com/hujiulong/simple-react/blob/chapter-2/src/react/create-element.js */
/************************************************************************************************/

import Component from './component.js'

function createElement (tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children
  }
}

export default createElement;
