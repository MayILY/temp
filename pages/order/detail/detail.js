// detail.js
const fetch = require('../../../utils/fetch')

Page({
  data: {
    code: '',
    order_food: [],
    price: 0,
    promotion: 0,
    sn: '',
    create_time: '',
    pay_time: '',
    taken_time: '',
    is_taken: false,
    comment: ''
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/detail', {
      id: options.order_id
    })
      .then(data => {
        wx.hideLoading()
        this.setData(data)
      })
      .catch(() => {
        this.onLoad(options)
      })
  }
})
