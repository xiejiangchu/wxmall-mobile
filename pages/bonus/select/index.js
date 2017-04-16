const App = getApp();
Page({
  data: {
    list: [],
    prompt: {
      hidden: !0,
      icon: '/assets/images/iconfont-order-default.png',
      title: '空空如也',
      text: '暂时没有优惠券',
    },
  },
  onLoad: function () {
    this.onPullDownRefresh(0);
  },
  getList() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    let that = this;
    wx.request({
      url: App.globalData.host + 'bonus/getEnabledByCart',
      method: 'GET',
      data: {
        sessionId: App.globalData.sessionId
      },
      header: {
        SESSIONID: App.globalData.sessionId,
        'Accept': 'application/json'
      },
      success: function (res) {
        res.data.data.forEach(function (item, index) {
          item.start_at = App.dateFormat(item.start_at, 'yyyy-MM-dd');
          item.end_at = App.dateFormat(item.end_at, 'yyyy-MM-dd');
        });
        that.setData({
          list: res.data.data,
          'prompt.hidden': res.data.data.length
        })
      },
      fail: function () {
        wx.stopPullDownRefresh();
      },
      complete: function () {
        wx.hideToast();
      }
    })
  },
  onPullDownRefresh() {
    this.getList();
  },
  radioChange(e) {
    let idx = e.detail.value;
    let bonus = this.data.list[idx];
    App.OrderMap.set('orderData.bonus', bonus);
    wx.redirectTo({
      url: '/pages/order/confirm/index'
    })
  }
})