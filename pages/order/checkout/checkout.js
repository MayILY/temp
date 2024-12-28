// checkout.js
const fetch = require('../../../utils/fetch')

Page({
  data: {
    order_food: [],
    price: 0,
    promotion: 0,
    sn: '',
    create_time: '',
    pay_time: ''
  },
  comment: '',
  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/order', {
      id: options.order_id
    })
      .then(data => {
        wx.hideLoading()
        this.setData({
          order_food: data.order_food,
          price: data.price,
          promotion: data.promotion,
          sn: data.sn,
          create_time: data.create_time,
          pay_time: data.pay_time
        })
      })
      .catch(() => {
        this.onLoad(options)
      })
  },
  inputComment: function (e) {
    this.comment = e.detail.value
  },
  pay: function () {
    wx.showLoading({
      title: '支付中',
      mask: true
    })
    fetch('/food/pay', {
      id: this.data.sn,
      comment: this.comment
    })
      .then(data => {
        wx.hideLoading()
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            wx.navigateTo({
              url: '/pages/order/detail/detail?order_id=' + data.id
            })
          }
        })
      })
      .catch(() => {
        wx.hideLoading()
        wx.showModal({
          title: '支付失败',
          content: '请稍后重试',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              this.pay()
            }
          }
        })
      })
  }
})
