// pages/detail/index.js
Page({
  data: {},
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
    record.set("info", "一字详情页面不显示");
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
      content: '将本条不显示信息上传到服务器？',
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
  onLoad: function (options) {
    console.log(options);
    console.log(options.wordDetail);
    // 页面初始化 options为页面跳转所带来的参数
    var obj = JSON.parse(options.wordDetail);
    console.log("传过来对象如下");
    console.log(obj.wordDetail);
    this.setData({
      wordDetail: obj.wordDetail,
      pos: options.pos
    });
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