// app.js
App({
  /** 小程序启动时执行的生命周期 */
  onLaunch(){
    // 初始化qqmapsdk
    let QQMapWX = require('./libs/qqmap-wx-jssdk')
    let qqmapsdk = new QQMapWX({ 
      key: "A7CBZ-FZ73U-PUPV7-BINEG-ICD57-KAB6J"
    })
    this.globalData.qqmapsdk = qqmapsdk
    
    // 初始化云环境, 指定默认云环境
    wx.cloud.init({ 
      env: 'cloud-2102-6g5ztvkz5507bbea' 
    })


  },

  /** 全局共享的数据存储区 */
  globalData: {
    qqmapsdk : null,
    cityname: '未选择',  // 用于描述当前城市名称
  }
})
