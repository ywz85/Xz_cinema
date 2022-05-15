// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {  // 用户保存当前用户数据
      nickName: '点击登录',
    },   
    isLogin: false  // 用户是否已登录
  },

  /** 点击头像图片，选择图片上传头像 */
  tapImage(){
    if(!this.data.isLogin) return;
    // 选择图片
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      camera: "front",
      success: (res)=>{
        console.log('选择图片', res)
        let path = res.tempFiles[0].tempFilePath
        let userInfo = this.data.userInfo
        userInfo.avatarUrl = path
        this.setData({userInfo})
        // 将选中的图片上传至云存储空间
        this.uploadFile(path)
      }
    })
  },

  /**
   * 将文件上传至云存储空间
   * @param {String} path 本地文件路径  /tmp/xxx/xx/abc.jpg
   */
  uploadFile(path){
    // 通过path，构造一个随机的不重复的相同后缀名的文件名
    let ext = path.substring(path.lastIndexOf('.'))
    let name = 'avatar_'+Math.random()+
                  '-'+(new Date().getTime())
    let cloudPath = name+ext  // 云存储路径：随机文件名+后缀
    wx.cloud.uploadFile({
      filePath: path,
      cloudPath: cloudPath,
      success: (res)=>{
        console.log('上传文件', res)
        let fileID = res.fileID  // 返回的访问图片公网链接
        // 将fileID与当前用户绑定在一起（更新数据库avatarUrl字段）
        this.updateUserInfo(fileID)
      }
    })
  },

  /**
   * 修改users集合中当前用户的avatarUrl字段为fileID
   * @param {String} fileID 
   */
  updateUserInfo(fileID){
    let _id = this.data.userInfo._id
    // 通过id，修改用户头像路径
    let db = wx.cloud.database()
    db.collection('users').doc(_id).update({
      data: {
        avatarUrl: fileID
      },
      success: (res)=>{
        console.log('修改数据库头像路径', res)
        wx.showToast({
          title: '头像修改成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  /** 点击登录 */
  tapLogin(){
    if(this.data.isLogin) return;
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '速度点击允许！否则手机爆炸！',
      success: (res)=>{
        console.log('获取用户登录信息:', res)
        this.setData({
          userInfo: res.userInfo,
          isLogin: true
        })
        // 维护自己家数据库
        this.login()
      }
    })
  },

  /** 执行自定义的登录业务
   *  查询云数据库users集合，看有没有以前注册的信息：
   *  1. 如果有：则直接获取，重新更新界面
   *  2. 如果没有：则执行注册业务
   */
  login(){
    let db = wx.cloud.database()
    // 因为users集合的权限为仅创建者可读写，所以读不到其他人的信息
    db.collection('users').get().then(res=>{
      console.log('查询用户数据', res)
      if(res.data.length==0){ // 用户第一次来，执行注册
        this.regist()
      }else{  // 用户以前注册过，重新获取最新用户数据，更新界面
        let userInfo = res.data[0]
        this.setData({userInfo})
      }
    })
  },

  /** 执行注册业务 */
  regist(){
    let db = wx.cloud.database()
    db.collection('users').add({
      data: this.data.userInfo
    }).then(res=>{
      console.log('注册用户', res)
      // 注册成功，将_id存入userInfo
      let userInfo = this.data.userInfo
      userInfo._id = res._id
      this.setData({userInfo})
    })
  },

  doubletapEvent(){
    console.log('被双击了...666')
  },

  /** 点击立即签到，执行该方法 */
  tapCert(){
    // 调用sum的云函数
    wx.cloud.callFunction({
      name: 'quickstartFunctions',            // 指定云函数名称 
      data: {type:'getOpenId'},  // 传递的参数
      success: (res)=>{
        console.log('调用云函数getOpenId', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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