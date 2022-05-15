// pages/citylist/citylist.js
const map = require('../../libs/map')
Page({

  /** 页面的初始数据 */
  data: {
    map : map,   // 用于保存城市列表数据
    letter : 'A',  // 用于保存当前选中的字母
    cityname: '未选择', // 用于保存当前城市名称
    locSuccess: false,  // 用于表示是否定位成功
  },

  /** 点击定位城市 */
  tapLocCity(){
    if(this.data.locSuccess){ // 若定位成功则返回城市
      getApp().globalData.cityname = this.data.cityname
      wx.navigateBack()
    }else{
      this.getLocation()  // 若定位失败则重新定位
    }
  },

  /** 点击字母 */
  tapLetter(event){
    let l = event.target.dataset.l
    this.setData({letter: l})
  },

  /** 当点击城市名时触发 */
  tapCity(event){
    let city = event.target.dataset.c
    if(city == undefined) return;
    // 存入globalData，返回上一页
    getApp().globalData.cityname = city
    wx.navigateBack()
  },

  /** 加载当前经纬度坐标位置 */
  getLocation(){
    // 逆地理编码返回当前坐标的字符串详细描述
    getApp().globalData.qqmapsdk.reverseGeocoder({ 
      success: (res)=>{
        console.log('逆地理编码结果：', res)
        let cityname = res.result.address_component.city
        this.setData({cityname, locSuccess:true})
      },
      fail: (err) =>{
        console.warn(err)
        this.setData({
          cityname: '定位失败，点击重试',
          locSuccess: false
        })
        // 判断，若是没有权限，可以引导用户进入设置，重新授权
        if(err.status==1000){
          // 弹出授权窗口，引导重新授权
          this.showAuthDialog()
        }
      }
    })
  },

  /** 弹出授权窗口 */
  showAuthDialog(){
    wx.showModal({
      title: '提示',
      content: '后悔了吧？重新给我权限吧？',
      cancelText: '就是不给',
      confirmText: '重新授权',
      success: (res)=>{
        console.log('弹窗选择结果', res)
        if(res.confirm){
          // 跳转到设置页面，让用户重新授权
          // openSetting将会返回用户的重新授权结果
          // 若结果表明用户确实已经重新赋予定位权限，就可以立即自动更新城市名称
          wx.openSetting({
            success: (authRes)=>{
              console.log('授权结果', authRes)
              if(authRes.authSetting["scope.userLocation"]){
                this.getLocation() // 重新定位
              }
            }
          })
        }
      }
    })
  },


  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.getLocation()
    console.log(map)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})