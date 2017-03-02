const App = getApp()

Page({
	data: {
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
		this.signIn(this.goIndex)
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
		let code

		wx.login()
			.then(data => {
				console.log('wechatDecryptData', data.code)
				code = data.code
				return wx.getUserInfo()
			})
			.then(data => {
				return App.HttpService.wechatDecryptData({
					encryptedData: data.encryptedData,
					iv: data.iv,
					rawData: data.rawData,
					signature: data.signature,
					code: code,
				})
			})
			.then(data => {
				console.log(data)
			})
	},
	wechatSignIn(cb) {
		if (wx.getStorageSync('token')) return
		wx.login()
			.then(data => {
				console.log('wechatSignIn', data.code)
				return App.HttpService.wechatSignIn({
					code: data.code
				})
			})
			.then(data => {
				console.log('wechatSignIn', data)
				if (data.meta.code == 0) {
					wx.setStorageSync('token', data.data.token)
					cb()
				} else if (data.meta.code == 40029) {
					App.showModal()
				} else {
					App.wechatSignUp(cb)
				}
			})
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