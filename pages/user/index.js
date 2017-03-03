const App = getApp()

Page({
	data: {
		host: App.globalData.host,
		img_host: App.globalData.img_host,
		userInfo: {},
		'hidden': true,
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
				path: '18521708248',
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
	onLoad() {
		var that = this;
		//调用应用实例的方法获取全局数据
		App.getUserInfo(function (userInfo) {
			//更新数据
			that.setData({
				userInfo: userInfo
			})
		});
	},
	onShow() {
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
				wx.makePhoneCall({
					phoneNumber: path
				})
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