const App = getApp();
Page({
  data: {
    order: {},
    params: {
      pageNum: 1,
      pageSize: 10,
    },
    min: 0,
    prompt: {
      hidden: !0,
      icon: '/assets/images/iconfont-order-default.png',
      title: '空空如也',
      text: '暂时没有优惠券',
    },
  },
  onLoad: function (options) {
    this.setData({
      min: options.min
    })
    this.onPullDownRefresh(0);
  },
  initData() {
    let type = (this.data.params && this.data.params.type) || '10';
    this.setData({
      params: {
        pageNum: 1,
        pageSize: 10,
        type: type,
      }
    })
  },
  getList() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    });
    let that = this;
    wx.request({
      url: App.globalData.host + 'bonus/list',
      method: 'GET',
      data: that.data.params,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        res.data.data.list.forEach(function (item, index) {
          item.start_at = App.dateFormat(item.start_at, 'yyyy-MM-dd');
          item.end_at = App.dateFormat(item.end_at, 'yyyy-MM-dd');
        });
        that.setData({
          paginate: res.data.data,
          'prompt.hidden': res.data.data.size
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
    console.info('onPullDownRefresh')
    this.initData();
    this.getList();
  },
  onReachBottom() {
    console.info('onReachBottom')
    if (!this.data.paginate || !this.data.paginate.hasNextPage) return
    this.getList();
  },
  radioChange(e) {
    let idx = e.detail.value;
    let bonus = this.data.paginate.list[idx];
    wx.setStorageSync('orderData.bonus', bonus)
    wx.redirectTo({
      url: '/pages/order/confirm/index'
    })
  }
})