function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  upLoadUseRecord: upLoadUseRecord
}

function upLoadUseRecord(page, info, msg) {
  var date = new Date();
  var time = this.formatTime(date) + ":" + date.getMilliseconds();
  var error = '';
  try {
    var res = wx.getSystemInfoSync()
    var arr = [{ 'model': res.model }, { 'pixelRatio': res.pixelRatio }, { 'screenWidth': res.screenWidth }, { 'screenHeight': res.screenHeight }, { 'windowWidth': res.windowWidth }, { 'windowHeight': res.windowHeight }, { 'language': res.language }, { 'version': res.version }, { 'platform': res.platform }, { 'system': res.system }, { 'platform': res.platform }, { 'SDKVersion': res.SDKVersion }]
    // console.log(res.model)
    // console.log(res.pixelRatio)
    // console.log(res.windowWidth)
    // console.log(res.windowHeight)
    // console.log(res.language)
    // console.log(res.version)
    // console.log(res.platform)
    // console.log(arr);
  } catch (e) {
    error = e;
  }

  var Bmob = require('bmob.js')
  var UseRecord = Bmob.Object.extend("UseRecord");
  var User = Bmob.Object.extend("UserProfile");
  var useRecord = new UseRecord();
  var user = new User();
  var objectId = wx.getStorageSync('objectId');
  user.set("objectId", objectId);
  useRecord.set("page", page);
  useRecord.set("info", info);
  useRecord.set("msg", msg);
  useRecord.set("user", user);
  useRecord.set("phoneTime", time);
  useRecord.set("systemInfo", arr);
  useRecord.set("systemInfoError", error);
  useRecord.save(null, {
    success: function (result) {
      console.log("发布成功");
      // wx.showToast({
      //   title: "错误日志收集成功",
      //   icon: "success",
      //   duration: 1500
      // });
    },
    fail: function (result, error) {
      // wx.showToast({
      //   title: "错误日志收集失败",
      //   icon: "success",
      //   duration: 1500
      // });
      console.log("错误日志收集失败如下");
      console.log(error);
    },
  });
}
