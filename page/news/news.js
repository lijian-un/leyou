// page/news/news.js
const newsList = require('../../config').newsList;
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
    
  },
  getdata: function () {
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: newsList,
	  data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId,page:page },
      success: function (res) {
        var callback = res.data;
        console.log(callback)
        if (callback.data) {
          that.setData({
            list: callback.data
          })
        }
      }
    })
  },
  newsShow: function (e) {
    var dst = e.currentTarget.dataset;
    // console.log(dst);
    wx.navigateTo({
      url: 'news_show/news_show?id=' + dst.id + '&title=' + dst.title + '&content=' + dst.content,
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
	//分享功能
	onShareAppMessage: function () {
	  return {
		title:'乐游疯狂游戏盒子，一个玩游戏还能赚钱的盒子',
		imageUrl:'/image/share_1.jpg',
		path: '/page/index/index?shareToken=' + app.globalData.token,
	  };
	}
})