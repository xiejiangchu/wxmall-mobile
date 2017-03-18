const App = getApp()

Page({
    data: {
        host: App.globalData.host,
        img_host: App.globalData.img_host,
        address: [],
        paginate: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-addr-empty.png',
            title: '还没有收货地址呢',
            text: '暂时没有相关数据',
        },
    },
    onLoad() {

    },
    onShow() {
        this.getList();
    },
    initData() {
        this.setData({
            address: [],
            params: {
                page: 1,
                limit: 10,
            },
            paginate: {}
        })
    },
    toAddressEdit(e) {
        wx.navigateTo({
            url: '/pages/address/edit/index?id=' + e.currentTarget.dataset.id
        })
    },
    toAddressAdd(e) {
        wx.navigateTo({
            url: '/pages/address/add/index'
        })
    },
    setDefalutAddress(e) {
        const id = e.currentTarget.dataset.id
    },
    getList() {
        var that = this;
        wx.request({
            url: App.globalData.host + '/address/getByUid',
            method: 'GET',
            data: {
                sessionId: App.globalData.sessionId,
                'pageNum': 1,
                'pageSize': 10
            },
            header: {
                sessionId: App.globalData.sessionId,
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    paginate: res.data.data,
                    address: res.data.data.list,
                    'prompt.hidden': res.data.data.list.length
                })
            }
        })
    },
    onPullDownRefresh() {
        this.getList();
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.address.paginate.hasNextPage) return
        this.getList()
    },
})