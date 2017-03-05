const App = getApp()

Page({
	data: {
		img_host: App.globalData.img_host,
		logged: !1
	},
	onLoad() { },
	onShow() {
		const token = wx.getStorageSync('token')
		this.setData({
			logged: !!token
		})
		token && setTimeout(this.goIndex, 1500)
	},
	login() {
		// this.signIn(this.goIndex)
		this.goIndex();
	},
	goIndex() {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},
	showModal() {
		wx.showModal({
			title: '友情提示',
			content: '获取用户登录状态失败，请重新登录',
			showCancel: !1,
		})
	},
	wechatDecryptData() {

	},
	wechatSignIn(cb) {
		if (wx.getStorageSync('token'))
			return
	},
	wechatSignUp(cb) {
		wx.login({
			success: function (res) {
				if (res.code) {
					//发起网络请求
					wx.request({
						url: 'https://test.com/onLogin',
						data: {
							code: res.code
						}
					})
				} else {
					console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		});
	},
	signIn(cb) {
		if (wx.getStorageSync('token')) return
		App.HttpService.signIn({
			username: 'admin',
			password: '123456',
		})
			.then(data => {
				console.log(data)
				if (data.meta.code == 0) {
					wx.setStorageSync('token', data.data.token)
					cb()
				}
			})
	},
})