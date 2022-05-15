// components/myButton/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {     // 声明属性 
      type: String,
      value: '按钮文本'
    },
    color: {
      type: String,
      value: '#e22'
    },
    round: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    last: new Date().getTime()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapEvent(){  // 单击子组件
      // 判断距离上次点击时间是否小于350毫秒
      let now = new Date().getTime()
      let last = this.data.last
      if(now-last < 350){ // 捕获到了双击场景，满足条件
        // 类似vue  $emit()：意味着主动触发doubletap事件
        this.triggerEvent('doubletap')
        now = 0
      }
      // 重置上一次点击的时间
      this.data.last = now
    }
  }
})
