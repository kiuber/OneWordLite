//app.js
var Bmob = require('utils/bmob.js')
var Util = require('utils/util.js')
Bmob.initialize("a457d21ae576a69b8843233b4157e69a", "8440f1f1be96778405c280c1a3a18442");
App({
  getWsAddr: function () {
    var that = this;
    Bmob.Cloud.run('webservice_address', {}, {
      success: function (result) {
        if (result) {
          console.log("云逻辑中Web服务地址：" + result);
          var myArray = result.split("||");
          console.log("转成Web服务数组地址：" + myArray);
          that.globalData.wsAddr = myArray;
          console.log("全局Web服务地址如下");
          console.log(that.globalData.wsAddr);
          that.getUserCode(myArray[0]);
        }
      },
      error: function (error) {
        console.log("云端逻辑查询错误");
        console.log(error);
        Util.upLoadUseRecord("app.js", "云端逻辑查询错误");
      }
    });
  },
  getUserCode: function (addr) {
    var that = this;
    wx.login({
      success: function (res) {
        console.log("用户信息如下");
        console.log(res);
        console.log("用户信息code-->" + res.code);
        that.getOpenId(addr, res.code);
      },
      fail: function (res) {
        Util.upLoadUseRecord("app.js", "登陆失败", res);
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  getOpenId: function (addr, code) {
    wx.request({
      url: addr,
      data: {
        code: code,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("请求成功如下");
        console.log(res);
        console.log("获取openId信息成功如下");
        console.log(res.data)
        console.log("获取openId成功如下");
        var openId = res.data.openid;
        console.log(res.data.openid);
        wx.setStorageSync('openid', openId)
        wx.setStorageSync('session_key', res.data.session_key)
      },
      fail: function (error) {
        console.log("获取openId失败如下");
        console.log(error);
        Util.upLoadUseRecord("app.js", "获取openId失败", error);
      },
      complete: function () {
        var session_key = wx.getStorageSync('session_key');
        Util.upLoadUseRecord("app.js-->一", session_key + "获取openId方法执行成功");
      }
    })
  },
  onLaunch: function () {
    this.getWsAddr();
    // var array = new Array();
    // try {
    //   var res = wx.getSystemInfoSync()
    //   var arr = [{ 'model': res.model }, { 'pixelRatio': res.pixelRatio }, { 'screenWidth': res.screenWidth }, { 'screenHeight': res.screenHeight }, { 'windowWidth': res.windowWidth }, { 'windowHeight': res.windowHeight }, { 'language': res.language }, { 'version': res.version }, { 'platform': res.platform }, { 'system': res.system }, { 'platform': res.platform }, { 'SDKVersion': res.SDKVersion }]
    //   console.log(res.model)
    //   console.log(res.pixelRatio)
    //   console.log(res.windowWidth)
    //   console.log(res.windowHeight)
    //   console.log(res.language)
    //   console.log(res.version)
    //   console.log(res.platform)

    //   console.log(arr);
    // } catch (e) {
    // }
  },
  globalData: {
  }
})