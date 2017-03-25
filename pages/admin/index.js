const App = getApp();
Page({
  data: {
    admins1: [
      {
        text: '商品上下架',
        path: '/pages/admin/item/index'
      },
      {
        text: '商品管理',
        path: '/pages/admin/iteminfo/index'
      },
      {
        text: '规格上下架',
        path: '/pages/admin/spec/index'
      }
    ],
    admins2: [{
      text: '规格管理',
      path: '/pages/admin/specinfo/index'
    },
    {
      text: '订单管理',
      path: '/pages/admin/order/index'
    },
    {
      text: '优惠券管理',
      path: '/pages/admin/bonus/index'
    }]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  bindadmin(e) {
    const index = e.currentTarget.dataset.index;
    const path = e.currentTarget.dataset.path;
    switch (index) {
      default:
        wx.navigateTo({ 'url': path })
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})