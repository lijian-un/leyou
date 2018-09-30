const homeUrl = require('../../config').homeUrl;
const hSwiper = require("../../component/hSwiper/hSwiper.js");
//获取应用实例
var app = getApp();var token = '';
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hSwiperVar: {},
        list: [],
        swiperCurrent: 0,
        indexSwiper:{}
    },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.getdata();
  },
  onShow:function(){

  },
  onReady: function () {
      //获得dialog组件
      this.dialog = this.selectComponent("#dialog");
  },
  showDialog: function () {
      this.dialog.showDialog();
  },
  confirmEvent: function () {
    this.dialog.hideDialog();
    app.upd_member()
  },
  getdata: function () {
    var that = this;
    app.checkSession(function(udata){
      if (!udata || udata == "") {
        that.showDialog();
      }
    });
    var sysinfo = wx.getSystemInfoSync();
    var plat = sysinfo['system'].indexOf("IOS") != -1 ? 'ios' : 'android';
    wx.request({
      url: homeUrl + '?plat=' + plat,
      success: function (res) {
        var callback = res.data;
        console.log(callback)
        that.setData({
          indexSwiper: {show_type: 3,data:callback.data.banner},
          hot_data: callback.data.hot,
          new_data: callback.data.news
        });
        that.loadIndex();
      }
    })
  },
    loadIndex: function () {
        var that = this;
        var reduceDistance = 60;
        var templateName = 'swiper4';
        if (that.data.indexSwiper) {
            that.setData({
                swiper_type: that.data.indexSwiper.show_type,
                swiper_list: that.data.indexSwiper.data,
            })
        }
        var swiper = new hSwiper({
            reduceDistance: reduceDistance,
            varStr: "hSwiperVar",
            list: that.data.swiper_list,
            templateName: templateName,
            selIndex: 0
        });
        swiper.afterViewChange = function (data, index) {
            that.setData({
                swiperCurrent: index,
                "hSwiperVar.selIndex": index
            })
        };

    },
    game_click : function(e){
      var dst = e.currentTarget.dataset;
      var data = {};
      data['logType'] = 2;
      data['type'] = 2;
      data['toGame'] = dst.gameid;
      app.add_log(data);
    },
    //分享功能
    onShareAppMessage: function () {
      return {
        title:'你想玩的游戏这里都有',
        imageUrl:'/image/zf_img.png',
        path: '/page/index/index?shareToken=' + app.globalData.token,
      };
    }
})