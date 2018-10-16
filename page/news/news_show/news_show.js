// page/news/news_show/news_show.js
const newsShow = require('../../../config').newsShow;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    var ids_data = wx.getStorageSync('user_ids');
    this.setData({
      url: newsShow + '?id=' + options.id + '&uniqueId=' + ids_data['uniqueId'] + '&gameId=' + app.globalData.gameId,
    })
  }
})