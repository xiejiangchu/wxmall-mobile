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
                let order = res.data.data;
                order.created_at = App.dateFormat(order.created_at, 'yyyy-MM-dd HH:mm:ss')
                that.setData({
                    order: order
                })
            }
        })
    },
})