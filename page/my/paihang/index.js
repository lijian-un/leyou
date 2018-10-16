const paihangList = require('../../../config').paihangList;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paihang_sta : 1
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getdata();
  },
  getdata: function () {
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: paihangList,
      data: { uniqueId: ids_data['uniqueId'] },
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
  paihang_qh:function(){
    if (this.data.paihang_sta==1){
      this.setData({
        paihang_sta: 2
      })
    }else{
      this.setData({
        paihang_sta: 1
      })
    }
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

  }
})