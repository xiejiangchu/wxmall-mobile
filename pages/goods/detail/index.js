const App = getApp()
var wxCharts = require('../../../assets/plugins/wxcharts-min.js');
var pieChart = null;
var radarChart = null;
Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        id: 0,
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
        });
        var windowWidth = 320;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        } catch (e) {
            console.error('getSystemInfoSync failed!');
        }
        pieChart = new wxCharts({
            animation: true,
            canvasId: 'pieCanvas',
            type: 'pie',
            series: [{
                name: '成交量1',
                data: 15,
            }, {
                name: '成交量2',
                data: 35,
            }, {
                name: '成交量3',
                data: 78,
            }, {
                name: '成交量4',
                data: 63,
            }],
            width: windowWidth,
            height: 300,
            dataLabel: true,
        });

        radarChart = new wxCharts({
            canvasId: 'radarCanvas',
            type: 'radar',
            categories: ['1', '2', '3', '4', '5', '6'],
            series: [{
                name: '成交量1',
                data: [90, 110, 125, 95, 87, 122]
            }],
            width: windowWidth,
            height: 200,
            extra: {
                radar: {
                    max: 150
                }
            }
        });
    },
    onShow() {
        this.setData({
            'carts.items': App.OrderMap.get('orderData.items')
        });
        this.getDetail(this.data.id);
    },
    onHide() {

    },
    confirmOrder(e) {
        wx.showToast({
            title: '提交中...',
            icon: 'loading',
            duration: 10000
        });
        wx.removeStorageSync('orderData.bonus');
        wx.request({
            url: App.globalData.host + 'order/check',
            method: 'POST',
            data: {
            },
            header: {
                SESSIONID: App.globalData.sessionId,
                'Accept': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 0) {
                    if (res.data.data.changed == 1) {
                        wx.showModal({
                            title: '友情提示',
                            showCancel: true,
                            cancelText: '取消',
                            content: '商品数据发生变化，是否继续？',
                            success: function (r) {
                                if (r.confirm) {
                                    if (res.data.data.address) {
                                        App.OrderMap.set('orderData.items', res.data.data.items);
                                        App.OrderMap.set('orderData.address', res.data.data.address);
                                        App.OrderMap.set('orderData.orderCheckDto', res.data.data);
                                        wx.navigateTo({
                                            url: '/pages/order/confirm/index'
                                        })
                                    } else {
                                        wx.navigateTo({
                                            url: '/pages/address/add/index'
                                        })
                                    }
                                }
                            },
                            fail: function () {

                            },
                            complete: function () {

                            }
                        });
                    } else {
                        if (res.data.data.address) {
                            App.OrderMap.set('orderData.items', res.data.data.items);
                            App.OrderMap.set('orderData.address', res.data.data.address);
                            App.OrderMap.set('orderData.orderCheckDto', res.data.data);
                            wx.navigateTo({
                                url: '/pages/order/confirm/index'
                            })
                        } else {
                            wx.navigateTo({
                                url: '/pages/address/add/index'
                            })
                        }
                    }

                } else {
                    wx.showToast({
                        title: res.data.msg || '服务器错误',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.stopPullDownRefresh();
            },
            complete: function () {

                wx.hideToast();
            }
        });
    },
    initNumber() {
        let that = this;
        that.setData({
            'spec.amount': 0
        });
        if (this.data.carts.items && this.data.carts.items.length > 0) {
            this.data.carts.items.forEach(function (item, index) {
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
                    'carts.items': res.data.data
                });
                App.OrderMap.set('orderData.items', res.data.data);
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
        this.putCartByUser(this.data.id, {
            amount: amount,
            spec: this.data.spec.tid
        })
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
        this.putCartByUser(this.data.id, {
            amount: amount,
            spec: this.data.spec.tid
        })
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
    putCartByUser(gid, params) {
        let that = this;
        wx.request({
            url: App.globalData.host + 'cart/update',
            method: 'PUT',
            data: {
                sessionId: App.globalData.sessionId,
                gid: gid,
                spec: params.spec,
                amount: params.amount
            },
            header: {
                SESSIONID: App.globalData.sessionId,
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        'carts.items': res.data.data
                    });
                    App.OrderMap.set('orderData.items', res.data.data);
                    that.initNumber();
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
    getDetail(id) {
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
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
    onShareAppMessage: function () {
        return {
            title: '月都商城',
            desc: this.data.item.name,
            path: '/pages/goods/detail/index?id=' + this.data.id
        }
    }
})