// page/shop/shop.js
const shopList = require('../../config').shopList;
var app = getApp();
var page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.checkSession(function (udata) {
      console.log(udata)
      if (!udata || udata == "") {
        that.showDialog();
      } else {
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
    app.upd_member(function (udata) {
      that.setData({
        avatar: udata.HeadImgUrl,
        nickname: udata.NickName,
        money: app.globalData.Point,
      });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getdata();
  },
  getdata: function () {
    var that = this;
    wx.request({
      url: shopList + '?page=' + page,
      success: function (res) {
        var callback = res.data;
        if (callback.data) {
          that.setData({
            list: callback.data
          })
        }
      }
    })
  },
  shopShow: function (e) {
    var dst = e.currentTarget.dataset;
    // console.log(dst);
    wx.navigateTo({
      url: 'shop_show/shop_show?id=' + dst.id,
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