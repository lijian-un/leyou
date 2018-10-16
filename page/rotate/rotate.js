import Dial from "./utils/dial.js"
const getAward = require('../../config').getAward;
var app = getApp();
Page({
  data: {
    sta_tixian:false,
    sta_choujiang:false,
  },

  onShow() {
    let that = this;
    app.checkSession(function (udata) {
      app.user_money();
      that.setData({
        money: app.globalData.Point,
        price: app.globalData.Balance,
      });
      var ids_data = wx.getStorageSync('user_ids');
      wx.request({
        url: getAward,
        data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
        success: function (res) {
          var callback = res.data;
          that.dial = new Dial(that, {
            areaNumber: 8,
            speed: 16,
            mode: 1,
            okMoney: that.data.okMoney,
            awardList: callback.data.data,
            cost: callback.data.cost,
            callback: (ret) => {
              if(ret.data){
                that.setData({
                    sta_choujiang: true,
                    cjTitle: '恭喜您获得',
                    cjImg: ret.data.Img
                })
              }else{
                that.setData({
                    sta_choujiang: true,
                    cjTitle: '金币不足',
                    cjImg: 'utils/images/no.png'
                })
              }
            }
          })
        }
      })
    });
  },
  onReady() {
      
  },
  // 显示提现信息
  cjClick:function(){
    var that = this;
    var cj_sta = that.data.sta_choujiang;
    if(cj_sta){
        cj_sta = false;
    }else{
        cj_sta = true;
    }
    that.setData({
        sta_choujiang: cj_sta
    })
  },
  // 显示抽奖信息
  tixianClick: function () {
    var that = this;
    var tx_sta = that.data.sta_tixian;
    if (tx_sta) {
        tx_sta = false;
    } else {
        tx_sta = true;
    }
    that.setData({
        sta_tixian: tx_sta
    })
  },
  // 复制公众号
  fuzhi:function(){
    wx.setClipboardData({
      data: '乐游疯狂游戏',
      success: function(){
        wx.showToast({
            title: '复制成功',
            icon: 'success'
        })
      }
    })
  }
})