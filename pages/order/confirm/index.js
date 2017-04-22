const App = getApp()

Page({
    data: {
        img_host: App.globalData.img_host,
        hidden: !0,
        carts: {},
        address: null,
        message: '',
        date: App.dateFormat(new Date(), 'yyyy/MM/dd'),
        date_start: App.dateFormat(new Date(), 'yyyy/MM/dd'),
        date_end: null,
        time_s: "09:00",
        time_e: "09:00",
        time_start: "09:00",
        time_end: "11:00",
        payments: ["微信支付", "货到付款"],
        pids: [1, 2],
        point: 0,
        point_total: 0,
        paymentIndex: 0,
        bonusCount: 0,
        bonus: {
            id: -1
        },
        point_rate: 100,
        promote_price: 0
    },
    onPullDownRefresh() {
        this.confirmOrder()
    },
    confirmOrder() {
        let that = this;
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

                App.OrderMap.set('orderData.items', res.data.data.items);
                App.OrderMap.set('orderData.address', res.data.data.address);
                App.OrderMap.set('orderData.orderCheckDto', res.data.data);
                that.onLoad();
            },
            fail: function () {
                wx.stopPullDownRefresh();
            },
            complete: function () {
                wx.stopPullDownRefresh();
            }
        });
    },
    onLoad(option) {
        let paymentsList = App.OrderMap.get('orderData.orderCheckDto').payments;
        this.setData({
            bonus: App.OrderMap.get('orderData.bonus') || null,
            address: App.OrderMap.get('orderData.address'),
            date: App.dateFormat(App.OrderMap.get('orderData.orderCheckDto').date_start, 'yyyy/MM/dd'),
            date_start: App.dateFormat(App.OrderMap.get('orderData.orderCheckDto').date_start, 'yyyy/MM/dd'),
            date_end: App.dateFormat(App.OrderMap.get('orderData.orderCheckDto').date_end, 'yyyy/MM/dd'),
            time_s: App.OrderMap.get('orderData.orderCheckDto').time_start,
            time_e: App.OrderMap.get('orderData.orderCheckDto').time_end,
            time_start: App.OrderMap.get('orderData.orderCheckDto').time_start,
            time_end: App.OrderMap.get('orderData.orderCheckDto').time_end,
            bonusCount: App.OrderMap.get('orderData.orderCheckDto').bonusCount,
            point_total: App.OrderMap.get('orderData.orderCheckDto').point,
            point_rate: App.OrderMap.get('orderData.orderCheckDto').point_rate,
            promote_price: App.OrderMap.get('orderData.orderCheckDto').promote_price
        });

        let payments = [];
        let pids = [];
        paymentsList.forEach(function (item, index) {
            payments.push(item.name);
            pids.push(item.id);
        });
        this.setData({
            payments: payments,
            pids: pids
        })
        let carts = {
            items: App.OrderMap.get('orderData.items'),
            totalAmount: App.OrderMap.get('orderData.orderCheckDto').totalAmount,
            bonus: 0,
            point: 0,
            total: App.OrderMap.get('orderData.orderCheckDto').totalAmount
        }
        if (this.data.bonus) {
            carts.bonus = this.data.bonus.money;
            carts.total = (carts.total - carts.bonus).toFixed(2);
        }
        this.setData({
            carts: carts
        })
    },
    calc() {
        let carts = {
            totalAmount: App.OrderMap.get('orderData.orderCheckDto').totalAmount
        }
        if (this.data.bonus) {
            carts.bonus = this.data.bonus.money;
        } else {
            carts.bonus = 0;
        }
        carts.total = (carts.totalAmount - carts.bonus - this.data.carts.point).toFixed(2);
        this.setData({
            'carts.total': carts.total
        })
    },
    selectAddress(e) {
        wx.redirectTo({
            url: '/pages/address/confirm/index'
        })
    },
    bindPointInput(e) {
        let point = e.detail.value;
        if (!point || point < 0) {
            point = 0;
        }
        if (point > this.data.point_total) {
            point = this.data.point_total
        }
        let point_money = (point / this.data.point_rate).toFixed(2);
        this.setData({
            point: point,
            'carts.point': point_money
        });
        this.calc();
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChangeStart: function (e) {
        this.setData({
            time_s: e.detail.value
        })
    },
    bindTimeChangeEnd: function (e) {
        this.setData({
            time_e: e.detail.value
        })
    },
    bindKeyInput(e) {
        const message = e.detail.value;
        this.setData({
            message: message
        })
    },
    selectBonus() {
        if (this.data.bonusCount > 0) {
            wx.redirectTo({
                url: '/pages/bonus/select/index?min=' + this.data.carts.totalAmount
            })
        }

    },
    addOrder() {
        wx.showToast({
            title: '提交中...',
            icon: 'loading',
            duration: 10000
        });
        const params = {
            sessionId: App.globalData.sessionId,
            point: this.data.point,
            aid: this.data.address.id,
            bid: this.data.bonus ? this.data.bonus.id : -1,
            pid: this.data.pids[this.data.paymentIndex],
            date: this.data.date + ' 00:00:00',
            time_start: this.data.date + ' ' + this.data.time_s + ':00',
            time_end: this.data.date + ' ' + this.data.time_e + ':00',
            message: this.data.message
        };
        wx.request({
            url: App.globalData.host + 'order/',
            method: 'POST',
            data: params,
            header: {
                SESSIONID: App.globalData.sessionId,
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.hideToast();
                if (res.data.code == 0) {
                    // App.OrderMap.set('orderData.items', []);
                    // wx.showToast({
                    //     title: '提交成功',
                    //     duration: 1000
                    // });
                    // wx.navigateBack({
                    //     delta: 2
                    // });
                    wx.redirectTo({
                        'url': '/pages/cart/success/index'
                    });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.stopPullDownRefresh() //停止下拉刷新
                wx.showToast({
                    title: '服务器错误',
                    duration: 1000
                });
            },
            complete: function () {
                
            }
        });
    },
    bindAccountChange: function (e) {
        this.setData({
            paymentIndex: e.detail.value
        })
    }
})