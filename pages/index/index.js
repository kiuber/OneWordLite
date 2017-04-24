var Bmob = require('../../utils/bmob.js')
var Util = require('../../utils/util.js')
var User = Bmob.Object.extend("UserProfile");
var AppKey = "a9ef0cebb702a48bc789d0978f3e2475";
var app = getApp()
Page({
  data: {
    motto: '正在获取openId',
    userInfo: {}
  },
  randomHz: function () {
    var word = 'u' + (Math.round(Math.random() * 20901) + 19968).toString(16);
    var word = unescape(word.replace(/\u/g, "%u"));
    return word;
  },
  query: function () {
    this.queryWordDetail();
  },
  about: function () {
    wx.navigateTo({
      url: '../about/index'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '一字',
      path: "/pages/index/index",
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  save2Square2Bmob: function () {
    var that = this;
    var wordDetail = this.data.wordDetail;
    var Record = Bmob.Object.extend("WordSquare");
    var record = new Record();
    var user = new User();
    var objectId = wx.getStorageSync('objectId');
    user.set("objectId", objectId);
    record.set("word", wordDetail.zi);
    record.set("wordId", wordDetail.id);
    record.set("wordDetail", wordDetail);
    record.set("user", user);
    record.save(null, {
      success: function (result) {
        console.log("字记录创建成功, objectId:" + result.id);
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
      },
      error: function (result, error) {
        // 添加失败
        console.log('字记录创建失败如下');
        console.log(result);
        console.log(error);
        Util.upLoadUseRecord("index/index.js", "字记录创建失败如下", error);
        if (error.code == 401) {
          wx.showModal({
            title: '提示',
            content: '来晚一步了，已经有人分享啦~',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          wx.showToast({
            title: '发布失败',
            icon: 'success',
            duration: 2000
          })
        }
      }
    });
  },
  primary: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否将本条信息发布到广场共同学习？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.save2Square2Bmob();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  default: function () {
    wx.navigateTo({
      url: '../square/index'
    })
  },
  saveErrorWord2Bmob: function () {
    var that = this;
    var wordDetail = this.data.wordDetail;
    var Record = Bmob.Object.extend("ErrorWordRecord");
    var record = new Record();
    var user = new User();
    var objectId = wx.getStorageSync('objectId');
    user.set("objectId", objectId);
    record.set("word", wordDetail.zi);
    record.set("wordDetail", wordDetail);
    record.set("wordId", wordDetail.id);
    record.set("info", "首页一字有错误");
    record.set("user", user);
    record.save(null, {
      success: function (result) {
        console.log("字记录创建成功, objectId:" + result.id);
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          duration: 2000
        })
      },
      error: function (result, error) {
        // 添加失败
        console.log('字记录创建失败如下');
        console.log(result);
        console.log(error);
        Util.upLoadUseRecord("index/index.js", "字记录创建失败如下", error);
        wx.showToast({
          title: '上传失败',
          icon: 'success',
          duration: 2000
        })
      }
    });
  },
  warn: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '将本条错误信息上传到服务器？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.saveErrorWord2Bmob();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  queryUseCount: function () {
    var that = this
    var query = new Bmob.Query(User);
    query.count({
      success: function (count) {
        wx.showModal({
          title: '提示',
          content: '当前注册数' + count,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.saveErrorWord2Bmob();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      error: function (error) {
        util.upLoadUseRecord("square/index", "注册数查询失败", error.message);
      }
    });
  },
  saveWord2Bmob: function () {
    var that = this;
    var wordDetail = this.data.wordDetail;
    var Record = Bmob.Object.extend("WordRecord");
    var record = new Record();
    var user = new User();
    var objectId = wx.getStorageSync('objectId');
    user.set("objectId", objectId);
    record.set("word", wordDetail.zi);
    record.set("wordId", wordDetail.id);
    record.set("wordDetail", wordDetail);
    record.set("user", user);
    record.save(null, {
      success: function (result) {
        console.log("字记录创建成功, objectId:" + result.id);
      },
      error: function (result, error) {
        // 添加失败
        console.log('字记录创建失败如下');
        console.log(result);
        console.log(error);
        Util.upLoadUseRecord("index/index.js", "字记录创建失败如下", error);
      }
    });
  },
  queryWordDetail: function (word) {
    var that = this;
    var word = this.randomHz();
    wx.request({
      url: "https://v.juhe.cn/xhzd/query",
      data: {
        key: AppKey,
        word: word,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("请求成功如下");
        console.log(res);
        that.setData({
          wordDetail: res.data.result,
          jianjie: res.data.result.jijie.toString()
        })
        that.saveWord2Bmob();
      }
    })
  },
  addNewUser: function (openId) {
    var that = this;
    var user = new User();
    user.set("openId", openId);
    user.save(null, {
      success: function (result) {
        console.log("用户创建成功, objectId:" + result.id); that.queryWordDetail();
        wx.setStorageSync('objectId', result.id)
      },
      error: function (result, error) {
        // 添加失败
        console.log('创建用户失败如下');
        console.log(result);
        console.log(error);
        Util.upLoadUseRecord("index/index.js", "创建用户失败如下", error);
      }
    });
  },
  queryUser: function (openId) {
    var that = this;
    var query = new Bmob.Query(User);
    query.equalTo("openId", openId);
    query.find({
      success: function (results) {
        console.log("查询成功如下");
        console.log(results);
        if (results.length) {
          console.log("查询结果集合不为0");
          wx.setStorageSync('objectId', results[0].id)
          that.queryWordDetail();
        } else {
          console.log("查询结果集合为0");
          that.addNewUser(openId);
        }
      },
      error: function (error) {
        console.log("查询失败如下");
        console.log(error)
        Util.upLoadUseRecord("index/index.js", "查询失败如下", error);
      }
    });
  },
  onLoad: function () {
    var session_key = wx.getStorageSync('session_key');
    console.log("session_key-->" + session_key);
    Util.upLoadUseRecord("index/index.js-->二", session_key + "打开首页");
    var openId = wx.getStorageSync('openid');
    if (openId) {
      console.log("存在openId");
    }
    console.log("openId-->" + openId);
    console.log(openId);
    this.setData({
      motto: openId
    })
    this.queryUser(openId);
    var wsAddr = app.globalData.wsAddr;
    console.log("从全局获得Web服务地址-->" + wsAddr[0]);
    if (!wsAddr) {
      Util.upLoadUseRecord("index/index.js", "onLoad()方法执行时API地址未获取到", Util.formatTime(new Date()));
    }
  },
})
