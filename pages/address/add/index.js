const App = getApp()

Page({
	data: {
		show: !0,
		form: {
			receiver: '',
			gender: 0,
			mobile: '',
			province: '江西省',
			city: '宜春市',
			district: '袁州区',
			road: '凤凰路',
			address: '',
			is_def: !1,
		},
		provincesSrc: [],
		provinces: [],
		provinceIndex: -1,
		citiesSrc: [],
		cities: [],
		cityIndex: -1,
		districtsSrc: [],
		districts: [],
		districtIndex: -1,
		roadsSrc: [],
		roads: [],
		roadIndex: -1,
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
		this.data.WxValidate = App.WxValidate({
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
				maxlength: 200,
			},
			province: {
				required: true
			},
			city: {
				required: true
			},
			district: {
				required: true
			},
			road: {
				required: true
			},
			address: {
				required: true
			}
		}, {
				receiver: {
					required: '请输入收货人姓名',
					maxlength: "收货人姓名长度过长"
				},
				mobile: {
					required: '请输入收货人电话',
				},
				
				province: {
					required: "请选择省份"
				},
				city: {
					required: "请选择市"
				},
				district: {
					required: "请选择区"
				},
				road: {
					required: "请选择街道"
				},
				address: {
					required: "请输入详细地址"
				},
				address: {
					required: '请输入收货人地址',
				},
			});
	},
	onShow() {
		this.init();
	},
	onPullDownRefresh() {
		this.init();
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
	init() {
		if (this.data.provinces.length > 0) {
			return;
		}
		let that = this;
		wx.request({
			url: App.globalData.host + 'cnArea/getByLevel',
			method: 'GET',
			data: {
				level: 0
			},
			header: {
				SESSIONID: App.globalData.sessionId,
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			success: function (res) {
				if (res.data.code == 0) {
					let provinces = [];
					res.data.data.forEach(function (item, index) {
						provinces.push(item.name);
					});
					that.setData({
						provincesSrc: res.data.data,
						provinces: provinces
					})
				} else {
					wx.showToast({
						title: res.data.msg || "服务器错误",
						duration: 1000
					});
				}
			},
			fail: function () {
			},
			complete: function () {
				wx.stopPullDownRefresh();
				wx.hideToast();
			}
		});
	},
	bindProvinceChange(e) {
		this.setData({
			provinceIndex: e.detail.value,
			'form.province': this.data.provinces[e.detail.value],
		});
		let that = this;
		wx.request({
			url: App.globalData.host + 'cnArea/getByPid',
			method: 'GET',
			data: {
				pid: that.data.provincesSrc[e.detail.value].id
			},
			header: {
				SESSIONID: App.globalData.sessionId,
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			success: function (res) {
				if (res.data.code == 0) {
					let cities = [];
					res.data.data.forEach(function (item, index) {
						cities.push(item.name);
					});
					that.setData({
						citiesSrc: res.data.data,
						cities: cities,
						'form.city': cities[that.data.cityIndex]
					})
				} else {
					wx.showToast({
						title: res.data.msg || "服务器错误",
						duration: 1000
					});
				}
			},
			fail: function () {
			},
			complete: function () {

			}
		});

	},
	bindCityChange(e) {
		this.setData({
			cityIndex: e.detail.value,
			'form.city': this.data.cities[e.detail.value],
		});
		let that = this;
		wx.request({
			url: App.globalData.host + 'cnArea/getByPid',
			method: 'GET',
			data: {
				pid: that.data.citiesSrc[e.detail.value].id
			},
			header: {
				SESSIONID: App.globalData.sessionId,
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			success: function (res) {
				if (res.data.code == 0) {
					let districts = [];
					res.data.data.forEach(function (item, index) {
						districts.push(item.name);
					});
					that.setData({
						districtsSrc: res.data.data,
						districts: districts,
						'form.district': districts[that.data.districtIndex]
					})
				} else {
					wx.showToast({
						title: res.data.msg || "服务器错误",
						duration: 1000
					});
				}
			},
			fail: function () {
			},
			complete: function () {

			}
		});
	},
	bindDistrictChange(e) {
		this.setData({
			districtIndex: e.detail.value,
			'form.district': this.data.districts[e.detail.value],
		});
		let that = this;
		wx.request({
			url: App.globalData.host + 'cnArea/getByPid',
			method: 'GET',
			data: {
				pid: that.data.districtsSrc[e.detail.value].id
			},
			header: {
				SESSIONID: App.globalData.sessionId,
				'content-type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			success: function (res) {
				if (res.data.code == 0) {
					let roads = [];
					res.data.data.forEach(function (item, index) {
						roads.push(item.name);
					});
					that.setData({
						roadsSrc: res.data.data,
						roads: roads,
						'form.road': roads[that.data.roadIndex]
					})
				} else {
					wx.showToast({
						title: res.data.msg || "服务器错误",
						duration: 1000
					});
				}
			},
			fail: function () {
			},
			complete: function () {

			}
		});
	},
	bindRoadChange(e) {
		this.setData({
			roadIndex: e.detail.value,
			'form.road': this.data.roads[e.detail.value],
		});
	},
	submitForm(e) {
		let that = this;
		wx.showToast({
			title: '提交中...',
			icon: 'loading',
			duration: 10000
		});
		that.data.form.receiver = e.detail.value.receiver;
		that.data.form.mobile = e.detail.value.mobile;
		that.data.form.address = e.detail.value.address;
		that.data.form.is_def = e.detail.value.is_def ? 1 : 0;

		if (!this.data.WxValidate.checkData(that.data.form)) {
			wx.showToast({
				title: this.data.WxValidate.validationErrors()[0].msg || '参数错误',
				duration: 1000
			});
			return;
		}



		wx.request({
			url: App.globalData.host + 'address/',
			method: 'POST',
			data: that.data.form,
			header: {
				SESSIONID: App.globalData.sessionId,
				'Accept': 'application/json'
			},
			success: function (res) {
				if (res.data.code == 0) {
					wx.hideToast();
					wx.showToast({
						title: '增加成功',
						duration: 1000
					});
					wx.navigateBack({
						delta: 1
					});
				} else {
					wx.showToast({
						title: res.data.msg || "服务器错误",
						duration: 1000
					});
				}
			},
			fail: function () {
			},
			complete: function () {
			}
		});

	}
})