const App = getApp();
Page({
  data: {
    tabs: [
      {
        name: '未使用',
        type: '10',
      },
      {
        name: '已过期',
        type: '20',
      }
    ],
    stv: {
      windowWidth: 0,
      lineWidth: 0,
      offset: 0,
      tStart: false
    },
    activeTab: 0,
    order: {},
    type: null,
    prompt: {
      hidden: !0,
      icon: '/assets/images/iconfont-order-default.png',
      title: '空空如也',
      text: '暂时没有优惠券',
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
    let type = (this.data.params && this.data.params.type) || '10';
    this.setData({
      type: type
    })
    this.getList();
  },
  getList() {
    let that = this;
    wx.request({
      url: App.globalData.host + 'bonus/list',
      method: 'GET',
      data: {
        type: that.data.type,
        pageNum: 1,
        pageSize: 10,
        sessionId: App.globalData.sessionId
      },
      header: {
        SESSIONID: App.globalData.sessionId,
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
      }
    })
  },
  getListMore(page) {
    let that = this;
    wx.request({
      url: App.globalData.host + 'bonus/list',
      method: 'GET',
      data: {
        type: that.data.type,
        pageNum: page,
        pageSize: 10,
        sessionId: App.globalData.sessionId
      },
      header: {
        SESSIONID: App.globalData.sessionId,
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
      }
    })
  },
  onPullDownRefresh() {
    this.getList();
  },
  onReachBottom() {
    if (!this.data.paginate || !this.data.paginate.hasNextPage) return
    this.getListMore(this.data.paginate.nextpage);
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