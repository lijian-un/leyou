// page/my/my.js
const renwuUrl = require('../../config').renwuUrl;
const getSign = require('../../config').getSign;
const setSign = require('../../config').setSign;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    qd_sta: false,
    qd_day: ['一', '二', '三', '四', '五', '六', '七'],
    qd_img: ['/image/qian_1.png', '/image/qian_1.png', '/image/qian_2.png', '/image/qian_1.png', '/image/qian_3.png', '/image/qian_1.png', '/image/qian_ok.png'],
    qd_mess: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      }else{
        that.setData({
          avatar: udata.HeadImgUrl,
          nickname: udata.NickName,
          money: app.globalData.Point,
        });
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
      });
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.checkSession(function (udata) {
      var ids_data = wx.getStorageSync('user_ids');
      wx.request({
        url: renwuUrl + '?openid=' + ids_data['openId'],
        success: function (res) {
          var callback = res.data;
          that.setData(callback);
        }
      })
    });
  },
  get_sign: function () {
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: getSign + '?openid=' + ids_data['openId'],
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
      data: { openid: ids_data['openId'] },
      success: function (res) {
        var callback = res.data;
        console.log(callback)
        if (callback.data) {
          that.setData({
            qd_mess: false
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
  },
  mess_close: function () {
    var that = this;
    that.setData({
      qd_sta: false,
      qd_mess: true
    })
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
  onShareAppMessage: function () {
    return {
      title: '你想玩的游戏这里都有',
      imageUrl: '/image/zf_img.png',
      path: '/page/index/index?shareToken=' + app.globalData.token,
    };
  }
})