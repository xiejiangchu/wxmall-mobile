import polyfill from 'assets/plugins/polyfill'
import Tools from 'assets/plugins/Tools'
import WxValidate from 'assets/plugins/WxValidate'

App({
  globalData: {
    // host: 'http://119.23.17.74:8090/',
    // host: 'http://192.168.10.2:8090/',
    host: 'http://192.168.10.2:8090/',
    // host: 'https://shop.vrspring.com/',
    img_host: 'http://wxmall.image.alimmdn.com/',
    userInfo: null,
    wxcode: null,
    encryptedData: null,
    iv: null
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    let that = this;
    let sessionId = wx.getStorageSync('sessionId');
    if (sessionId) {
      wx.request({
        url: that.globalData.host + 'user/login',
        method: 'GET',
        data: {
          sessionId: sessionId
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          if (res.data.code == 0) {
            that.globalData.sessionId = res.data.data.sessionId;
            that.globalData.uid = res.data.data.uid;
          } else {
            that.getUserInfo(function (userInfo) {
              that.get3rdSession();
            });
          }
        }
      })
    } else {
      that.getUserInfo(function (userInfo) {
        that.get3rdSession();
      });
    }
  },
  get3rdSession: function () {
    let that = this
    wx.request({
      url: that.globalData.host + 'user/get3rdSession',
      method: 'GET',
      data: {
        code: that.globalData.wxcode,
        encryptedData: that.globalData.encryptedData,
        iv: that.globalData.iv
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.globalData.sessionId = res.data.data.sessionId;
        that.globalData.uid = res.data.data.uid;
        wx.setStorageSync('sessionId', res.data.data.sessionId);
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData)
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
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData)
            }
          })
        }
      })
    }
  },
  onShow: function () {

  },
  onHide: function () {
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