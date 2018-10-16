// page/my/my.js
const renwuUrl = require('../../config').renwuUrl;
const getSign = require('../../config').getSign;
const setSign = require('../../config').setSign;
const tankUrl = require('../../config').tankUrl;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    qd_sta: false,
    qd_day: ['一', '二', '三', '四', '五', '六', '七'],
    qd_img: ['/image/qian_1.png', '/image/qian_1.png', '/image/qian_2.png', '/image/qian_1.png', '/image/qian_3.png', '/image/qian_1.png', '/image/qian_4.png'],
    qd_mess: true,
    tx_sta:0,
    rwmoney: 0,
    rw_sta: 0,
    rw_message: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    var that = this;
    app.checkSession(function (udata) {
      if (!udata || udata == "") {
        that.showDialog();
      }
    });
  },
  showDialog: function () {
    this.dialog.showDialog();
  },
  confirmEvent: function () {
    this.dialog.hideDialog();
    var that = this;
    app.upd_member(function(udata){
      that.setData({
        avatar: udata.HeadImgUrl,
        nickname: udata.NickName,
        money: app.globalData.Point,
        price: app.globalData.Balance,
      });
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.checkSession(function (udata) {
      app.user_money();
      that.setData({
        avatar: udata.HeadImgUrl,
        nickname: udata.NickName,
        money: app.globalData.Point,
        price: app.globalData.Balance,
      });
      that.get_data();
    });
  },
  get_data:function(){
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: renwuUrl,
      data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
      success: function (res) {
        var callback = res.data;
        that.setData(callback);
        if (app.globalData.show==1){
          that.get_dialog();
        }
      }
    })
  },
  get_dialog: function () {
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: tankUrl,
      data: { type: 2, uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
      success: function (res) {
        var callback = res.data;
        if (callback.meta.errCode == 0) {
          if (callback.data.isAlert == 1) {
            rwmoney = callback.data.coins ? callback.data.coins : 0;
            rw_sta = callback.data.coins > 0 ? 1 : 2;
            rw_message = callback.data.message.balance ? callback.data.message.balance : 0;        
            that.setData({
              rwmoney: rwmoney,
              rw_sta: rw_sta,
              rw_message: rw_message,
            });
            app.globalData.show = 0;
          }
          // that.setData({
          //   rwmoney: 0,
          //   rw_sta: 0,
          //   rw_message: '还差{{wrwmoney}}金币可抽取红包',
          // });
        }
      }
    })
  },
  get_sign: function () {
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: getSign,
      data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
      success: function (res) {
        var callback = res.data;
        if (callback.data) {
          that.setData({
            signData: callback.data
          })
        }
      }
    })
  },
  goSign: function () {
    var that = this;
    var qd_sta = that.data.qd_sta
    if (qd_sta) {
      qd_sta = false
    } else {
      qd_sta = true;
      that.get_sign();
    }
    that.setData({
      qd_sta: qd_sta
    })
  },
  set_sign: function () {
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: setSign,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
      success: function (res) {
        var callback = res.data;
        console.log(callback)
        if (callback.data) {
          app.user_money();
          that.setData({
            money: app.globalData.Point,
            price: app.globalData.Balance,
            nextPoint: callback.data.nextPoint,
            point:callback.data.point,
            qd_mess: false
          });
          that.get_data();
        } else {
          wx.showToast({
            title: callback.meta.errMsg,
            image: '/image/error.png',
            duration: 1500
          })
        }
      }
    })
  },
  mess_close: function () {
    var that = this;
    that.setData({
      qd_sta: false,
      qd_mess: true
    })
  },
  Tixian:function(){
    this.setData({
      tx_sta: 1
    })
  },
  close_tx: function () {
    this.setData({
      tx_sta: 0
    })
  },
  copy_tx: function () {
    wx.setClipboardData({
      data: '乐游疯狂游戏',
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var text = '您已经有57个好友在这领取红包了';
    var image = '/image/share_2.jpg';
    if (e.from =='button'){
      var dst = e.target.dataset;
      text = dst.text;
      image = dst.img;
    }
    return {
      title: text,
      imageUrl: image,
      path: '/page/index/index?shareToken=' + app.globalData.token,
    };
  }
})