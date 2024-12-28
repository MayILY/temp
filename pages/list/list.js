// pages/list/list.js
// 引入购物车动画模块
 //此处需要补充代码
Page({
   //此处需要补充代码,
  disableNextScroll: false,
  shopcartAnimate: null,
  onLoad: function () {
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/list').then(data => {
      wx.hideLoading()
      this.setData({
        foodList: data.list,
        promotion: data.promotion[0]
      }, () => {
        var query = wx.createSelectorQuery()
        var top = 0
        var height = 0
        query.select('.food').boundingClientRect(rect => {
          top = rect.top
          height = rect.height
        })
        query.selectAll('.food-category').boundingClientRect(res => {
          res.forEach(rect => {
            categoryPosition.push(rect.top - top - height / 3)
          })
        })
        query.exec()
      })
    }, () => {
      this.onLoad()
    })
    this.shopcartAnimate = shopcartAnimate('.operate-shopcart-icon', this)
  },

  tapCategory: function (e) {
    this.disableNextScroll = true
    var index = e.currentTarget.dataset.index
    this.setData({
      activeIndex: index,
      tapIndex: index
    })
  },
  onFoodScroll: function (e) {
    if (this.disableNextScroll) {
      this.disableNextScroll = false
      return
    }
    var scrollTop = e.detail.scrollTop
    var activeIndex = 0
    categoryPosition.forEach((item, i) => {
      if (scrollTop >= item) {
        activeIndex = i
      }
    })
    if (activeIndex !== this.data.activeIndex) {
      this.setData({ activeIndex })
    }
  },
 //此处需要补充代码,
  showCartList: function () {
    if (this.data.cartNumber > 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  },
  cartNumberAdd: function(e) {
    var id = e.currentTarget.dataset.id
    var cartList = this.data.cartList
    ++cartList[id].number
    this.setData({
      cartList: cartList,
      cartNumber: ++this.data.cartNumber,
      cartPrice: this.data.cartPrice + cartList[id].price
    })
  },
  cartNumberDec: function(e) {
    var id = e.currentTarget.dataset.id
    var cartList = this.data.cartList
    if (cartList[id]) {
      var price = cartList[id].price
      if (cartList[id].number > 1) {
        --cartList[id].number
      } else {
        delete cartList[id]
      }
      this.setData({
        cartList: cartList,
        cartNumber: --this.data.cartNumber,
        cartPrice: this.data.cartPrice - price
      })
      if (this.data.cartNumber <= 0) {
        this.setData({
          showCart: false
        })
      }
    }
  },
   //此处需要补充代码
     
})

