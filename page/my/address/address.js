// page/my/address/address.js
const setAddress = require('../../../config').setAddress;
const region = require('../../../config').region

var allCity = null;

Page({
    data: {
        info: {},
        provinces: [],
        citys: [],
        areas: [],
        province: null,
        city: null,
        area: null,
        prov_index: null,
        city_index: null,
        area_index: null
    },
    onLoad: function(options) {
        var that = this;
        wx.request({
            url: region ,
            success: function (res) {
                var callback = res.data;
                // console.log(callback);
                allCity = callback.data;
                var provinces = [];
                for (var i in allCity){
                    if (allCity[i].RegionType == 1){
                        provinces.push(allCity[i])
                    }
                }
                that.setData({
                    provinces: provinces
                })
            }
        })
    },
    onShow: function() {

    },
    // 设置地址信息
    set_info: function (e) {
        var that = this;
        var i_tit = e.currentTarget.dataset.name;
        var i_con = e.detail.value;
        var info = that.data.info;
        switch (i_tit) {
            case 'name':
                info.name = i_con; break;
            case 'tel':
                info.tel = i_con; break;
                info.email = i_con; break;
            case 'address':
                info.address = i_con; break;
        }
        that.setData({ info: info });
    },
    // 设置省份
    provinceChange:function(e){
        var that = this;
        var index = e.detail.value;
        var prov = that.data.provinces[index];
        var citys = [];
        for (var i in allCity){
            if (allCity[i].RegionType == 2 && allCity[i].ParentId == prov.Id){
                citys.push(allCity[i])
            }
        }
        that.setData({
            prov_index: index,
            city_index: null,
            citys: citys,
            areas: [],
            province: prov.Id,
            city: null,
            area: null
        })
    },
    // 设置市
    cityChange: function (e) {
        var that = this;
        var index = e.detail.value;
        var city = that.data.citys[index];
        var areas = [];
        for (var i in allCity) {
            if (allCity[i].RegionType == 3 && allCity[i].ParentId == city.Id) {
                areas.push(allCity[i])
            }
        }
        that.setData({
            city_index: index,
            area_index: null,
            areas: areas,
            city: city.Id,
            area: null
        })
    },
    // 设置区/县
    areaChange: function (e) {
        var that = this;
        var index = e.detail.value;
        var area = that.data.areas[index];
        that.setData({
            area_index: index,
            area: area.Id
        })
    },
    save_add: function(){
        var that = this;
        var info = that.data.info;
        var province = that.data.province;
        var city = that.data.city;
        var area = that.data.area;
        var ids_data = wx.getStorageSync('user_ids');
        if (!info.name) {
            wx.showToast({
                title: '姓名不能为空',
                image: '/image/error.png',
                duration: 2000
            }); return;
        } else if (!info.tel) {
            wx.showToast({
                title: '电话不能为空',
                image: '/image/error.png',
                duration: 2000
            }); return;
        } else if (!info.address) {
            wx.showToast({
                title: '地址不能为空',
                image: '/image/error.png',
                duration: 2000
            }); return;
        } else if (!province){
            wx.showToast({
                title: '省份不能为空',
                image: '/image/error.png',
                duration: 2000
            }); return;
        } else if (!city) {
            wx.showToast({
                title: '城市不能为空',
                image: '/image/error.png',
                duration: 2000
            }); return;
        } else if (!area) {
            wx.showToast({
                title: '地区不能为空',
                image: '/image/error.png',
                duration: 2000
            }); return;
        }
        var obj = {
            openid: ids_data['openId'],
            receiver: info.name,
            phone: info.tel,
            province: province,
            city: city,
            area: area,
            address: info.address
        }
        console.log(obj)
        wx.request({
            url: setAddress,
            method: 'POST',
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                openid: ids_data['openId'],
                receiver: info.name,
                phone: info.tel,
                province: province,
                city: city,
                area: area,
                address: info.address
            },
            success: function (res) {
                var callback = res.data;
                console.log(callback)
                if (callback.data) {
                    wx.showToast({
                        title: '设置成功',
                        image: '/image/error.png',
                        duration: 1500
                    })
                    setTimeout(function(){
                        wx.navigateBack({
                            delta: 1,
                        })
                    },1500)
                } else {
                    wx.showToast({
                        title: callback.meta.errMsg,
                        image: '/image/error.png',
                        duration: 1500
                    })
                }
            }
        })
    }
})