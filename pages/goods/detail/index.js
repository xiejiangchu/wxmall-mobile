const App = getApp()
var wxCharts = require('../../../assets/plugins/wxcharts-min.js');
var pieChart = null;
var radarChart = null;
var wemark = require('../../../assets/wemark/wemark');
Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        id: 0,
        item: {
            id: 10
        },
        spec: {
            tid: -1,
            index: 0,
            amount: 0
        },
        carts: {
            items: {},
            totalCount: 0
        },
        loading: false,
        wemark: {}
    },
    swiperchange(e) {
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
        // pieChart = new wxCharts({
        //     animation: true,
        //     canvasId: 'pieCanvas',
        //     type: 'pie',
        //     series: [{
        //         name: '成交量1',
        //         data: 15,
        //     }, {
        //         name: '成交量2',
        //         data: 35,
        //     }, {
        //         name: '成交量3',
        //         data: 78,
        //     }, {
        //         name: '成交量4',
        //         data: 63,
        //     }],
        //     width: windowWidth,
        //     height: 300,
        //     dataLabel: true,
        // });

        // radarChart = new wxCharts({
        //     canvasId: 'radarCanvas',
        //     type: 'radar',
        //     categories: ['1', '2', '3', '4', '5', '6'],
        //     series: [{
        //         name: '成交量1',
        //         data: [90, 110, 125, 95, 87, 122]
        //     }],
        //     width: windowWidth,
        //     height: 200,
        //     extra: {
        //         radar: {
        //             max: 150
        //         }
        //     }
        // });
    },
    onShow() {
        this.setData({
            'carts.items': App.OrderMap.get('orderData.items')
        });
        this.getDetail(this.data.id);
    },
    onHide() {

    },
    previewImage(e) {
        let urls = [];
        let index = e.currentTarget.dataset.index || 0;
        this.data.item.imageList.forEach(function (item, index) {
            urls.push(item.url);
        });
        wx.previewImage({
            current: urls[index], // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    confirmOrder(e) {
        wx.showToast({
            title: '提交中...',
            icon: 'loading',
            duration: 10000
        });
        App.OrderMap.delete('orderData.bonus');
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
                wx.hideToast();
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
                    } else if (res.data.data.changed == 80000) {
                        wx.showToast({
                            title: '积分不足',
                            duration: 1000
                        });
                    } else if (res.data.data.changed == 80001) {
                        wx.showToast({
                            title: '订单金额低于起送金额',
                            duration: 1000
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
                
            }
        });
    },
    initNumber() {
        let that = this;
        that.setData({
            'spec.amount': 0
        });
        let totalCount = 0;
        if (this.data.carts.items && this.data.carts.items.length > 0) {
            this.data.carts.items.forEach(function (item, index) {
                totalCount += item.amount;
                if (item.gid == that.data.id && item.spec == that.data.spec.tid) {
                    that.setData({
                        'spec.amount': item.amount
                    });
                }
            });
        }
        that.setData({
            'carts.totalCount': totalCount
        });
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
        if (!this.data.spec.tid || this.data.spec.tid <= 0) {
            wx.showToast({
                title: '请选择规格',
                duration: 1000
            });
            return;
        }
        let step = this.data.item.itemSpecList[this.data.spec.index].unit_sell;
        let amount = this.data.spec.amount + step;
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
        if (!this.data.spec.tid || this.data.spec.tid <= 0) {
            wx.showToast({
                title: '请选择规格',
                duration: 1000
            });
            return;
        }
        let step = this.data.item.itemSpecList[this.data.spec.index].unit_sell;
        let amount = this.data.spec.amount - step;
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
        let remain = e.currentTarget.dataset.remain;
        if (remain > 0) {
            this.setData({
                'spec.tid': tid,
                'spec.index': index
            });
            this.initNumber();
        }
    },
    putCartByUser(gid, params) {
        let that = this;
        if (that.data.loading)
            return;
        that.data.loading = true;
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
                that.data.loading = false;
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
                if (res.data.code == 0) {
                    that.setData({
                        item: res.data.data
                    });
                    wemark.parse(res.data.data.description, that, {
                        imageWidth: wx.getSystemInfoSync().windowWidth - 40,
                        name: 'wemark'
                    })
                    res.data.data.itemSpecList.forEach(function (item, index) {
                        if (item.remain > 0) {
                            that.setData({
                                'spec.tid': item.id,
                                'spec.index': index
                            })
                        }
                    });
                    that.initNumber();
                } else {
                    that.setData({
                        item: null
                    });
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
    backIndex: function (e) {
        wx.switchTab({
            url: '/pages/index/index'
        })
    },
    backCart: function (e) {
        wx.switchTab({
            url: '/pages/cart/index'
        })
    },
    onShareAppMessage: function () {
        return {
            title: '月都商城',
            desc: this.data.item.name,
            path: '/pages/goods/detail/index?id=' + this.data.id
        }
    }
})