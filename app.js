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
    // host: 'http://10.8.203.182:8090/',
    host: 'http://192.168.10.2:8090/',
    img_host: 'http://wxmall.image.alimmdn.com/',
    userInfo: null,
    wxcode: null,
    encryptedData: null,
    iv: null,

  },
  dateFormat: function (date, format) {
    var fmt = "yyyy/MM/dd HH:mm";
    if (format) {
      fmt = format;
    }
    var param = new Date(date);
    var o = {
      "M+": param.getMonth() + 1, //月份
      "d+": param.getDate(), //日
      "h+": param.getHours() % 12 == 0 ? 12 : param.getHours() % 12, //小时
      "H+": param.getHours(), //小时
      "m+": param.getMinutes(), //分
      "s+": param.getSeconds(), //秒
      "q+": Math.floor((param.getMonth() + 3) / 3), //季度
      "S": param.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (param.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  Tools: new Tools,
  WxValidate: function (rules, messages) {
    return new WxValidate(rules, messages);
  }
})