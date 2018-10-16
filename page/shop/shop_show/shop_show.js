// page/shop/shop_show/shop_show.js
const shopShow = require('../../../config').shopShow;
const getAddress = require('../../../config').getAddress;
const buy = require('../../../config').buy;
var app = getApp();
var id = '';
Page({

    data: {
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        hb_dialog:0
    },
    onLoad: function (options) {
      var that = this;
      id = options.id;
      //id=1;
      that.getdata();
      // that.setData({
      //   url: shopShow + '?id=' + id
      // })

    },
    onShow: function () {

    },
    close_tx: function () {
      this.setData({
        hb_dialog: 0
      })
    },
    getdata: function(){
        var that = this;
        wx.request({
            url: shopShow + '?id=' + id,
            success: function (res) {
                var callback = res.data;
                if (callback.data) {
                    that.setData({
                        data: callback.data
                    })
                }
            }
        })
    },
    buy:function(e){
      var that = this;
      var ids_data = wx.getStorageSync('user_ids');
      var dst = e.currentTarget.dataset;
      if(that.data.data.type==2){
        wx.request({
          url: buy,
          method: 'POST',
          header: {"Content-Type": "application/x-www-form-urlencoded"},
          data: {uniqueId: ids_data['uniqueId'],gameId: app.globalData.gameId,goods_id: id,goods_num: 1},
          success: function (res) {
            var callback = res.data;
            if (callback.meta.errCode == 0) {
              that.setData({
                hb_dialog: 1
              })
            } else {
              wx.showToast({
                title: callback.meta.errMsg,
                image: '/image/error.png',
                duration: 1500
              })
            }
          }
        })
      }else{
        wx.request({
            url: getAddress,
            data: {uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId},
            success: function (res) {
                var callback = res.data;
                console.log(callback)
                if (!callback.data.Address || callback.data.Address == "") {
                    wx.showModal({
                        title:'提示',
                        content:'您还没有收件人信息',
                        cancelText:'不添加',
                        cancelColor:'#999',
                        confirmText:'去添加',
                        confirmColor:'#536FF2',
                        success:function(res){
                            if (res.confirm){
                                wx.navigateTo({
                                    url: '../../my/address/address',
                                })
                            }
                        }

                    })
                }else{
                    wx.navigateTo({
                        url: '../../buy/buy?id=' + id,
                    })
                }
            }
        })
      }
    }
})