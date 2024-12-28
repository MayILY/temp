 //此处需要补充代码
Page({
  data: {},
  comment: '',
  onLoad: function (options) {
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/order', {
      id: options.order_id
    }).then(data => {
      this.setData(data)
      wx.hideLoading()
    }, () => {
      this.onLoad(options)
    })
  },
  inputComment: function (e) {
    console.log(e)
    this.comment = e.detail.value
  },
   //此处需要补充代码
  
})