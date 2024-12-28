// pages/list/list.js
const fetch = require('../../utils/fetch')
const shopcartAnimate = require('../../utils/shopcartAnimate')

Page({
  data: {
    foodList: [],
    promotion: {},
    activeIndex: 0,
    tapIndex: 0,
    cartList: {},
    cartNumber: 0,
    cartPrice: 0,
    showCart: false,
    cartBall: {
      show: false,
      x: 0,
      y: 0
    }
  },
  disableNextScroll: false,
  shopcartAnimate: null,
  onLoad: function () {
    wx.showLoading({
      title: '努力加载中'
    })
    fetch('/food/list')
      .then(data => {
        wx.hideLoading()
        this.setData({
          foodList: data.list,
          promotion: data.promotion
        }, () => {
          var query = wx.createSelectorQuery()
          var top = 0
          query.select('.food').boundingClientRect(rect => {
            top = rect.top
          })
          query.selectAll('.food-category').boundingClientRect(res => {
            this.categoryPosition = res.map(item => item.top - top - 30)
          })
          query.exec()
        })
      })
      .catch(() => {
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
    this.categoryPosition.forEach((item, i) => {
      if (scrollTop >= item) {
        activeIndex = i
      }
    })
    if (activeIndex !== this.data.activeIndex) {
      this.setData({ activeIndex })
    }
  },
  showCartList: function () {
    if (this.data.cartNumber > 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  },
  addToCart: function (e) {
    var categoryIndex = e.currentTarget.dataset.category_index
    var index = e.currentTarget.dataset.index
    var food = this.data.foodList[categoryIndex].food[index]
    var id = food.id
    var cartList = this.data.cartList
    if (!cartList[id]) {
      cartList[id] = Object.assign({}, food, { number: 1 })
    } else {
      ++cartList[id].number
    }
    this.setData({
      cartList: cartList,
      cartNumber: ++this.data.cartNumber,
      cartPrice: this.data.cartPrice + food.price
    })
    this.shopcartAnimate.start(e)
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
  cartClear: function () {
    this.setData({
      cartList: {},
      cartNumber: 0,
      cartPrice: 0,
      showCart: false
    })
  },
  order: function () {
    if (this.data.cartNumber === 0) return
    fetch('/food/order', {cart: JSON.stringify(this.data.cartList)})
      .then(data => {
        wx.navigateTo({
          url: '/pages/order/checkout/checkout?order_id=' + data.id
        })
      })
      .catch(() => {
        this.order()
      })
  }
})
