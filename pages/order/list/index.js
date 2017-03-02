const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        order: {},
        prompt: {
            hidden: !0,
            icon: '/assets/images/iconfont-order-default.png',
            title: '您还没有相关的订单',
            text: '可以去看看有哪些想买的',
        },
    },
    onLoad() {
        this.setData({
            navList: [
                {
                    name: '待支付',
                    type: '10',
                },
                {
                    name: '待发货',
                    type: '20',
                },
                {
                    name: '待收货',
                    type: '30',
                },
                {
                    name: '已完成',
                    type: '40',
                },
            ]
        })
    },
    onShow() {
        this.onPullDownRefresh()
    },
    initData() {
        const order = this.data.order;
        const params = order && order.params;
        const type = params && params.type || '20';

        this.setData({
            order: {
                paginate: {},
                params: {
                    pageNum: 1,
                    pageSize: 10,
                    type: type,
                }
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        wx.navigateTo({
            url: '/pages/order/detail/index?id=' + e.currentTarget.dataset.id
        })
    },
    getList() {
        let that = this;
        wx.request({
            url: App.globalData.host + 'order/list',
            method: 'GET',
            data: that.data.order.params,
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    paginate: res.data.data,
                    'prompt.hidden': res.data.data.list.length
                })
            }
        })
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData();
        this.getList();
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.paginate.hasNextPage) return
        this.getList();
    },
    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({
            activeIndex: index,
            'order.params.type': type,
        })
        this.getList()
    },
})