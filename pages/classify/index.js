var app = getApp()
Page({
    data: {
        host: app.globalData.host,
        img_host: app.globalData.img_host,
        navTopItems: [],
        navLeftItems: [],
        navRightItems: [],
        curIndex: 0,
        params: {
            cid1: null,
            cid2: null,
            pageNum: 1,
            pageSize: 10
        }
    },
    onShareAppMessage: function () {
        return {
            title: '月都商城',
            path: '/page/classify/index'
        }
    },
    onLoad: function () {
        var that = this;
        wx.request({
            url: app.globalData.host + 'category/getCategoryLevel1',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    navTopItems: res.data.data,
                    navLeftItems: res.data.data[0].cid2List,
                    'params.cid1': res.data.data[0].id,
                    'params.cid2': res.data.data[0].cid2List[0].id
                })
                that.initData();
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
    initData() {
        var that = this;
        wx.request({
            url: app.globalData.host + 'item/getByCategory',
            method: 'GET',
            data: that.data.params,
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    'params.pageNum': res.data.data.pageNum,
                    navRightItems: res.data.data.list
                });
                wx.stopPullDownRefresh()
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
    //事件处理函数
    switchLevel2: function (e) {
        var that = this;
        if (e) {
            let id = e.target.dataset.id,
                index = parseInt(e.target.dataset.index);
            this.setData({
                'params.cid2': id
            });
        } else {
            let id = this.data.navLeftItems[0].id;
            this.setData({
                'params.cid2': id
            });
        }


        wx.request({
            url: app.globalData.host + 'item/getByCategory',
            method: 'GET',
            data: that.data.params,
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    'params.pageNum': res.data.data.pageNum,
                    navRightItems: res.data.data.list
                })
            }
        });
    },
    onPullDownRefresh() {
        this.initData();
    },
    navigateTo(e) {
        wx.navigateTo(
            {
                url: '/pages/goods/detail/index?id=' + e.currentTarget.dataset.id

            })
    },
    switchLevel1: function (e) {
        var that = this;
        let id = e.target.dataset.id,
            index = parseInt(e.target.dataset.index);
        this.setData({
            'params.cid1': id
        });
        wx.request({
            url: app.globalData.host + 'category/getCategoryLevel2/' + that.data.params.cid1,
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    navLeftItems: res.data.data,
                    navRightItems: []
                });
                if (res.data.data.length > 0) {
                    that.switchLevel2();
                }
            }
        });
    }

})