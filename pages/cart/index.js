const App = getApp();

Page({
    data: {
        canEdit: !1,
        img_host: App.globalData.img_host,
        carts: {
            items: [],
            total: 0
        },
        prompt: {
            hidden: !0,
            icon: '../../assets/images/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '来挑几件好货吧',
            buttons: [
                {
                    text: '随便逛',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    onShareAppMessage: function () {
        return {
            title: '月都商城',
            path: '/page/cart/index'
        }
    },
    bindtap: function (e) {
        const index = e.currentTarget.dataset.index
        switch (index) {
            case 0:
                wx.switchTab({
                    url: '/pages/index/index'
                })
                break
            default:
                break
        }
    },
    onLoad() {
    },
    onShow() {
        this.getCarts();
    },
    getCarts() {
        var that = this;
        wx.request({
            url: App.globalData.host + 'cart/item/',
            method: 'GET',
            data: {
                sessionId: App.globalData.sessionId
            },
            header: {
                SESSIONID: App.globalData.sessionId,
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.stopPullDownRefresh();
                if (res.data.code == 0) {
                    let total = 0;
                    res.data.data.forEach(function (item, index) {
                        item.total = item.amount * item.itemSpec.shop_price;
                        item.total = item.total.toFixed(2);
                        total += item.amount * item.itemSpec.shop_price
                    });
                    that.setData({
                        'carts.items': res.data.data,
                        'prompt.hidden': res.data.data.length == 0 ? false : true,
                        'carts.total': total.toFixed(2)
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg || '服务器错误',
                        duration: 1000
                    });
                }
            },
            complete: function () {
                wx.stopPullDownRefresh();
            }
        });
    },
    onPullDownRefresh() {
        this.getCarts();
    },
    checkDetail(e) {
        wx.navigateTo({
            url: '/pages/goods/detail/index?id=' + e.currentTarget.dataset.id
        })
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
                        if (res.confirm) {
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
    del(e) {
        let that = this;
        const gid = e.currentTarget.dataset.gid
        const spec = e.currentTarget.dataset.spec;
        wx.showModal({
            title: '友情提示',
            showCancel: true,
            cancelText: '取消',
            content: '确定要删除该商品吗？',
            success: function () {
                wx.request({
                    url: App.globalData.host + 'cart/update',
                    method: 'PUT',
                    data: {
                        sessionId: App.globalData.sessionId,
                        gid: gid,
                        spec: spec,
                        amount: 0
                    },
                    header: {
                        SESSIONID: App.globalData.sessionId,
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    success: function (res) {
                        let total = 0;
                        res.data.data.forEach(function (item, index) {
                            item.total = item.amount * item.itemSpec.shop_price;
                            item.total = item.total.toFixed(2);
                            total += item.amount * item.itemSpec.shop_price
                        });
                        that.setData({
                            'carts.items': res.data.data,
                            'prompt.hidden': res.data.data.length == 0 ? false : true,
                            'carts.total': total.toFixed(2)
                        });
                        App.OrderMap.set('orderData.items', this.data.carts.items);
                        wx.stopPullDownRefresh();
                    }
                });
            },
            fail: function () {
                wx.stopPullDownRefresh();
            },
            complete: function () {

            }
        });
    },
    clear() {
        let that = this;
        wx.showModal({
            title: '友情提示',
            showCancel: true,
            cancelText: '取消',
            content: '确定要清空购物车吗？',
            success: function () {
                wx.request({
                    url: App.globalData.host + 'cart/clear',
                    method: 'PUT',
                    data: {
                        sessionId: App.globalData.sessionId
                    },
                    header: {
                        SESSIONID: App.globalData.sessionId,
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    success: function (res) {
                        let total = 0;
                        res.data.data.forEach(function (item, index) {
                            item.total = item.amount * item.itemSpec.shop_price;
                            item.total = item.total.toFixed(2);
                            total += item.amount * item.itemSpec.shop_price
                        });
                        that.setData({
                            'carts.items': res.data.data,
                            'prompt.hidden': res.data.data.length == 0 ? false : true,
                            'carts.total': total.toFixed(2)
                        });
                        wx.stopPullDownRefresh();
                    }
                });
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
    onTapEdit(e) {
        this.setData({
            canEdit: !!e.currentTarget.dataset.value
        })
    },
    bindKeyInput(e) {
        let spec = e.currentTarget.dataset.spec;
        let gid = e.currentTarget.dataset.gid;
        let amount = Math.abs(e.detail.value);
        this.putCartByUser(gid, {
            amount: amount,
            spec: spec
        })
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
                let total = 0;
                res.data.data.forEach(function (item, index) {
                    item.total = item.amount * item.itemSpec.shop_price;
                    item.total = item.total.toFixed(2);
                    total += item.amount * item.itemSpec.shop_price
                });
                that.setData({
                    'carts.items': res.data.data,
                    'prompt.hidden': res.data.data.length == 0 ? false : true,
                    'carts.total': total.toFixed(2)
                });
                App.OrderMap.set('orderData.items', this.data.carts.items);
                wx.stopPullDownRefresh();
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
    decrease(e) {
        const spec = e.currentTarget.dataset.spec;
        const gid = e.currentTarget.dataset.gid
        const amount = Math.abs(e.currentTarget.dataset.amount)
        if (amount == 1) return
        this.putCartByUser(gid, {
            amount: amount - 1,
            spec: spec
        })
    },
    increase(e) {
        const spec = e.currentTarget.dataset.spec;
        const gid = e.currentTarget.dataset.gid
        const amount = Math.abs(e.currentTarget.dataset.amount)
        if (amount == 100) return
        this.putCartByUser(gid, {
            amount: amount + 1,
            spec: spec
        })
    }
})