import polyfill from 'assets/plugins/polyfill'
import Tools from 'assets/plugins/Tools'
import WxValidate from 'assets/plugins/WxValidate'

App({
  onLaunch: function () {
    console.log('App Launch')
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          that.globalData.wxcode = res.code;
          wx.getUserInfo({
            success: function (res) {
              //获取用户敏感数据密文和偏移向量
              that.globalData.encryptedData = res.encryptedData;
              that.globalData.iv = res.iv;
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    host: 'http://10.8.203.182:8090/',
    img_host: 'http://wxmall.image.alimmdn.com/',
    userInfo: null,
    wxcode: null,
    encryptedData: null,
    iv: null,

  },
  Tools: new Tools,
  WxValidate: function (rules, messages) {
    return new WxValidate(rules, messages);
  }
})