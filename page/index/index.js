const homeUrl = require('../../config').homeUrl;
const tankUrl = require('../../config').tankUrl;
const hSwiper = require("../../component/hSwiper/hSwiper.js");
//获取应用实例
var app = getApp();var token = '';
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hSwiperVar: {},
        list: [],
        swiperCurrent: 0,
        indexSwiper:{},
        newuser:0,
        lixiantj:0,
        lixiancc: 0,
        tj_num: 0,
        tj_money: 0,
        tj_price: 0,
    },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    //this.getdata();
  },
  onShow:function(){
    this.setData({
      newuser: app.globalData.newuser
    });
    this.getdata();
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  close_tx:function(){
    this.setData({
      newuser: 0
    })
  },
  close_tj:function(){
    this.setData({
      lixiantj: 0
    })
  },
  copy_tx: function () {
    wx.navigateTo({
      url: '/page/my/wanfa/index'
    })
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
      var ids_data = wx.getStorageSync('user_ids');
      var sysinfo = wx.getSystemInfoSync();
      var plat = sysinfo['system'].indexOf("IOS") != -1 ? 'ios' : 'android';
      wx.request({
        url: homeUrl,
        data: { plat: plat, uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
        success: function (res) {
          var callback = res.data;
          var recommend = callback.data.recommend;
          var recommends = [];
          for (var i = 0; i < recommend.length; i++) {
            if (app.in_array(recommend[i]['GameId'], callback.data.played_recommend)) {
              recommend[i]['play'] = 1;
            }
            recommends.push(recommend[i]);
          }
          that.setData({
            indexSwiper: { show_type: 3, data: callback.data.banner },
            hot_data: callback.data.hot,
            new_data: callback.data.news,
            recommend: recommends,
            reward_point: callback.data.reward_point
          });
          that.loadIndex();
          if (app.globalData.show==1){
            that.get_dialog();
          }
        }
      })
    });
  },
  get_dialog:function(){
    var that = this;
    var ids_data = wx.getStorageSync('user_ids');
    wx.request({
      url: tankUrl,
      data: {type:1,uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
      success: function (res) {
        var callback = res.data;
        if (callback.meta.errCode == 0) {
          var tj_num = 0; var tj_money = 0; var tj_price = 0; var lixiantj = 0; var lixiancc = 0;
          if (callback.data.isAlert==1){
            tj_num = callback.data.message.lottery ? callback.data.message.lottery:0;
            tj_price = callback.data.coins>0 ? callback.data.coins:0;
            tj_money = callback.data.message.balance ? callback.data.message.balance:0;
            lixiantj = (callback.data.message.hasGroup == 1 && callback.data.coins > 0)?1:0;
            lixiancc = callback.data.message.lottery>0?1:2;
            that.setData({
              tj_num: tj_num,
              tj_money: tj_money,
              tj_price: tj_price,
              lixiantj: lixiantj,
              lixiancc: lixiancc
            });
          }
          app.globalData.show=0;
        }
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
        title:'乐游疯狂游戏盒子，一个玩游戏还能赚钱的盒子',
        imageUrl:'/image/share_1.jpg',
        path: '/page/index/index?shareToken=' + app.globalData.token,
      };
    }
})