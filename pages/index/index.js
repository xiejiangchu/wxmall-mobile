const App = getApp();

Page({
    data: {
        host: App.globalData.host,
        img_host: App.globalData.img_host,
        activeIndex: 0,
        indicatorDots: !0,
        autoplay: true,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !0,
        paginate: {},
        orderby: 0,
        prompt: {
            hidden: 0,
        },
        left: 0,
        'cartMap': {},
        loading: false,

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
        this.getBanner();
        this.getList();

        // setInterval(function () {
        //     let left = this.data.left - 2;
        //     this.setData({
        //         'left': left
        //     })
        // }.bind(this), 50);
    },
    getBanner() {
        let that = this;
        wx.request({
            url: App.globalData.host + 'banner/list',
            method: 'GET',
            data: {

            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                that.setData({
                    banners: res.data.data
                })
            }
        });
    },
    onShow() {
        this.setData({
            'carts.items': App.OrderMap.get('orderData.items')
        });
        this.getCart();
    },
    slideClick(e) {
        let id = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: '/pages/goods/detail/index?id=' + id
        })
    },
    getCart() {
        let that = this;
        wx.request({
            url: App.globalData.host + 'cart/item/',
            method: 'GET',
            data: {
                sessionId: App.globalData.sessionId
            },
            header: {
                SESSIONID: App.globalData.sessionId,
                'Accept': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 0) {
                    res.data.data.forEach(function (item, index) {
                        item.total = item.amount * item.itemSpec.shop_price;
                        item.total = item.total.toFixed(2);
                    });
                    that.setData({
                        'carts.items': res.data.data
                    });
                    App.OrderMap.set('orderData.items', res.data.data);
                    that.initNumber();
                };
            }
        });
    },
    initNumber() {
        let cartMap = {};
        if (this.data.carts.items && this.data.carts.items.length > 0) {
            this.data.carts.items.forEach(function (item, index) {
                cartMap[item.gid + "_" + item.spec] = item.amount;
            });
            this.setData({
                'cartMap': cartMap
            });
        } else {
            this.setData({
                'cartMap': cartMap
            });
        }
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
        this.getBanner();
    },
    onReachBottom() {
        if (!this.data.paginate.hasNextPage)
            return
        this.getListMore();
    },
    getList() {
        var that = this;
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 10000
        });
        wx.request({
            url: App.globalData.host + 'item/list',
            method: 'GET',
            data: {
                orderby: that.data.orderby,
                'pageNum': 1,
                'pageSize': 12
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.stopPullDownRefresh() //停止下拉刷新
                if (res.data.code == 0) {
                    that.setData({
                        paginate: res.data.data,
                        'prompt.hidden': res.data.data.size
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg || '服务器错误',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '服务器错误',
                    duration: 1000
                });
            },
            complete: function () {
                wx.hideToast();
            }
        })
    },
    getListMore() {
        var that = this;
        wx.request({
            url: App.globalData.host + 'item/list',
            method: 'GET',
            data: {
                orderby: that.data.orderby,
                'pageNum': that.data.paginate.nextPage,
                'pageSize': that.data.paginate.pageSize
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.stopPullDownRefresh() //停止下拉刷新
                if (res.data.code == 0) {
                    var paginat_n = res.data.data;
                    paginat_n.list = that.data.paginate.list.concat(paginat_n.list);
                    that.setData({
                        paginate: paginat_n,
                        'prompt.hidden': res.data.data.list.length
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg || '服务器错误',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '服务器错误',
                    duration: 1000
                });
            },
            complete: function () {

            }
        })
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
                                "id": 10,
                                "title": "字典正序",
                            },
                            {
                                "id": 11,
                                "title": "字典反序",
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "title": "按上架时间",
                        "cate_two": [
                            {
                                "id": 20,
                                "title": "由新到旧",
                            },
                            {
                                "id": 21,
                                "title": "由旧到新",
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "title": "按商品类别",
                        "cate_two": [
                            {
                                "id": 30,
                                "title": "由低到高",
                            },
                            {
                                "id": 31,
                                "title": "由高到低",
                            }
                        ]
                    },
                    {
                        "id": 8,
                        "title": "按商品价格",
                        "cate_two": [
                            {
                                "id": 80,
                                "title": "由高到低",
                            },
                            {
                                "id": 81,
                                "title": "由低到高",
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "title": "按商品销量",
                        "cate_two": [
                            {
                                "id": 90,
                                "name": "由高到低"
                            },
                            {
                                "id": 91,
                                "name": "由低到高"
                            }
                        ]
                    }
                ]
            }
        })
    },
    setFilterPanel: function (e) {
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
    },
    setCateIndex: function (e) {
        const d = this.data;
        const dataset = e.currentTarget.dataset;
        this.setData({
            cateindex: dataset.cateindex,
            cateid: dataset.cateid,
            subcateindex: d.cateindex == dataset.cateindex ? d.subcateindex : 0
        });
        if (!d.filterdata.cate[d.cateindex].cate_two) {
            console.log('aaaa');
            this.hideFilter();
            this.setData({
                orderby: this.data.cateid
            });
            this.getList();
        }
    },
    setSubcateIndex: function (e) {
        const dataset = e.currentTarget.dataset;
        this.setData({
            subcateindex: dataset.subcateindex,
            subcateid: dataset.subcateid,
        });
        this.hideFilter();
        this.setData({
            orderby: this.data.subcateid
        });
        this.getList();
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
            desc: '月都商城小程序购物',
            path: '/pages/index/index'
        }
    },
    addCart(e) {
        let gid = e.currentTarget.dataset.gid;
        let spec = e.currentTarget.dataset.spec;
        let index = e.currentTarget.dataset.index;
        let step = e.currentTarget.dataset.step;
        let specindex = e.currentTarget.dataset.specindex;
        let amount = step;
        if (this.data.cartMap.hasOwnProperty(gid + "_" + spec)) {
            amount = this.data.cartMap[gid + "_" + spec] + step;
        }
        if (amount > this.data.paginate.list[index].itemSpecList[specindex].max) {
            amount = this.data.paginate.list[index].itemSpecList[specindex].max;
            return;
        }
        if (amount < this.data.paginate.list[index].itemSpecList[specindex].min) {
            amount = this.data.paginate.list[index].itemSpecList[specindex].min;
        }
        this.putCartByUser(gid, {
            amount: amount,
            spec: spec
        })
    },
    putCartByUser(gid, params) {
        let that = this;
        if (that.data.loading)
            return;
        that.data.loading = true;
        wx.request({
            url: App.globalData.host + 'cart/update',
            method: 'PUT',
            data: {
                sessionId: App.globalData.sessionId,
                gid: gid,
                spec: params.spec,
                amount: params.amount
            },
            header: {
                SESSIONID: App.globalData.sessionId,
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        'carts.items': res.data.data
                    });
                    App.OrderMap.set('orderData.items', res.data.data);
                    that.initNumber();
                } else {
                    wx.showToast({
                        title: res.data.msg || '服务器错误',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '服务器错误',
                    duration: 1000
                });
            },
            complete: function () {
                that.data.loading = false;
            }
        });
    },
    subCart(e) {
        let gid = e.currentTarget.dataset.gid;
        let spec = e.currentTarget.dataset.spec;
        let index = e.currentTarget.dataset.index;
        let step = e.currentTarget.dataset.step;
        let specindex = e.currentTarget.dataset.specindex;
        let amount = 0;
        if (this.data.cartMap.hasOwnProperty(gid + "_" + spec)) {
            amount = this.data.cartMap[gid + "_" + spec] - step;
        }
        if (amount > this.data.paginate.list[index].itemSpecList[specindex].max) {
            amount = this.data.paginate.list[index].itemSpecList[specindex].max;
            return;
        }
        if (amount < this.data.paginate.list[index].itemSpecList[specindex].min) {
            amount = this.data.paginate.list[index].itemSpecList[specindex].min;
        }
        this.putCartByUser(gid, {
            amount: amount,
            spec: spec
        })
    },
})
