const App = getApp()

Page({
    data: {
        hidden: !0,
        carts: {},
        address: null,
        message: '',
        date: App.dateFormat(new Date(), 'yyyy/MM/dd'),
        date_start: App.dateFormat(new Date(), 'yyyy/MM/dd'),
        date_end: null,
        time_start: "09:00",
        time_end: "11:00",
        payments: ["微信支付", "货到付款"],
        pids: [1, 2],
        paymentIndex: 0,
        bonusCount: 0,
        bonus: {
            id: -1
        }
    },
    onLoad(option) {
        let now = new Date();
        let day_end = now.setDate(now.getDate() + 7);
        this.setData({
            bonus: wx.getStorageSync('orderData.bonus'),
            address: wx.getStorageSync('orderData.address'),
            date_start: App.dateFormat(wx.getStorageSync('orderData.orderCheckDto').date_start, 'yyyy/MM/dd'),
            date_end: App.dateFormat(wx.getStorageSync('orderData.orderCheckDto').date_end, 'yyyy/MM/dd'),
            time_start: wx.getStorageSync('orderData.orderCheckDto').time_start,
            time_end: wx.getStorageSync('orderData.orderCheckDto').time_end,
            bonusCount: wx.getStorageSync('orderData.orderCheckDto').bonusCount
        });

        let carts = {
            items: wx.getStorageSync('orderData.items'),
            totalAmount: wx.getStorageSync('orderData.orderCheckDto').totalAmount,
            bonus: 0,
            point: 0,
            total: wx.getStorageSync('orderData.orderCheckDto').totalAmount
        }
        if (this.data.bonus) {
            carts.bonus = this.data.bonus.money;
            carts.total = (carts.total - carts.bonus).toFixed(2);
        }
        this.setData({
            carts: carts
        })
    },
    onShow() {
    },
    selectAddress(e) {
        wx.redirectTo({
            url: '/pages/address/confirm/index?ret=' + this.data.address_id
        })
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value
        })
    },
    bindTimeChangeStart: function (e) {
        this.setData({
            time_start: e.detail.value
        })
    },
    bindTimeChangeEnd: function (e) {
        this.setData({
            time_end: e.detail.value
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
        const params = {
            sessionId: App.globalData.sessionId,
            aid: this.data.address.id,
            bid: this.data.bonus ? this.data.bonus.id : -1,
            pid: this.data.pids[this.data.paymentIndex],
            date: this.data.date + ' 00:00:00',
            time_start: this.data.date + ' ' + this.data.time_start + ':00',
            time_end: this.data.date + ' ' + this.data.time_end + ':00',
            message: this.data.message
        }
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
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '提交成功',
                        duration: 1000
                    });
                    wx.navigateBack({
                        delta: 1
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
    bindAccountChange: function (e) {
        this.setData({
            paymentIndex: e.detail.value
        })
    }
})