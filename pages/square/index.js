// pages/square/index.js

var Bmob = require('../../utils/bmob.js')
var Util = require('../../utils/util.js')
var Square = Bmob.Object.extend("WordSquare");
Page({
  data: {},
  detail: function (event) {
    console.log(event);
    var index = event.target.dataset.index;
    var cdata = this.data.wordList[index];
    console.log(cdata);
    wx.navigateTo({
      url: '../detail/index?wordDetail=' + JSON.stringify(cdata)
    })
  },
  like: function (event) {
    var that = this;
    console.log(event);
    var id = event.target.dataset.id;
    var index = event.target.dataset.index;
    var query = new Bmob.Query(Square);
    query.get(id, {
      success: function (result) {
        result.increment("like");
        result.save();
        wx.showToast({
          title: "点赞成功",
          icon: "success",
          duration: 1500
        });
      },
      error: function (object, error) {
        console.log(error);
        wx.showToast({
          title: "点赞失败",
          icon: "success",
          duration: 1500
        });
      }
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 20000
    })
    this.querySquareCount();
  },
  querySquareCount: function () {
    var that = this
    var query = new Bmob.Query(Square);
    query.count({
      success: function (count) {
        console.log(" 当前广场条数：" + count);
        var random = Math.random() * (count - 5);
        console.log("随机数-->" + random);
        // 查询成功，返回记录数量
        that.query4Bmob(random);
        wx.hideToast();
        wx.stopPullDownRefresh();
      },
      error: function (error) {
        Util.upLoadUseRecord("我的", "注册数查询失败", error.message);
        // 查询失败
        wx.hideToast();
        wx.stopPullDownRefresh();
      }
    });
  },
  query4Bmob: function (random) {
    var that = this;
    var query = new Bmob.Query(Square);
    query.limit(5);
    query.skip(random);
    query.include("user");
    query.find({
      success: function (results) {
        console.log("查询成功如下");
        console.log(results);
        var result = results[0].attributes.user.attributes.openId;
        console.log("创建本词条用户openId" + result);
        for (var i = 0; i < results.length; i++) {
          results[i].createdAt = results[i].createdAt.substring(5, 10);
          results[i].updatedAt = i;
          console.log(results[i].get("user").get("openId"));
        }
        that.setData({
          wordList: results
        });
      },
      error: function (error) {
        console.log("查询失败如下");
        console.log(error)
        Util.upLoadUseRecord("index.js", "查询失败如下", error);
      }
    });
  },
  onLoad: function (options) {
    this.querySquareCount();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})