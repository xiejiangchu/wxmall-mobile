const App = getApp();
Page({
  data: {
    userSrc: [],
    userIndex: -1,
    userList: [],
    bonusIndex: -1,
    bonusList: [],
    bonusModifyIndex: -1,
    bonusModifyList: [],
    date_start: App.dateFormat(new Date(), 'yyyy/MM/dd'),
    date_end: null,
    form1: {
      uid: null,
      tid: null
    },
    form2: {
      uid: null,
      bid: null
    }
  },
  onLoad: function (options) {
    this.getUsers();
    this.getBonus();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

  },
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
  getUsers(page) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    let that = this;
    wx.request({
      url: App.globalData.host + 'user/getAll',
      method: 'GET',
      data: {
        sessionId: App.globalData.sessionId,
        'pageNum': 1,
        'pageSize': 10
      },
      header: {
        SESSIONID: App.globalData.sessionId,
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          let userList = [];
          res.data.data.list.forEach(function (item, index) {
            userList.push(item.name)
          });
          if (res.data.code == 0) {
            that.setData({
              userSrc: res.data.data,
              userList: userList
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              duration: 1000
            });
          }
        } else {
          wx.showToast({
            title: res.data.msg || '服务器错误',
            duration: 1000
          });
        }

      },
      fail: function () {
        wx.showToast({
          title: '服务器错误',
          duration: 1000
        });
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  getBonus(page) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    let that = this;
    wx.request({
      url: App.globalData.host + 'bonus/getAllEnabled',
      method: 'GET',
      data: {
        sessionId: App.globalData.sessionId
      },
      header: {
        SESSIONID: App.globalData.sessionId,
        'Accept': 'application/json'
      },
      success: function (res) {
        let bonusList = [];
        res.data.data.forEach(function (item, index) {
          bonusList.push(item.name);
          item.start_at = App.dateFormat(item.start_at, 'yyyy/MM/dd');
          item.end_at = App.dateFormat(item.end_at, 'yyyy/MM/dd');
        });
        if (res.data.code == 0) {
          that.setData({
            bonusSrc: res.data.data,
            bonusList: bonusList,
            bonusModifyList: bonusList
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '服务器错误',
          duration: 1000
        });
      },
      complete: function () {
        wx.hideToast();
      }
    });
  },
  bindUserChange(e) {
    this.setData({
      userIndex: e.detail.value,
      'form1.uid': this.data.userSrc.list[e.detail.value].id,
    });
  },
  bindBonusChange(e) {
    this.setData({
      bonusIndex: e.detail.value,
      'form1.tid': this.data.bonusSrc[e.detail.value].id,
    });
  },
  give() {
    let that = this;
    wx.request({
      url: App.globalData.host + 'bonus/give',
      method: 'POST',
      data: {
        sessionId: App.globalData.sessionId,
        uid: that.data.form1.uid,
        tid: that.data.form1.tid,
        is_enable: 1
      },
      header: {
        SESSIONID: App.globalData.sessionId,
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '发放成功',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: res.data.msg || '服务器错误',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '服务器错误',
          duration: 1000
        });
      },
      complete: function () {
      }
    });
  },
  bonusModify(e) {
    let that = this;
    wx.request({
      url: App.globalData.host + 'bonus/' + that.data.form2.tid,
      method: 'PUT',
      data: {
        sessionId: App.globalData.sessionId,
        tid: that.data.form2.tid,
        start_at: that.data.form2.start_at,
        end_at: that.data.form2.end_at,
        is_enable: 1
      },
      header: {
        SESSIONID: App.globalData.sessionId,
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '发放成功',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: res.data.msg || '服务器错误',
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '服务器错误',
          duration: 1000
        });
      },
      complete: function () {
      }
    });
  },
  bonusModifyChange(e) {
    this.setData({
      bonusModifyIndex: e.detail.value,
      'form2.tid': this.data.bonusSrc[e.detail.value].id,
    });
  },
  bindDateChangeStart(e) {
    console.log(e.detail.value);
    this.setData({
      'form2.start_at': e.detail.value
    });
  },
  bindDateChangeEnd(e) {
    this.setData({
      'form2.end_at': e.detail.value
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})