const App = getApp()

Page({
    data: {
        sysConfig: []
    },
    onLoad() {
        let that = this;
        wx.request({
            url: App.globalData.host + 'sysConfig/list',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                console.log(res.data.data);
                that.setData({
                    sysConfig: res.data.data
                })
            }
        });

    }
})