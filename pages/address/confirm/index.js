const App = getApp()

Page({
    data: {
        hidden: !0,
        address: {}
    },
    onLoad(option) {
        console.log(option)
        this.setData({
            ret: option.ret
        })
    },
    onShow() {
        this.onPullDownRefresh()
    },
    initData() {
        this.setData({
            params: {
                'uid': 2,
                pageNum: 1,
                pageSize: 10,
            }
        })
    },
    radioChange(e) {
        wx.redirectTo({
            url: '/pages/order/confirm/index?id=' + e.detail.value
        })
    },
    getAddressList() {
        const params = this.data.params
        this.setData({
            hidden: !1
        })
        var that = this;
        wx.request({
            url: App.globalData.host + '/address/getByUid',
            method: 'GET',
            data: params,
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    paginate: res.data.data,
                    address: res.data.data.list,
                    'hidden': res.data.data.list.length
                })
            }
        })
    },
    onPullDownRefresh() {
        this.initData();
        this.getAddressList();
    },
    onReachBottom() {
        this.lower()
    },
    lower() {
        if (!this.data.paginate.hasNextPage)
            return
        this.getAddressList()
    },
})