const App = getApp();

Page({
	data: {
		host: App.globalData.host,
		img_host: App.globalData.img_host,
		userInfo: null,
		hidden: true,
		orderCount: {},
		canIUse: wx.canIUse('button.open-type.contact'),
		is_admin: 0,
		items: [
			{
				icon: '/assets/images/order.png',
				text: '我的订单',
				path: '/pages/order/tabview/index'
			},
			{
				icon: '/assets/images/address.png',
				text: '收货地址',
				path: '/pages/address/list/index'
			},
			{
				icon: '/assets/images/bonus.png',
				text: '优惠券',
				path: '/pages/bonus/tabview/index'
			},
		],
		settings: [
			{
				icon: '/assets/images/qa.png',
				text: '常见问题',
				path: '/pages/help/index',
			},
			{
				icon: '/assets/images/clear.png',
				text: '清除缓存',
				path: '0.0KB'
			},

			{
				icon: '/assets/images/about.png',
				text: '关于我们',
				path: '/pages/about/index'
			},
			
		],
		admin: [
			{
				icon: '/assets/images/admin.png',
				text: '后台管理',
				path: '/pages/admin/index'
			}
		]
	},
	onShareAppMessage: function () {
		return {
			title: '月都商城',
			path: '/page/user/index'
		}
	},
	onPullDownRefresh() {
		let that = this;
		this.getUserInfo();
		wx.request({
			url: App.globalData.host + 'order/orderCount',
			method: 'GET',
			data: {
				sessionId: App.globalData.sessionId
			},
			header: {
				SESSIONID: App.globalData.sessionId,
				'Accept': 'application/json'
			},
			success: function (res) {
				wx.stopPullDownRefresh() //停止下拉刷新
				that.setData({
					orderCount: res.data.data,
					is_admin: res.data.data.admins
				})
			}
		});
	},
	onLoad() {
		let that = this;
		this.getUserInfo();
		try {
			var res = wx.getStorageInfoSync()
			that.setData({
				currentSize: res.currentSize,
				limitSize: res.limitSize
			})
		} catch (e) {
			// Do something when catch error
		}
	},
	onShow() {
		this.onPullDownRefresh();
		this.getUserInfo();
	},
	getUserInfo() {
		let that = this;
		if (null == this.data.userInfo) {
			App.getUserInfo(function (globalData) {
				that.setData({
					userInfo: globalData.userInfo
				});
			});
		}
	},
	navigateTo(e) {
		const index = e.currentTarget.dataset.index
		const path = e.currentTarget.dataset.path
		const tab = e.currentTarget.dataset.tab;
		if (index == 10) {
			wx.navigateTo({
				'url': '/pages/order/tabview/index?activeTab=' + tab
			});
			return;
		}
		wx.navigateTo({ 'url': path })
	},
	bindtap(e) {
		const index = e.currentTarget.dataset.index;
		const path = e.currentTarget.dataset.path;
		switch (index) {
			case 1:
				wx.showModal({
					title: '友情提示',
					showCancel: true,
					cancelText: '取消',
					content: '确定要清除缓存吗？',
					success: function () {
						wx.clearStorage();
					},
					fail: function () {

					},
					complete: function () {

					}
				});
				break
			default:
				wx.navigateTo({ 'url': path });
		}
	},
	bindadmin(e) {
		const index = e.currentTarget.dataset.index;
		const path = e.currentTarget.dataset.path;
		switch (index) {
			default:
				wx.navigateTo({ 'url': path })
		}
	}
})