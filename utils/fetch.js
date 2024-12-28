// fetch.js
var config = require('./config')
var decodeCookie = require('./decodeCookie')

var sess = wx.getStorageSync('PHPSESSID')

module.exports = function (path, data, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.baseUrl + path,
      method: method || 'GET',
      data: data,
      header: {
        'Cookie': sess ? 'PHPSESSID=' + sess : ''
      },
      success: res => {
        if (res.header['Set-Cookie'] !== undefined) {
          sess = decodeCookie(res.header['Set-Cookie'])['PHPSESSID']
          wx.setStorageSync('PHPSESSID', sess)
        }
        if (res.statusCode !== 200) {
          fail('服务器异常', reject)
          return
        }
        if (res.data.code !== 0) {
          fail(res.data.msg, reject)
          return
        }
        resolve(res.data.data)
      },
      fail: function () {
        fail('加载数据失败', reject)
      }
    })
  })
}

function fail(title, callback) {
  wx.hideLoading()
  wx.showModal({
    title: title,
    confirmText: '重试',
    success: res => {
      if (res.confirm) {
        callback()
      }
    }
  })
}
