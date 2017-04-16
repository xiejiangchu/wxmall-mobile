const App = getApp();
var wemark = require('../../assets/wemark/wemark');

Page({
    data: {
        helps: {
        },
        wemark: {}
    },
    onLoad(option) {

    },
    onShow() {
        let that=this;
        wx.request({
            url: App.globalData.host + 'sysConfig/questions',
            method: 'GET',
            header: {
                sessionId: App.globalData.sessionId,
                'Accept': 'application/json'
            },
            data: {

            },
            success: function (res) {
                that.setData({
                    'questions': res.data.data
                });
                wemark.parse(res.data.data.value, that, {
                    imageWidth: wx.getSystemInfoSync().windowWidth - 40,
                    name: 'wemark'
                })
            }
        });
    }
})