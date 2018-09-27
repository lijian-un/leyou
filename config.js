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
    // 操作日志记录
    logUrl: `${host}/api/v1/log`,

    //首页信息
    homeUrl: `${host}/api/v1/box/home`
};

module.exports = config