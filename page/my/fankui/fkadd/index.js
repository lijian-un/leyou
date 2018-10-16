// page/my/fankui/fkadd/index.js
const msgUrl = require('../../../../config').msgUrl;
var app = getApp();
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
    var id = options.id;
    var title = '';
    if(id==1){
      title = '无法打开小程序';
    } else if (id == 2) {
      title = '小程序闪退';
    } else if (id == 3) {
      title = '卡顿';
    } else if (id == 4) {
      title = '黑屏白屏';
    } else if (id == 5) {
      title = '死机';
    } else if (id == 6) {
      title = '界面错位';
    } else if (id == 7) {
      title = '界面加载慢';
    } else if (id == 8) {
      title = '其他异常';
    } else if (id == 9) {
      title = '意见与建议';
    }
    this.setData({ title: title,msg_id:id});
  },
  messageinfo:function(e){
    this.setData({
      message: e.detail.value
    })
  },
  phoneinput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  query_msg:function(){
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: msgUrl,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId, content: that.data.message, contact: that.data.phone, feed_type: that.data.msg_id },
      success: res => {
        var callback = res.data;
        if (callback.meta.errCode == 0) {
          wx.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '提示',
            content: callback.meta.errMsg,
            showCancel: false
          })
        }
      },
      fail: res => {
        console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
      }
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