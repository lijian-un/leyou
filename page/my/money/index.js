const moneyList = require('../../../config').moneyList;
var app = getApp(); var page = 1; var flag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money_sta: 1,
    shouyi:'ok',
    zhichu:'',
    list: [],
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
    page = 1; flag = true;
    this.data.list = [];
    this.getdata();
  },
  getdata: function () {
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: moneyList,
      data: { pageNo: page, pageSize:10, uniqueId: ids_data['uniqueId'], type:that.data.money_sta},
      success: function (res) {
        var callback = res.data;
        if (callback.data) {
          that.setData({
            list: that.data.list.concat(callback.data),
          })
          flag = true; page++;
        }
      }
    })
  },
  money_qh: function () {
    if (this.data.money_sta == 1) {
      this.data.money_sta = 2;
      this.data.zhichu = 'ok';
      this.data.shouyi = '';
    } else {
      this.data.money_sta = 1;
      this.data.zhichu = '';
      this.data.shouyi = 'ok';
    }
    this.setData({
      zhichu: this.data.zhichu,
      shouyi: this.data.shouyi,
    })
    page = 1; flag = true;
    this.data.list = [];
    this.getdata();
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
    if (!flag) {
      return false;
    }
    flag = false;
    this.getdata();
  }
})