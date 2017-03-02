var app = getApp()
Page({
    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 1200,
    },

    onLoad: function(options) {

        var that = this
        
        // 商品详情
        wx.request({
            url: app.globalData.host + 'item/' + options.id,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function(res) {
                that.setData({
                    goodsPicsInfo: goodsPicsInfo
                })
            }
        })

    }
})
