// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieInfo: {},    // 表示电影详情信息
    isOpen:false,     // 表示简介是否是展开状态
    comments: [],     // 表示评论列表   
  },

  /** 点击剧照图片  大图浏览图片列表 */
  tapImage(event){
    let i = event.target.dataset.i  // 通过事件源对象获取参数 data-i
    if(i==undefined) return;
    
    let urls = []
    this.data.movieInfo.thumb.forEach(url=>{
      urls.push(
        url.substring(0, url.lastIndexOf('@')))  
    })
    wx.previewImage({ urls, current: urls[i] })
  },

  /** 点击简介，切换展开与收起状态 */
  tapIntro(){
    this.setData({isOpen : !this.data.isOpen})
  },

  /** 加载电影评论 */
  loadComments(id){
    let db = wx.cloud.database()
    db.collection('comments').where({
      movieid: id
    }).skip(0).limit(3).get({ 
      success: (res)=>{
        console.log('加载评论列表：', res)
        // 将res.data 存入 data.comments
        this.setData({comments: res.data})
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id   // 接收上一个页面传过来的参数
    console.log('接收到参数电影ID：', id)
    // 加载电影详情数据
    wx.request({
      url: 'https://api.tedu.cn/detail.php',
      method: 'GET',
      data: {id},
      success: (res)=>{
        console.log('加载到电影详情:', res)
        this.setData({movieInfo: res.data})
      }
    })
    // 加载电影评论数据
    this.loadComments(id)
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