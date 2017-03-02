const App = getApp();
var wemark = require('../../../assets/wemark/wemark');
var md = '# hello, world\n\nI love you, wemark!';

Page({
    data: {
        helps: {
            item: {}
        },
        wemark: {}
    },
    onLoad(option) {
        this.setData({
            id: option.id
        })
    },
    onShow() {
        // this.getDetail(this.data.id)
    },
    onReady() {
        const item = this.data.helps.item
        const title = item && item.title

        // wx.setNavigationBarTitle({
        //     title: title,
        // });
        wemark.parse(md, this, {
            imageWidth: wx.getSystemInfoSync().windowWidth - 40,
            name: 'wemark'
        })
    },
    getDetail(id) {

    },
})