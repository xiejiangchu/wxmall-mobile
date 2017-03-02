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
        var that = this;
        var pageNum = 1;
        var pageSize = 10;
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
                var paginat_n = res.data.data;
                if (!paginat_n.isFirstPage) {
                    paginat_n.list = paginat_n.list.concat(that.data.paginate.list);
                } else {
                    paginat_n = res.data.data;
                }
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
        this.getList();
    },
    onReachBottom() {
        if (!this.data.paginate.hasNextPage)
            return
        this.getList();
    },
    navigateTo(e) {
        wx.navigateTo({
            url: '/pages/goods/detail/index?id=' + e.currentTarget.dataset.id

        })
    },
})