// page/my/my.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
          nickname: udata.NickName
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
        nickname: udata.NickName
      });
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})