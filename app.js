//app.js
const openIdUrl = require('./config').openIdUrl;
const logUrl = require('./config').logUrl;
const updmemUrl = require('./config').updmemUrl;
var Util = require('./utils/util.js');
var scene = ''; var code = '';
App({
  onLaunch: function (options) {
    scene = options.scene;
    this.checkSession();
  },
  //判断是否登录过期获取用户信息
  checkSession: function (do_self, status) {
    var that = this;
    wx.checkSession({
      success: function () {
        var udata = wx.getStorageSync('user_data');
        if (!udata || udata == "") {
          that.getUserInfo(do_self, status);
        } else {
          do_self && do_self(udata)
        }
      },
      fail: function () {
        that.getUserInfo(do_self, status);
      }
    })
  },
  // 判断是否登录过期获取用户信息
  getUserInfo: function (do_self, status) {
    var that = this;
    wx.login({
      success: data=> {
        var sysinfo = wx.getSystemInfoSync();
        wx.request({
          url: openIdUrl,
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: { code: data.code, gameid: 'leyoubox', from_game: 'leyoubox', from_channel: 'leyoubox', sysInfo: sysinfo },
          success: res => {
            var callback = res.data;
            if (callback.meta.errCode == 0) {
              wx.setStorageSync('user_ids', callback.data);
              do_self && do_self("");
              //that.upd_member(do_self)
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
      fail: err => {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
      }
    })
  },

  /**微信授权获取用户信息 */
  upd_member: function (do_self) {
    var that = this;
    wx.getUserInfo({
      success: function (udata) {
        var ids_data = wx.getStorageSync('user_ids');
        wx.request({
          url: updmemUrl,
          method: 'POST',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: { openId: ids_data['openId'], gameId: 'leyoubox', encryptedData: udata['encryptedData'], iv: udata['iv']},
          success: function (res) {
            var callback = res.data;
            console.log('1----'+callback)
            if (callback.meta.errCode == 0) {
              wx.setStorageSync('user_data', callback.data);
              var data = {};
              data['logType'] = 1;
              data['type'] = 0;
              that.add_log(data);
              do_self && do_self(callback.data);
            } else {
              console.log('拉取用户注册失败', res)
            }
          },
          fail: function (res) {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
          }
        })
      }
    })
  },
  /**刷新用户信息 */
  add_log: function (data, do_self) {
    var ids_data = wx.getStorageSync('user_ids');
    var sysinfo = wx.getSystemInfoSync();
    var plat = sysinfo['system'].indexOf("iOS")!= -1 ? 'ios' :'android';
    console.log({ logType: data.logType, openId: ids_data['openId'], uniqueId: ids_data['uniqueId'], type: data.type, plat: plat, sysInfo: JSON.stringify(sysinfo), fromGame: 'leyoubox', toGame: data.toGame });
    wx.request({
      url: logUrl,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded", },
      data: { logType: data.logType, openId: ids_data['openId'], uniqueId: ids_data['uniqueId'], type: data.type, plat: plat, sysInfo: JSON.stringify(sysinfo), fromGame: 'leyoubox', toGame: data.toGame },
      success: function (res) {
        var callback = res.data;
        if (callback.meta.errCode == 0) {
          do_self && do_self();
        } else {
          console.log('拉取用户注册失败', res)
        }
      },
      fail: function (res) {
        console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})