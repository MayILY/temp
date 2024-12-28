// pages/order/list/list.js
 //此处需要补充代码
Page({
   //此处需要补充代码,
  // 定义请求方法，封装请求的公共部分
  loadData: function (options) {
    wx.showNavigationBarLoading()
    fetch('/food/orderlist', {
      last_id: options.last_id,
      row: this.row
    }).then(data => {
      this.last_id = data.last_id
      this.setData({
        is_last: data.list.length < this.row
      }, () => {
        wx.hideNavigationBarLoading()
        options.success(data)
      })
    }, () => {
      wx.hideNavigationBarLoading()
      options.fail()
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中'
    })
    this.loadData({
      last_id: 0,
      success: data => {
        this.setData({
          order: data.list
        }, () => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
        })
      },
      fail: () => {
        this.onLoad()
      }
    })
  },
  // 上拉触底
  onReachBottom: function () {
    if (this.data.is_last) {
      return
    }
    this.loadData({
      last_id: this.last_id,
      success: data => {
        var order = this.data.order
        data.list.forEach(item => {
          order.push(item)
        })
        this.setData({
          order: order
        })
      },
      fail: () => {
        this.onReachBottom()
      }
    })
  },
   //此处需要补充代码
})