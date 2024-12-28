// index.js
const app = getApp()
const fetch = require('../../utils/fetch')

Page({
  data: {
    swiper: [],
    ad: '',
    category: []
  },
  onLoad: function (options) {
    var callback = () => {
      wx.showLoading({
        title: '努力加载中',
        mask: true
      })
      fetch('/food/index')
        .then(data => {
          wx.hideLoading()
          this.setData({
            swiper: data.swiper,
            ad: data.ad,
            category: data.category
          })
        })
        .catch(() => {
          callback()
        })
    }
    if (app.userInfoReady) {
      callback()
    } else {
      app.userInfoReadyCallback = callback
    }
  },
  start: function () {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})
