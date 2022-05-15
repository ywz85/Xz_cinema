// pages/theatre/theatre.js
Page({

  /** 页面的初始数据 */
  data: {
    cityname: '未选择', // 表示当前城市名称
    theatreList: [],    // 表示当前影院列表
  },

  /** 点击影院列表项 */
  tapTheatreItem(event){
    let i = event.currentTarget.dataset.i
    // 获取当前选中的影院对象
    let t = this.data.theatreList[i]
    console.log(`lat:${t.location.lat} lng:${t.location.lng}`)
    // 以地图的方式显示该位置信息
    wx.openLocation({
      name: t.title,
      address: t.address,
      latitude: t.location.lat,
      longitude: t.location.lng,
      scale: 15
    })
  },
  
  /** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
  },

  onShow(){
    let cityname = getApp().globalData.cityname
    this.setData({cityname})
    // 搜索当前位置周边的电影院列表
    getApp().globalData.qqmapsdk.search({
      keyword : '电影院',
      region: cityname,
      page_size: 20,
      success: (res)=>{
        console.log('加载到的电影院列表', res)
        // 处理数组中对象的属性
        res.data.forEach(item=>{
          item._distance_kmstr = 
            (item._distance/1000).toFixed(2)
        })
        this.setData({theatreList: res.data})
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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