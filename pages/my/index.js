var app = getApp()
Page( {
  data: {
    userInfo: {},
    projectSource: 'https://github.com/liuxuanqiang/wechat-weapp-mall',
    userMenus: [ {
      icon: '../../images/iconfont-dingdan.png',
      text: '我的订单',
      url:'./order/index',
      isunread: true,
      unreadNum: 2
    }, {
        icon: '../../images/iconfont-card.png',
        text: '我的代金券',
        url:'./order/index',
        isunread: false,
        unreadNum: 2
      }, {
        icon: '../../images/iconfont-icontuan.png',
        text: '我的拼团',
        url:'./order/index',
        isunread: true,
        unreadNum: 1
      }, {
        icon: '../../images/iconfont-shouhuodizhi.png',
        text: '收货地址管理',
        url:'./order/index'
      }, {
        icon: '../../images/iconfont-kefu.png',
        text: '联系客服',
        url:'./order/index'
      }, {
        icon: '../../images/iconfont-help.png',
        text: '常见问题',
        url:'./order/index'
      }]
  },

  onLoad: function() {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo( function( userInfo ) {
      //更新数据
      that.setData( {
        userInfo: userInfo
      })
    })
  }
})