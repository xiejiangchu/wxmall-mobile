const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        id: 24113,
        item: {},
        spec: {
            tid: -1,
            index: 0,
            amount: 0
        },
        cart: {
            items: {}
        }
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onPullDownRefresh() {
        this.getDetail(this.data.id);
    },
    onLoad(option) {
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.setData({
            'cart.items': wx.getStorageSync('orderData.items')
        });
        this.getDetail(this.data.id);
    },
    onHide() {
        wx.setStorageSync('orderData.items', this.data.carts.items);
    },
    initNumber() {
        let that = this;
        that.setData({
            'spec.amount': 0
        });
        if (this.data.cart.items && this.data.cart.items.length > 0) {
            this.data.cart.items.forEach(function (item, index) {
                if (item.gid == that.data.id && item.spec == that.data.spec.tid) {
                    that.setData({
                        'spec.amount': item.amount
                    });
                }
            });
        }
    },
    inputTyping(e) {
        let amount = e.detail.value;
        if (!amount || amount <= 0) {
            return;
        }
        let that = this;
        wx.request({
            url: App.globalData.host + 'cart/update',
            method: 'PUT',
            header: {
                SESSIONID: App.globalData.sessionId,
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: {
                SESSIONID: App.globalData.sessionId,
                gid: that.data.id,
                spec: that.data.spec.tid,
                amount: amount
            },
            success: function (res) {
                that.setData({
                    'cart.items': res.data.data
                });
                that.initNumber();
            }
        });
    },
    addCart(e) {
        if (!this.data.spec.tid) {
            wx.showToast({
                title: '请选择规格',
                duration: 1000
            });
            return;
        }
        let amount = this.data.spec.amount + 1;
        if (amount > this.data.item.itemSpecList[this.data.spec.index].max) {
            amount = this.data.item.itemSpecList[this.data.spec.index].max;
        }
        if (amount < this.data.item.itemSpecList[this.data.spec.index].min) {
            amount = this.data.item.itemSpecList[this.data.spec.index].min;
        }
        let that = this;
        wx.request({
            url: App.globalData.host + 'cart/update',
            method: 'PUT',
            header: {
                SESSIONID: App.globalData.sessionId,
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: {
                SESSIONID: App.globalData.sessionId,
                gid: that.data.id,
                spec: that.data.spec.tid,
                amount: amount
            },
            success: function (res) {
                that.setData({
                    'cart.items': res.data.data
                });
                that.initNumber();
            }
        });
    },
    subCart(e) {
        if (!this.data.spec.tid) {
            wx.showToast({
                title: '请选择规格',
                duration: 1000
            });
            return;
        }
        let amount = this.data.spec.amount - 1;
        if (amount > this.data.item.itemSpecList[this.data.spec.index].max) {
            amount = this.data.item.itemSpecList[this.data.spec.index].max;
        }
        if (amount < this.data.item.itemSpecList[this.data.spec.index].min) {
            amount = this.data.item.itemSpecList[this.data.spec.index].min;
        }
        let that = this;
        wx.request({
            url: App.globalData.host + 'cart/update',
            method: 'PUT',
            header: {
                SESSIONID: App.globalData.sessionId,
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: {
                SESSIONID: App.globalData.sessionId,
                gid: that.data.id,
                spec: that.data.spec.tid,
                amount: amount
            },
            success: function (res) {
                that.setData({
                    'cart.items': res.data.data
                });
                that.initNumber();
            }
        });
    },
    switchType(e) {
        let tid = e.currentTarget.dataset.tid;
        let index = e.currentTarget.dataset.index;
        this.setData({
            'spec.tid': tid,
            'spec.index': index
        });
        this.initNumber();
    },
    getDetail(id) {
        var that = this;
        wx.request({
            url: App.globalData.host + 'item/' + id,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.stopPullDownRefresh() //停止下拉刷新
                that.setData({
                    item: res.data.data,
                    'spec.tid': res.data.data.itemSpecList[0].id,
                    'spec.index': 0
                });
                that.initNumber();
            }
        });
    }
})