const App = getApp()

Page({
	data: {
		show: !0,
		form: {
			receiver: '谢江初',
			gender: 0,
			mobile: '15121030453',
			city: '宜春市',
			district: '袁州区',
			road: '　凤凰路',
			address: '老街67号',
			is_def: !1,
		},
		radio: [
			{
				name: '先生',
				value: 0,
				checked: !0,
			},
			{
				name: '女士',
				value: 1,
			},
		],
	},
	onLoad() {
		this.WxValidate = App.WxValidate({
			receiver: {
				required: true,
				minlength: 2,
				maxlength: 10,
			},
			mobile: {
				required: true,
				tel: true,
			},
			address: {
				required: true,
				minlength: 2,
				maxlength: 100,
			},
		}, {
				receiver: {
					required: '请输入收货人姓名',
				},
				mobile: {
					required: '请输入收货人电话',
				},
				address: {
					required: '请输入收货人地址',
				},
			})
	},
	radioChange(e) {
		const params = e.detail.value
		const value = e.detail.value
		const radio = this.data.radio
		radio.forEach(n => n.checked = n.value == value)
		this.setData({
			radio: radio,
			'form.gender': value,
		})
	},
	submitForm(e) {
		wx.showToast({
			title: '提交中...',
			icon: 'loading',
			duration: 10000
		});
		let that = this;
		const params = e.detail.value
		const id = this.data.id
		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
			wx.showModal({
				title: '友情提示',
				content: `${error.param} : ${error.msg}`,
				showCancel: !1,
			})
			return false;
		}
		params.is_def = params.is_def ? 1 : 0;
		wx.request({
			url: App.globalData.host + 'address/',
			method: 'POST',
			data: params,
			header: {
				SESSIONID: App.globalData.sessionId,
				'Accept': 'application/json'
			},
			success: function (res) {
				if (res.data.code == 0) {
					wx.showToast({
						title: '增加成功',
						duration: 1000
					});
					wx.navigateBack({
						delta: 1
					});
				} else {
					wx.showToast({
						title: res.data.msg,
						duration: 1000
					});
				}
			},
			fail: function () {
			},
			complete: function () {
				wx.hideToast();
			}
		});

	}
})