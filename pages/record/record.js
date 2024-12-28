// record.js
const fetch = require('../../utils/fetch')

Page({
  data: {
    list: [],
    avatarUrl: '../../images/user.png'
  },
  onLoad: function () {
    this.onPullDownRefresh()
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中'
    })
    fetch('/food/record')
      .then(data => {
        this.setData({
          list: data.list
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
      .catch(() => {
        wx.hideLoading()
        wx.showModal({
          title: '加载失败',
          content: '请稍后重试',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              this.onLoad()
            }
          }
        })
      })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl
    })
    wx.uploadFile({
      url: fetch.baseUrl + '/food/upload_avatar',
      filePath: avatarUrl,
      name: 'avatar',
      success: res => {
        console.log('上传成功', res)
      },
      fail: err => {
        console.error('上传失败', err)
      }
    })
  }
})
