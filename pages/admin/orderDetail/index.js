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
                SESSIONID: App.globalData.sessionId,
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
                        title: res.data.msg,
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