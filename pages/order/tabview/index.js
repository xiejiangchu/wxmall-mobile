const App = getApp();
Page({
  data: {
    tabs: [
      {
        name: '待支付',
        type: '10',
      },
      {
        name: '待发货',
        type: '20',
      },
      {
        name: '待收货',
        type: '30',
      },
      {
        name: '已完成',
        type: '40',
      },
    ],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    order: {},
    params: {
      pageNum: 1,
      pageSize: 10,
    },
    prompt: {
      hidden: !0,
      icon: '/assets/images/iconfont-order-default.png',
      title: '您还没有相关的订单',
      text: '可以去看看有哪些想买的',
    },
  },
  onLoad: function (options) {
    try {
      let {tabs} = this.data;
      var res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.stv.lineWidth = this.windowWidth / this.data.tabs.length;
      this.data.stv.windowWidth = res.windowWidth;
      this.setData({ stv: this.data.stv })
      this.tabsCount = tabs.length;
    } catch (e) {
    }
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
    let that = this;
    wx.request({
      url: App.globalData.host + 'order/list',
      method: 'GET',
      data: that.data.params,
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          paginate: res.data.data,
          'prompt.hidden': res.data.data.size
        })
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
  handlerStart(e) {
    let {clientX, clientY} = e.touches[0];
    this.startX = clientX;
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.data.stv.tStart = true;
    this.tapStartTime = e.timeStamp;
    this.setData({ stv: this.data.stv })
  },
  handlerMove(e) {
    let {clientX, clientY} = e.touches[0];
    let {stv} = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    stv.offset += offsetX;
    if (stv.offset <= 0) {
      stv.offset = 0;
    } else if (stv.offset >= stv.windowWidth * (this.tabsCount - 1)) {
      stv.offset = stv.windowWidth * (this.tabsCount - 1);
    }
    this.setData({ stv: stv });
  },
  handlerCancel(e) {

  },
  handlerEnd(e) {
    let {clientX, clientY} = e.changedTouches[0];
    let endTime = e.timeStamp;
    let {tabs, stv, activeTab} = this.data;
    let {offset, windowWidth} = stv;
    //快速滑动
    if (endTime - this.tapStartTime <= 300) {
      //向左
      if (Math.abs(this.tapStartY - clientY) < 50) {
        if (this.tapStartX - clientX > 5) {
          if (activeTab < this.tabsCount - 1) {
            this.setData({ activeTab: ++activeTab })
          }
        } else {
          if (activeTab > 0) {
            this.setData({ activeTab: --activeTab })
          }
        }
        stv.offset = stv.windowWidth * activeTab;
      } else {
        //快速滑动 但是Y距离大于50 所以用户是左右滚动
        let page = Math.round(offset / windowWidth);
        if (activeTab != page) {
          this.setData({ activeTab: page })
        }
        stv.offset = stv.windowWidth * page;
      }
    } else {
      let page = Math.round(offset / windowWidth);
      if (activeTab != page) {
        this.setData({ activeTab: page })
      }
      stv.offset = stv.windowWidth * page;
    }
    stv.tStart = false;
    let type = this.data.tabs[this.data.activeTab].type;
    this.setData({
      'stv': this.data.stv,
      'params.type': type
    });
    this.getList();
  },
  _updateSelectedPage(index_selected, type) {
    let {tabs, stv, activeTab} = this.data;
    activeTab = index_selected;
    this.setData({
      'activeTab': activeTab,
      'params.type': type
    })
    stv.offset = stv.windowWidth * activeTab;
    this.setData({ stv: this.data.stv })
    this.getList();
  },
  handlerTabTap(e) {
    console.log(e.currentTarget.dataset.type);
    this._updateSelectedPage(e.currentTarget.dataset.index, e.currentTarget.dataset.type);
  }
})