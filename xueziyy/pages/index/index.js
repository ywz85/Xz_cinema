// index.js
Page({

  data:{
    cityname: '未选择',   // 绑定左上角城市名称
    navActive: 1,         // 绑定当前顶部导航激活项的ID
    movies: [],           // 绑定当前电影列表
  },

  /**
   * 通过cid与offset查询电影列表
   * @param {number} cid 类别ID参数
   * @param {number} offset 开始查询的起始位置参数
   * @return 返回20条记录
   */
  loadMovies(cid, offset){
    return new Promise((resolve, reject)=>{
      // 弹窗
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      wx.request({
        url: 'https://api.tedu.cn/index.php',
        method: 'GET',
        data: {cid, offset},
        success: (res)=>{
          resolve(res.data)   // 将movieList返回给Promise的接收者
        },
        fail: (err)=>{ reject(err) },
        complete: ()=>{ wx.hideLoading() }
      })  
    })
  },

  /** 当点击顶部导航项时执行 */
  tapNav(event){
    let id = event.target.dataset.id 
    this.setData({navActive: id})
    // 先去缓存中找找 有没有缓存当前类别的首页电影数据
    wx.getStorage({
      key: id,
      success: (res)=>{
        console.log('从缓存中读取到:', res)
        this.setData({movies: res.data})
      },
      fail: (err)=>{
        console.log('没有从缓存中找到数据')
        // 发送请求，访问相应ID的电影列表数据
        this.loadMovies(id, 0).then(movieList=>{
          this.setData({movies: movieList})
          // 将结果存入小程序缓存 {id: [....]}
          wx.setStorage({
            key: id,
            data: movieList
          })
        })
      }
    })
  },

  /** 加载当前经纬度坐标位置 */
  getLocation(){
    // 逆地理编码返回当前坐标的字符串详细描述
    getApp().globalData.qqmapsdk.reverseGeocoder({ 
      success: (res)=>{
        console.log('逆地理编码结果：', res)
        let cityname = res.result.address_component.city
        this.setData({cityname})
        // 将 cityname 存入 globalData
        getApp().globalData.cityname = cityname
      },
      fail: (err) =>{
        console.warn(err)
      }
    })
  },

  /** 当首页加载时执行 */
  onLoad(){
    //加载当前经纬度位置
    this.getLocation()

    // 加载热映类别下的电影列表
    this.loadMovies(1, 0).then(movieList=>{
      this.setData({movies: movieList})
    })
  },

  onShow(){
    let cityname = getApp().globalData.cityname
    this.setData({cityname})
  },

  /** 监听触底事件 */
  onReachBottom(){
    let cid = this.data.navActive  // 当前类别ID
    let offset = this.data.movies.length // 下一页的起始位置
    console.log('滚到底了！')
    // 发请求，获取后续20条数据，追加到列表末尾
    this.loadMovies(cid, offset).then(movieList=>{
      this.setData({
        movies: this.data.movies.concat(movieList)
      })
      // this.data.movies.push(...movieList)
      // this.setData({movies: this.data.movies})
    })
  },

  /** 当下拉刷新时触发 */
  onPullDownRefresh(){
    // 加载当前类别下的首页电影数据，更新列表，更新缓存
    let cid = this.data.navActive
    this.loadMovies(cid, 0).then(movieList=>{
      console.log('下拉刷新数据', movieList)
      // 更新列表
      this.setData({movies: movieList})
      // 更新缓存
      wx.setStorage({key:cid+"", data:movieList})
      // 停止下拉刷新
      wx.stopPullDownRefresh()
    })
  }
})





