const teamList = require('../../../config').teamList;
var app = getApp(); var page = 1; var flag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      url: teamList,
      data: { uniqueId: ids_data['uniqueId'], pageNo: page, pageSize: 10 },
      success: function (res) {
        var callback = res.data;
        if (callback.data) {
          that.setData({
            list:that.data.list.concat(callback.data.data),
            total_members: callback.data.total_members,
            today_members: callback.data.today_members,
          })
          flag = true; page++;
          if ((!callback.data.data || callback.data.data.length==0)&& page==2){
            that.setData({
              lixiantj: 1
            })
          }
        }
      }
    })
  },
  close_tj:function(){
    this.setData({
      lixiantj: 0
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
    if (!flag) {
      return false;
    }
    flag = false;
    this.getdata();
  }
})