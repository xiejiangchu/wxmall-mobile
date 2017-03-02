const App = getApp()

Page({
    data: {
        canEdit: !1,
        img_host: App.globalData.img_host,
        carts: {
            items: [],
            total:0
        },
        prompt: {
            hidden: !0,
            icon: '../../assets/images/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '来挑几件好货吧',
            buttons: [
                {
                    text: '随便逛',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    bindtap: function (e) {
        const index = e.currentTarget.dataset.index
        switch (index) {
            case 0:
                wx.switchTab({
                    url: '/pages/index/index'
                })
                break
            default:
                break
        }
    },
    onLoad() {
    },
    onShow() {
        this.getCarts();
    },
    getCarts() {
        var that = this;
        wx.request({
            url: App.globalData.host + 'cart/item/2',
            method: 'GET',
            data: {},
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                let total=0;
                res.data.data.forEach(n =>  total += n.amount * n.itemSpec.shop_price);
                that.setData({
                    'carts.items': res.data.data,
                    'prompt.hidden': res.data.data.length == 0 ? false : true,
                    'carts.total':total
                });
                
                
            }
        });
    },
    onPullDownRefresh() {
        this.getCarts();
    },
    navigateTo(e) {
        wx.navigateTo({
            url: '/pages/goods/detail/index/id=' + e.currentTarget.dataset.id
        })
    },
    confirmOrder(e) {
        console.log(e)
        wx.setStorageSync('confirmOrder', this.data.carts.items)
        wx.navigateTo({
            url: '/pages/order/confirm/index'
        })
    },
    del(e) {
        let that = this;
        const id = e.currentTarget.dataset.id
        const spec = e.currentTarget.dataset.spec;
        wx.showModal({
            title: '友情提示',
            showCancel: true,
            cancelText: '取消',
            content: '确定要删除该商品吗？',
            success: function () {
                wx.request({
                    url: App.globalData.host + 'cart/update',
                    method: 'PUT',
                    data: {
                        uid: 2,
                        gid: id,
                        spec: spec,
                        amount: 0
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    success: function (res) {
                        that.getCarts();
                    }
                });
            },
            fail: function () {

            },
            complete: function () {

            }
        });
    },
    clear() {
        let that = this;
        wx.showModal({
            title: '友情提示',
            showCancel: true,
            cancelText: '取消',
            content: '确定要清空购物车吗？',
            success: function () {
                wx.request({
                    url: App.globalData.host + 'cart/clear',
                    method: 'PUT',
                    data: {
                        uid: 2
                    },
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    success: function (res) {
                        that.getCarts();
                    }
                });
            },
            fail: function () {

            },
            complete: function () {

            }
        });
    },
    onTapEdit(e) {
        this.setData({
            canEdit: !!e.currentTarget.dataset.value
        })
    },
    bindKeyInput(e) {
        const spec = e.currentTarget.dataset.spec;
        const id = e.currentTarget.dataset.id;
        const amount = Math.abs(e.detail.value)
        if (amount < 0 || amount > 100) return
        this.putCartByUser(id, {
            amount: amount,
            spec: spec
        })
    },
    putCartByUser(id, params) {
        let that = this;

        wx.request({
            url: App.globalData.host + 'cart/update',
            method: 'PUT',
            data: {
                uid: 2,
                gid: id,
                spec: params.spec,
                amount: params.amount
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (res) {
                that.getCarts();
            }
        });
    },
    decrease(e) {
        const spec = e.currentTarget.dataset.spec;
        const id = e.currentTarget.dataset.id
        const amount = Math.abs(e.currentTarget.dataset.amount)
        if (amount == 1) return
        this.putCartByUser(id, {
            amount: amount - 1,
            spec: spec
        })
    },
    increase(e) {
        const spec = e.currentTarget.dataset.spec;
        const id = e.currentTarget.dataset.id
        const amount = Math.abs(e.currentTarget.dataset.amount)
        if (amount == 100) return
        this.putCartByUser(id, {
            amount: amount + 1,
            spec: spec
        })
    },
})