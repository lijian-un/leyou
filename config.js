/**
 * 小程序配置文件
 */
var host = "https://box-dev.leyougame.cc";//域名
var config = {
    // 下面的地址配合云端 Server 工作
    host,
    // 用code换取openId
    openIdUrl: `${host}/api/v1/common/user/code`,
    // 更新用户信息 
    updmemUrl: `${host}/api/v1/common/user/setinfo`,
    //获取省份 城市 地区 信息
    moneyUrl: `${host}/api/v1/user/info`,
    // 操作日志记录
    logUrl: `${host}/api/v1/log`,

    //首页信息
    homeUrl: `${host}/api/v1/box/home`,
    //分享获取token
    fxUrl: `${host}/api/v1/share/get_token`,
    //分享打开获取token
    openUrl: `${host}/api/v1/share/share_group`,
    //任务完成情况
    renwuUrl: `${host}/api/v1/task/get_task_detail`,
    //提交反馈信息
    msgUrl: `${host}/api/v1/feedback/add`,
    //获取用户签到状态
    getSign: `${host}/api/v1/task/sign_up_list`,
    //用户签到
    setSign: `${host}/api/v1/task/sign_up`,
    //资讯列表
    newsList: `${host}/api/v1/news/list`,
    //商城列表
    shopList: `${host}/api/v1/goods/list`,
    //商品详情
    shopShow: `${host}/api/v1/goods/detail`,
    //用户下单
    buy: `${host}/api/v1/orders/add`,
    //获取用户收货地址
    getAddress: `${host}/api/v1/address/get`,
    //更新用户收获地址
    setAddress: `${host}/api/v1/address/update`,
    //获取省份 城市 地区 信息
    region: `${host}/api/v1/region/list`,
};

module.exports = config