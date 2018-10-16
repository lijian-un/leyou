// page/buy/buy.js
const shopShow = require('../../config').shopShow;
const getAddress = require('../../config').getAddress;
const region = require('../../config').region;
const buy = require('../../config').buy;
var id = null;
var app = getApp();
Page({
    data: {
        gm_num: 1,
        money: 0
    },
    onLoad: function (options) {
        var that = this;
        id = options.id;
        that.getshop();
    },
    onShow: function () {
        var that = this;
        wx.request({
            url: region,
            success: function (res) {
                var callback = res.data;
                // console.log(callback)
                that.setData({
                    allCity: callback.data
                })
                that.getaddress();
            }
        })
    },
    getshop:function(){
        var that = this;
        wx.request({
            url: shopShow + '?id=' + id,
            success: function (res) {
                var callback = res.data;
                // console.log(callback)
                if (callback.data) {
                    that.setData({
                        shop: callback.data,
                        money: callback.data.price
                    })
                }
            }
        })
    },
    getaddress:function(){
        var that = this;
        var ids_data = wx.getStorageSync('user_ids');
        wx.request({
            url: getAddress,
			data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
            success: function (res) {
                var callback = res.data;
                // console.log(callback)
                that.setData({
                    address: callback.data
                })
            }
        })
    },
    siteAddress:function(){
        wx.navigateTo({
            url: '../my/address/address',
        })
    },
    //购买数量操作
    set_paynum: function (tis) {
        var that =this;
        var dst = tis.currentTarget.dataset;
        var num = parseInt(that.data.gm_num)
        if (dst.type == 1) {
            num = num - 1;
            if (num >= 1) {
                var money = that.data.shop.Price * num
                that.setData({
                    gm_num: num,
                    money: money
                })
            } else {
                wx.showToast({
                    icon: 'none',
                    title: '不能再少了！',
                })
            }
        } else {
            num = num + 1;
            if (num <= that.data.shop.Num) {
                var money = that.data.shop.Price*num
                that.setData({ 
                    gm_num: num,
                    money: money
                })
            } else {
                wx.showToast({
                    icon: 'none',
                    title: '库存不足',
                })
            }
        }

    },
    buy:function(){
        var that = this;
        var ids_data = wx.getStorageSync('user_ids');
        wx.showModal({
            title: '提示',
            content: '将扣除'+ that.data.money +'金币',
            cancelText: '不换了',
            cancelColor: '#999',
            confirmText: '确认',
            confirmColor: '#536FF2',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: buy,
                        method: 'POST',
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        data: {
							uniqueId: ids_data['uniqueId'], 
							gameId: app.globalData.gameId,
                            goods_id: id,
                            goods_num: that.data.gm_num
                        },
                        success: function (res) {
                            var callback = res.data;
                            console.log(callback)
                            if(callback.data){
                                wx.navigateTo({
                                    url: 'buy_over/buy_over',
                                })
                            }else{
                                wx.showToast({
                                    title: callback.meta.errMsg,
                                    image: '/image/error.png',
                                    duration: 1500
                                })
                            }
                        }
                    })
                }
            }

        })
    }
})