// pages/set/set.js
var app = getApp();
Page({
  data:{
    row:app.row,
    column:app.column,
    bomb:app.bomb
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  //游戏设置部分，修改设置将重新生成游戏
  rowChange:function(e){
    app.row=e.detail.value;
    // var that=this;
    // that.setData({row:e.detail.value,count:that.data.row*that.data.column});
    // that.setgamearr(that.data.row,that.data.column,that.data.bomb)
  },
  columnChange:function(e){
    app.column=e.detail.value;
    // var that=this;
    // that.setData({column:e.detail.value,count:that.data.row*that.data.column});
    // that.setgamearr(that.data.row,that.data.column,that.data.bomb)
  },
  bombChange:function(e){
    app.bomb=e.detail.value;
    // var that=this;
    // that.setData({bomb:e.detail.value});
    // that.setgamearr(that.data.row,that.data.column,that.data.bomb)
  },
  setenter:function(){
    wx.switchTab({url: '../index/index'});
  }
})