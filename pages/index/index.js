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
        sellindex: 0,  //一级城市索引
        sellid: null,  //一级城市id
        subsellindex: 0,  //二级城市索引
        subsellid: null, //二级城市id
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onLoad() {
        this.fetchFilterData();
        //banner
        let that = this;
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
                        "title": "推荐排序"
                    },
                    {
                        "id": 1,
                        "title": "按商品名称",
                        "cate_two": [
                            {
                                "id": 11,
                                "title": "字典正序",
                            },
                            {
                                "id": 10,
                                "title": "字典反序",
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "按上架时间",
                        "cate_two": [
                            {
                                "id": 21,
                                "title": "由新到旧",
                            },
                            {
                                "id": 20,
                                "title": "由旧到新",
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "title": "按商品类别",
                        "cate_two": [
                            {
                                "id": 21,
                                "title": "由低到高",
                            },
                            {
                                "id": 20,
                                "title": "由高到低",
                            }
                        ]
                    }

                ],
                "sell": [
                    {
                        "id": 7,
                        "name": "不限"
                    },
                    {
                        "id": 8,
                        "title": "按价格",
                        "cate_two": [
                            {
                                "id": 21,
                                "title": "由高到低",
                            },
                            {
                                "id": 20,
                                "title": "由低到高",
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "name": "销量",
                        "cate_two": [
                            {
                                "id": 91,
                                "name": "由高到低"
                            },
                            {
                                "id": 90,
                                "name": "由低到高"
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
        });
    },
    setSubcateIndex: function (e) { //分类二级索引
        const dataset = e.currentTarget.dataset;
        this.setData({
            subcateindex: dataset.subcateindex,
            subcateid: dataset.subcateid,
        });
        this.hideFilter();
        console.log('商家分类：一级id__' + this.data.cateid + ',二级id__' + this.data.subcateid);
    },
    setSellIndex: function (e) { //地区一级索引
        const d = this.data;
        const dataset = e.currentTarget.dataset;
        this.setData({
            sellindex: dataset.sellindex,
            sellid: dataset.sellid,
            subsellindex: d.sellindex == dataset.sellindex ? d.subsellindex : 0
        })
        console.log('所在地区：一级id__' + this.data.sellid + ',二级id__' + this.data.subsellid);
    },
    setSubsellIndex: function (e) { //地区二级索引
        const dataset = e.currentTarget.dataset;
        this.setData({
            subsellindex: dataset.subsellindex,
            subsellid: dataset.subsellid,
        })
        console.log('所在地区：一级id__' + this.data.sellid + ',二级id__' + this.data.subsellid);
    },
    hideFilter: function () { //关闭筛选面板
        this.setData({
            showfilter: false,
            showfilterindex: null
        })
    },
    onShareAppMessage: function () {
        return {
            title: '月都商城',
            path: '/page/index/index'
        }
    }
})
