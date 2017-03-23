const App = getApp()

Page({
    data: {
        id: -1,
        order: {
            order: {},
        },
    },
    onLoad(option) {
        this.setData({
            id: option.id
        })
    },
    onPullDownRefresh() {
        this.getOrderDetail(this.data.id);
    },
    pay(e) {
        let that = this;
        wx.request({
            url: App.globalData.host + 'order/pay',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                sessionId: App.globalData.sessionId,
                oid: e.currentTarget.dataset.oid
            },
            success: function (res) {
                that.requestPayment(res.data);
            },
            fail: function (e) {
                wx.showToast({
                    title: e,
                    duration: 1000
                });
            }
        });
    },
    //申请支付
    requestPayment: function (obj) {
        wx.requestPayment({
            'timeStamp': obj.timeStamp,
            'nonceStr': obj.nonceStr,
            'package': obj.package,
            'signType': obj.signType,
            'paySign': obj.paySign,
            'success': function (res) {
            },
            'fail': function (res) {
            }
        })
    },
    cancel(e) {
        let that = this;
        wx.showModal({
            title: '友情提示',
            showCancel: true,
            cancelText: '取消',
            content: '确定要取消该订单嘛？',
            success: function () {
                wx.request({
                    url: App.globalData.host + 'order/cancel',
                    method: 'PUT',
                    data: {
                        sessionId: App.globalData.sessionId,
                        oid: e.currentTarget.dataset.oid
                    },
                    header: {
                        SESSIONID: App.globalData.sessionId,
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    success: function (res) {
                        if (res.data.code == 0) {
                            wx.showToast({
                                title: '取消成功',
                                duration: 1000
                            });
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    },
                    fail: function (e) {
                        wx.showToast({
                            title: "服务器错误",
                            duration: 1000
                        });
                    }
                });
            },
            fail: function () {

            },
            complete: function () {

            }
        });

    },
    orderMore(e) {
        let that = this;
        wx.request({
            url: App.globalData.host + 'order/orderMore',
            method: 'GET',
            data: {
                sessionId: App.globalData.sessionId,
                oid: e.currentTarget.dataset.oid
            },
            header: {
                SESSIONID: App.globalData.sessionId,
                'Accept': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '加入成功',
                        duration: 1000
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 1000
                    });
                }
            }
        });
    },
    onShow() {
        this.getOrderDetail(this.data.id)
    },
    getOrderDetail(id) {
        if (!id || id <= 0)
            return;
        console.log(id);
        let that = this;
        wx.request({
            url: App.globalData.host + 'order/' + id,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.stopPullDownRefresh() //停止下拉刷新
                if (res.data.code == 0) {
                    let order = res.data.data;
                    order.created_at = App.dateFormat(order.created_at, 'yyyy-MM-dd HH:mm:ss')
                    that.setData({
                        order: order
                    })
                } else {
                    wx.showToast({
                        title: res.data.code.msg,
                        duration: 1000
                    });
                }
            },
            fail: function (e) {
                wx.stopPullDownRefresh() //停止下拉刷新
                wx.showToast({
                    title: '服务器错误',
                    duration: 1000
                });
            }
        })
    },
})