const App = getApp()

Page({
	data: {
		id: '',
		show: !0,
		form: {
			receiver: '',
			gender: 0,
			mobile: '',
			city: '',
			district: '',
			address: '',
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
	onLoad(option) {
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
				tel: {
					required: '请输入收货人电话',
				},
				address: {
					required: '请输入收货人地址',
				},
			});
		this.setData({
			id: option.id
		})
	},
	onShow() {
		this.renderForm(this.data.id);
	},
	renderForm(id) {
		let that = this;
		wx.request({
			url: App.globalData.host + 'address/' + id,
			method: 'GET',
			data: {
				sessionId: App.globalData.sessionId
			},
			header: {
				'Accept': 'application/json'
			},
			success: function (res) {
				that.setData({
					form: {
						receiver: res.data.data.receiver,
						gender: res.data.data.gender,
						mobile: res.data.data.mobile,
						city: res.data.data.city,
						district: res.data.data.district,
						road: res.data.data.road,
						address: res.data.data.address,
						is_def: res.data.data.is_def
					}
				})
			}
		});
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
		console.log(this.data);
	},
	submitForm(e) {
		wx.showToast({
			title: '提交中...',
			icon: 'loading',
			duration: 10000
		});
		let that = this;
		const params = e.detail.value;
		params.id = this.data.id;
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
			url: App.globalData.host + 'address/edit',
			method: 'POST',
			data: params,
			header: {
				SESSIONID: App.globalData.sessionId,
				'Accept': 'application/json'
			},
			success: function (res) {
				if (res.data.code == 0) {
					wx.showToast({
						title: '修改成功',
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

	},
	delete() {
		wx.showToast({
			title: '提交中...',
			icon: 'loading',
			duration: 10000
		});
		let that = this;
		wx.request({
			url: App.globalData.host + 'address/' + that.data.id,
			method: 'DELETE',
			data: {
				sessionId: App.globalData.sessionId
			},
			header: {
				SESSIONID: App.globalData.sessionId,
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			success: function (res) {

				if (res.data.code == 0) {
					wx.showToast({
						title: '删除成功',
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