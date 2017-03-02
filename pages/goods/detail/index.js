const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        id: 24113,
        item: {}
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onLoad(option) {
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },
    addCart(e) {
        if (!this.data.tid) {
            wx.showToast({
                title: '请选择规格',
                duration: 1000
            });
            return;
        }

        var that = this;
        wx.request({
            url: App.globalData.host + 'cart/update',
            method: 'PUT',
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            data: {
                uid: 2,
                gid: that.data.id,
                spec: that.data.tid,
                amount: 10
            },
            success: function (res) {
                wx.showToast({
                title: '加入成功',
                duration: 1000
            });
            }
        });
    },
    previewImage(e) {

    },
    switchType(e) {
        const tid = e.currentTarget.dataset.tid;
        this.setData({
            tid: tid
        });
    },
    getDetail(id) {
        var that = this;
        wx.request({
            url: App.globalData.host + 'item/' + id,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    item: res.data.data
                })
            }
        });
    },
})