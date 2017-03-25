const App = getApp();
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.getList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh() {
    this.getList();
  },
  onReachBottom() {
    if (!this.data.paginate.hasNextPage)
      return
    this.getListmore();
  },
  getList(page) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    let that = this;
    wx.request({
      url: App.globalData.host + 'item/getAll',
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
        wx.stopPullDownRefresh() //停止下拉刷新
        if (res.data.code == 0) {
          res.data.data.list.forEach(function (item, index) {
            item.created_at = App.dateFormat(item.created_at, 'yyyy-MM-dd');
          });
          that.setData({
            paginate: res.data.data,
            'prompt.hidden': res.data.data.size
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.stopPullDownRefresh() //停止下拉刷新
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
  getListmore() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    let that = this;
    wx.request({
      url: App.globalData.host + 'item/getAll',
      method: 'GET',
      data: {
        sessionId: App.globalData.sessionId,
        'pageNum': that.data.paginate.nextPage,
        'pageSize': 10
      },
      header: {
        SESSIONID: App.globalData.sessionId,
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.stopPullDownRefresh() //停止下拉刷新
        if (res.data.code == 0) {
          var paginat_n = res.data.data;
          paginat_n.list = that.data.paginate.list.concat(paginat_n.list);
          that.setData({
            paginate: paginat_n,
            'prompt.hidden': paginat_n.size
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 1000
          });
        }
      },
      fail: function () {
        wx.stopPullDownRefresh() //停止下拉刷新
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
  offline(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let online = e.currentTarget.dataset.online;
    let that = this;
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: App.globalData.host + 'item/offline2',
      method: 'PUT',
      data: {
        sessionId: App.globalData.sessionId,
        id: id,
        online: online
      },
      header: {
        SESSIONID: App.globalData.sessionId,
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.data.paginate.list[index].is_online = 1 - online;
          that.setData({
            'paginate.list': that.data.paginate.list
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
  }
})