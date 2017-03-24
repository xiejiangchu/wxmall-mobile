const App = getApp();

Page({
	data: {
		host: App.globalData.host,
		img_host: App.globalData.img_host,
		userInfo: {},
		'hidden': true,
		orderCount: {},
		items: [
			{
				icon: '/assets/images/iconfont-order.png',
				text: '我的订单',
				path: '/pages/order/tabview/index'
			},
			{
				icon: '/assets/images/iconfont-addr.png',
				text: '收货地址',
				path: '/pages/address/list/index'
			},
			{
				icon: '/assets/images/iconfont-bonus.png',
				text: '优惠券',
				path: '/pages/bonus/tabview/index'
			},
			{
				icon: '/assets/images/iconfont-kefu.png',
				text: '联系客服',
				path: '15121030453',
			},
			{
				icon: '/assets/images/iconfont-help.png',
				text: '常见问题',
				path: '/pages/help/list/index',
			},
		],
		settings: [
			{
				icon: '/assets/images/iconfont-clear.png',
				text: '清除缓存',
				path: '0.0KB'
			},
			{
				icon: '/assets/images/iconfont-about.png',
				text: '关于我们',
				path: '/pages/about/index'
			},
		]
	},
	onShareAppMessage: function () {
		return {
			title: '月都商城',
			path: '/page/user/index'
		}
	},
	onPullDownRefresh() {
		var that = this;
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
					orderCount: res.data.data
				})
			}
		});
	},
	onLoad() {
		let that = this;
		App.getUserInfo(function (globalData) {
			that.setData({
				userInfo: globalData.userInfo
			});
		});
	},
	onShow() {
		var that = this;
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
					orderCount: res.data.data
				})
			}
		});
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
		switch (index) {
			case 3:
				wx.showModal({
					title: '友情提示',
					showCancel: true,
					cancelText: '取消',
					content: '确定要联系客服吗？',
					success: function (res) {
						if (res.confirm) {
							wx.makePhoneCall({
								phoneNumber: path
							});
						}
					},
					fail: function () {

					},
					complete: function () {

					}
				});

				break
			default:
				wx.navigateTo({ 'url': path })
		}
	},
	bindtap(e) {
		const index = e.currentTarget.dataset.index;
		const path = e.currentTarget.dataset.path;
		switch (index) {
			case 0:
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
	logout() {
		this.setData({
			'hidden': false
		})
	},
	confirm() {
		this.setData({
			'hidden': true
		})
	},
	cancel() {
		this.setData({
			'hidden': true
		})
	},
	signOut() {

	},
})