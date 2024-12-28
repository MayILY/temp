// pages/order/list/list.js
const fetch = require('../../../utils/fetch')

Page({
  data: {
    order: [],
    is_last: false
  },
  row: 10,
  last_id: 0,
  onLoad: function () {
    this.onPullDownRefresh()
  },
  loadData: function (options) {
    wx.showNavigationBarLoading()
    fetch('/food/orderlist', {
      last_id: options.last_id,
      row: this.row
    })
      .then(data => {
        this.last_id = data.last_id
        this.setData({
          is_last: data.list.length < this.row
        }, () => {
          wx.hideNavigationBarLoading()
          options.success(data)
        })
      })
      .catch(() => {
        wx.hideNavigationBarLoading()
        options.fail()
      })
  },
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
  onReachBottom: function () {
    if (this.data.is_last) {
      return
    }
    this.loadData({
      last_id: this.last_id,
      success: data => {
        var order = this.data.order
        order = order.concat(data.list)
        this.setData({
          order: order
        })
      },
      fail: () => {
        this.onReachBottom()
      }
    })
  },
  detail: function (e) {
    wx.navigateTo({
      url: '/pages/order/detail/detail?order_id=' + e.currentTarget.dataset.id
    })
  }
})
