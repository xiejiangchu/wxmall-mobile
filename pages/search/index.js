const App = getApp()

Page({
    data: {
        inputVal: '',
        paginate: {},
        list: []
    },
    clearInput() {
        this.setData({
            inputVal: ''
        })
    },
    inputTyping(e) {
        this.setData({
            inputVal: e.detail.value
        })
        this.search();
    },
    search() {
        if (!this.data.inputVal)
            return
        let that = this;
        let pageNum = 1;
        let pageSize = 10;
        if (this.paginate) {
            pageNum = this.paginate.nextPage;
        }
        wx.request({
            url: App.globalData.host + 'item/search',
            method: 'GET',
            data: {
                keyword: this.data.inputVal,
                pageNum: pageNum,
                pageSize: pageSize,
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.stopPullDownRefresh();
                let paginat_n = res.data.data;
                that.setData({
                    paginate: paginat_n,
                    list: res.data.data.list,
                    'prompt.hidden': res.data.data.list.length
                })
            }
        });
    },
    onPullDownRefresh() {
        this.data.pageNum = 1;
        this.search();
    },
    onReachBottom() {
        if (!this.data.paginate.hasNextPage) {
            return;
        }
        this.getMore(this.data.paginate.nextPage);
    },
    getMore(page) {
        let that = this;
        let pageNum = page;
        let pageSize = 10;
        wx.request({
            url: App.globalData.host + 'item/search',
            method: 'GET',
            data: {
                keyword: this.data.inputVal,
                pageNum: pageNum,
                pageSize: pageSize,
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                let paginat_n = res.data.data;
                if (!paginat_n.isFirstPage) {
                    paginat_n.list = that.data.paginate.list.concat(paginat_n.list);
                } else {
                    paginat_n = res.data.data;
                }
                that.setData({
                    paginate: paginat_n,
                    list: paginat_n.list,
                    'prompt.hidden': paginat_n.list.length
                });
                wx.stopPullDownRefresh();
            }
        });
    },
    navigateTo(e) {
        wx.navigateTo({
            url: '/pages/goods/detail/index?id=' + e.currentTarget.dataset.id

        })
    },
})