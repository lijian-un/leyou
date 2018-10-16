/**
 * @description 大转盘游戏逻辑部分
 * @author pfan
 * 
 * 问题：
 * 移动端真机，不支持requestAnimationFrame
 *
 * * 调用方式：
 * 
 * 例如：import Dial from "./utils/dial.js"
 * 
 *  wxss 文件需要引入 dial.wxss
 * `@import './utils/dial.wxss'`
 * 
 * wxml 文件需要引入 dial.wxml
 * 例如：<import src="utils/dial.wxml" />
 *      <template is = "dial" data="{{...dial}}"></template> 
 * 
 * js 中调用
 * 
 *  let dial = new Dial(this, {
 *    areaNumber: 8,   //抽奖间隔
 *    speed: 16,       //转动速度
 *    awardNumer: 2,    //中奖区域从1开始
 *    mode: 1,    //1是指针旋转，2为转盘旋转
 *    callback: () => {
 *      //运动停止回调  
 *    }
 *  })
 */
const setAward = require('../../../config').setAward;

var app = getApp();

export default class Dial {
  constructor(pageContext, opts) {
    this.page = pageContext
    this.deg = 0
    this.areaNumber = opts.areaNumber  // 奖区数量
    this.speed = opts.speed || 16   // 每帧速度
    this.awardNumer = 1 //中奖区域 从1开始
    this.mode = opts.mode || 2
    this.singleAngle = ''   //每片扇形的角度
    this.awardList = opts.awardList
    this.cost = opts.cost
    this.isStart = false
    this.endCallBack = opts.callback
    this.init()
    this.page.start = this.start.bind(this)
  }

  init() {
    let { areaNumber, singleAngle, mode, awardList, cost } = this
    singleAngle = 360 / areaNumber
    this.singleAngle = singleAngle
    this.page.setData({
      dial: {
          singleAngle: singleAngle,
          mode: mode,
          cost: cost,
          awardList: awardList
      }
    })
  }

  start() {
    let { deg, awardNumer, singleAngle, speed, isStart, mode, awardList, cost  } = this
    if (isStart) return
    var that = this;
    this.isStart = true
    app.checkSession(function (udata) {
      var ids_data = wx.getStorageSync('user_ids');
      wx.request({
        url: setAward,
        data: { uniqueId: ids_data['uniqueId'], gameId: app.globalData.gameId },
        success: function (res) {
          var callback = res.data;
          console.log(callback)
          if (callback.data) {
            var index = null;
            for(var i in awardList){
              if(awardList[i].Id == callback.data.Id){
                  index = i
              }
            }
            let endAddAngle = index * singleAngle + singleAngle / 2 + 360   //中奖角度
            let rangeAngle = (Math.floor(Math.random() * 4) + 4) * 360 // 随机旋转几圈再停止  
            let cAngle
            deg = 0
            that.timer = setInterval(() => {
              if (deg < rangeAngle) {
                deg += speed
              } else {
                cAngle = (endAddAngle + rangeAngle - deg) / speed
                cAngle = cAngle > speed ? speed : cAngle < 1 ? 1 : cAngle
                deg += cAngle
                if (deg >= (endAddAngle + rangeAngle)) {
                  deg = endAddAngle + rangeAngle
                  that.isStart = false
                  clearInterval(that.timer)
                  that.endCallBack(callback)
                }
              }
              that.page.setData({
                dial: {
                    singleAngle: singleAngle,
                    deg: deg,
                    mode: mode,
                    cost: cost,
                    awardList: awardList
                }
              })
            }, 1000 / 60)
          }else{
            that.isStart = false
            that.endCallBack(callback)
          }
        }
      })
    });
  }

  reset() {
    let { mode } = this
    this.deg = 0
    this.page.setData({
      dial: {
        singleAngle: this.singleAngle,
        deg: 0,
        mode: mode,
        cost: cost,
        awardList: awardList
      }
    })
  }
  switch(mode) {
      this.mode = mode
  }
  loadinfo(awardList){
      this.awardList = awardList
  }
}
