const App = getApp()

Page({
    data: {
        hidden: !0,
        carts: {},
        address: {
        },
        address_id: -1,
        message: '',
        date: App.dateFormat(new Date(), 'yyyy/MM/dd'),
        time: "09:00",
        accounts: ["微信支付", "货到付款"],
        accountIndex: 0,
    },
    onLoad(option) {
        console.log(option);
        this.setData({
            address_id: option.id
        })

        const carts = {
            items: wx.getStorageSync('confirmOrder'),
            totalAmount: 0,
        }

        carts.items.forEach(n => carts.totalAmount += n.amount * n.itemSpec.shop_price)

        this.setData({
            carts: carts
        })

        console.log(this.data.carts)
    },
    onShow() {
        const address_id = this.data.address_id
        if (address_id) {
            this.getAddressDetail(address_id);
        } else {
            this.getDefalutAddress();
        }
    },
    redirectTo(e) {
        wx.redirectTo({
            url: '/pages/address/confirm/index?ret=' + this.data.address_id
        })
    },
    bindKeyInput(e) {
        console.log(e.detail);
        const message = e.detail.value;
        this.setData({
            message: message
        })
    },
    getDefalutAddress() {
        let that = this;
        wx.request({
            url: App.globalData.host + 'address/getDefaultByUid',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    address_id: res.data.data.id,
                    address: res.data.data
                })
            }
        });
    },
    showModal() {
        wx.showModal({
            title: '友情提示',
            showCancel: true,
            cancelText: '取消',
            content: '没有收货地址，请设置',
            success: function () {
                wx.redirectTo({ url: '/pages/address/add/index' })
            },
            fail: function () {
                wx.navigateBack({
                    delta: 1
                })
            },
            complete: function () {

            }
        });
    },
    getAddressDetail(id) {
        let that = this;
        wx.request({
            url: App.globalData.host + 'address/' + id,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    address_id: res.data.data.id,
                    address: res.data.data
                })
            }
        });
    },
    addOrder() {
        const params = {
            uid: 2,
            aid: this.data.address_id,
            bid: 0,
            pid: 0,
            message: this.data.message
        }
        wx.request({
            url: App.globalData.host + 'order/',
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.showToast({
                    title: '提交成功',
                    duration: 1000
                });
                wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    bindAccountChange: function (e) {
        console.log('picker account 发生选择改变，携带值为', e.detail.value);

        this.setData({
            accountIndex: e.detail.value
        })
    }
})