const App = getApp();

Page({
    data: {
        host: App.globalData.host,
        img_host: App.globalData.img_host,
        activeIndex: 0,
        indicatorDots: !0,
        autoplay: !1,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !0,
        paginate: {},
        prompt: {
            hidden: 0,
        },

        filterdata: {},  //筛选条件数据
        showfilter: false, //是否显示下拉筛选
        showfilterindex: null, //显示哪个筛选类目
        cateindex: 0,  //一级分类索引
        cateid: null,  //一级分类id
        subcateindex: 0, //二级分类索引
        subcateid: null, //二级分类id
        areaindex: 0,  //一级城市索引
        areaid: null,  //一级城市id
        subareaindex: 0,  //二级城市索引
        subareaid: null, //二级城市id
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onLoad() {
        this.fetchFilterData();
        //banner
        var that = this;
        wx.request({
            url: App.globalData.host + 'banner/list',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    banners: res.data.data
                })
            }
        });
        //list
        wx.request({
            url: App.globalData.host + 'item/list',
            method: 'GET',
            data: {
                'pageNum': 1,
                'pageSize': 10
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    paginate: res.data.data,
                    'prompt.hidden': res.data.data.list.length
                })
            }
        });
        let sessionId = wx.getStorageSync('sessionId');
        if (sessionId) {
            wx.request({
                url: App.globalData.host + 'user/login',
                method: 'GET',
                data: {
                    sessionId: sessionId
                },
                header: {
                    'Accept': 'application/json'
                },
                success: function (res) {
                    if (res.data.code == 0) {
                        App.globalData.sessionId = res.data.data.sessionId;
                        App.globalData.uid = res.data.data.uid;
                    } else {
                        App.getUserInfo(function (userInfo) {
                            that.get3rdSession();
                        });
                    }
                }
            })
        } else {
            App.getUserInfo(function (userInfo) {
                that.get3rdSession();
            });
        }
    },
    get3rdSession: function () {
        let that = this
        wx.request({
            url: App.globalData.host + 'user/get3rdSession',
            method: 'GET',
            data: {
                code: App.globalData.wxcode,
                encryptedData: App.globalData.encryptedData,
                iv: App.globalData.iv
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                App.globalData.sessionId = res.data.data.sessionId;
                App.globalData.uid = res.data.data.uid;
                wx.setStorageSync('sessionId', sessionId);
            }
        })
    },
    onShow() {

    },
    navigateTo(e) {
        wx.navigateTo(
            {
                url: '/pages/goods/detail/index?id=' + e.currentTarget.dataset.id

            })
    },
    search() {
        wx.navigateTo({
            url: '/pages/search/index'
        })
    },
    onPullDownRefresh() {
        wx.showNavigationBarLoading() //在标题栏中显示加载
        this.getList();
    },
    onReachBottom() {
        if (!this.data.paginate.hasNextPage)
            return
        this.getList();
    },
    getList() {
        var that = this;
        wx.request({
            url: App.globalData.host + 'item/list',
            method: 'GET',
            data: {
                'pageNum': that.data.paginate.nextPage,
                'pageSize': that.data.paginate.pageSize
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.stopPullDownRefresh() //停止下拉刷新
                var paginat_n = res.data.data;
                paginat_n.list = that.data.paginate.list.concat(paginat_n.list);
                that.setData({
                    paginate: paginat_n,
                    'prompt.hidden': res.data.data.list.length
                })
            }
        })
    },
    onTapTag(e) {
        const type = e.currentTarget.dataset.type
        const index = e.currentTarget.dataset.index
        const goods = {
            items: [],
            params: {
                page: 1,
                limit: 10,
                type: type,
            },
            paginate: {}
        }
        this.setData({
            activeIndex: index,
            goods: goods,
        })
        this.getList()
    },
    fetchFilterData: function () { //获取筛选条件
        this.setData({
            filterdata: {
                "cate": [
                    {
                        "id": 0,
                        "title": "全部"
                    },
                    {
                        "id": 1,
                        "title": "按名称顺序"
                    },
                    {
                        "id": 1,
                        "title": "按名称倒序"
                    },
                    {
                        "id": 1,
                        "title": "价格由低到高"
                    },
                    {
                        "id": 2,
                        "title": "价格由高到低"
                    }
                ],
                "area": [
                    {
                        "id": 0,
                        "name": "全城"
                    },
                    {
                        "id": 12,
                        "name": "黄浦区",
                        "zone": [
                            {
                                "id": 0,
                                "name": "全部"
                            },
                            {
                                "id": 38,
                                "name": "董家渡"
                            },
                            {
                                "id": 39,
                                "name": "外滩"
                            },
                            {
                                "id": 40,
                                "name": "城隍庙"
                            },
                            {
                                "id": 41,
                                "name": "老西门"
                            },
                            {
                                "id": 42,
                                "name": "南京东路"
                            },
                            {
                                "id": 43,
                                "name": "人民广场"
                            }
                        ]
                    }
                ]
            }
        })
    },
    setFilterPanel: function (e) { //展开筛选面板
        const d = this.data;
        const i = e.currentTarget.dataset.findex;
        if (d.showfilterindex == i) {
            this.setData({
                showfilter: false,
                showfilterindex: null
            })
        } else {
            this.setData({
                showfilter: true,
                showfilterindex: i,
            })
        }
        console.log('显示第几个筛选类别：' + d.showfilterindex);
    },
    setCateIndex: function (e) { //分类一级索引
        const d = this.data;
        const dataset = e.currentTarget.dataset;
        this.setData({
            cateindex: dataset.cateindex,
            cateid: dataset.cateid,
            subcateindex: d.cateindex == dataset.cateindex ? d.subcateindex : 0
        })
        console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
    },
    setSubcateIndex: function (e) { //分类二级索引
        const dataset = e.currentTarget.dataset;
        this.setData({
            subcateindex: dataset.subcateindex,
            subcateid: dataset.subcateid,
        })
        console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
    },
    setAreaIndex: function (e) { //地区一级索引
        const d = this.data;
        const dataset = e.currentTarget.dataset;
        this.setData({
            areaindex: dataset.areaindex,
            areaid: dataset.areaid,
            subareaindex: d.areaindex == dataset.areaindex ? d.subareaindex : 0
        })
        console.log('所在地区：一级id__' + this.data.areaid + ',二级id__' + this.data.subareaid);
    },
    setSubareaIndex: function (e) { //地区二级索引
        const dataset = e.currentTarget.dataset;
        this.setData({
            subareaindex: dataset.subareaindex,
            subareaid: dataset.subareaid,
        })
        console.log('所在地区：一级id__' + this.data.areaid + ',二级id__' + this.data.subareaid);
    },
    hideFilter: function () { //关闭筛选面板
        this.setData({
            showfilter: false,
            showfilterindex: null
        })
    }
})
