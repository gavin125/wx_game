//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    dialog_warn:false,//通过修改此数据值，改变弹框的显示状态
    dialog_suc:false,//游戏成功，设为true，视图层通过wx:if来判断是否渲染该弹窗
    count:null,//翻牌计数，初始值为app.row*app.column
    gamearr:[]//游戏地图的基础数据（二维数组），根据此来生成游戏
  },
  onShow: function () {
    var that = this
    that.setgamearr(app.row,app.column,app.bomb)
    that.setData({count:app.row*app.column})
  },

  setgamearr:function(row,column,bomb){//根据行列设置游戏二维数组（地图）
    var that=this;
    var arrmap=[];//二维初始数组，全为空
    for(var i=row-1;i>=0;i--){
      arrmap[i]=[];
      for(var j=column-1;j>=0;j--){arrmap[i][j]={val:"",cover:true};}//val用来记录周边雷的数量，cover用来记录是否翻开：无dom操作只能用数据记录状态
    }
    console.log(arrmap)
    var arr=[];//一维自然数
    for(var k=row*column-1;k>=0;k--){arr[k]=k}
    //随机炸弹位置
    for(var h=bomb-1;h>=0;h--){
      var seat=arr.splice(Math.floor(Math.random()*arr.length),1)[0]
      var r=Math.floor(seat/column),c=Math.floor(seat%column);
      //console.log(seat+'\n'+r+","+c);
      arrmap[r][c].val="B";
      arrmap=that.addcount(r,c,arrmap)//给炸弹周围九宫格增加标记数
    }
    that.setData({gamearr:arrmap})
  },

  //游戏渲染部分
  addcount:function(r,c,arrmap){
    var that=this;
    if(r-1>=0){//九宫格上三个
        if(c-1>=0 && arrmap[r-1][c-1].val!="B"){arrmap[r-1][c-1].val++}
        if(arrmap[r-1][c].val!="B"){arrmap[r-1][c].val++}
        if(c+1<app.column && arrmap[r-1][c+1].val!="B"){arrmap[r-1][c+1].val++}
      }
      if(r+1<app.row){//九宫格下三个
        if(c-1>=0 && arrmap[r+1][c-1].val!="B"){arrmap[r+1][c-1].val++}
        if(arrmap[r+1][c].val!="B"){arrmap[r+1][c].val++}
        if(c+1<app.column && arrmap[r+1][c+1].val!="B"){arrmap[r+1][c+1].val++}
      }
      //九宫格左右两个
      if(c-1>=0 && arrmap[r][c-1].val!="B"){arrmap[r][c-1].val++}
      if(c+1<app.column && arrmap[r][c+1].val!="B"){arrmap[r][c+1].val++}
      return arrmap;
  },


  //游戏控制部分
  taphandler:function(e){
    var that=this;
    var r=e.currentTarget.dataset.row,c=e.currentTarget.dataset.column;//无法想jquery获得index，只能用数据记录，直接获取喽
    if(that.data.gamearr[r][c].val!="B"){//如果没点到炸弹
      that.data.gamearr[r][c].cover=false;
      that.data.count--;
      that.setData({count:that.data.count})
      if(that.data.count==app.bomb){that.setData({dialog_suc:true})}//当剩余单元格计数等于雷数，游戏胜利
      if(that.data.gamearr[r][c].val==""){//如果点到的是空,将它周围的四个打开
        that.data.gamearr=that.show4(r,c,that.data.gamearr)
        // that.data.gamearr=that.show9(r,c,that.data.gamearr)//原先考虑九点，结果递归直接栈溢出了，(⊙﹏⊙)b
      }
      console.log(that.data.count)
    }else{that.setData({dialog_warn:true})}//点到了雷，游戏结束
    that.setData({gamearr:that.data.gamearr})
  },

  show4:function(r,c,arrmap){//显示周边的4点
    var that=this;
    if(r-1>=0 && arrmap[r-1][c].val==""){//上
        if(arrmap[r-1][c].cover){
          arrmap[r-1][c].cover=false;that.data.count--;that.setData({count:that.data.count})
          that.show4(r-1,c,arrmap)//递归
        }
      }
      if(r+1<app.row && arrmap[r+1][c].val==""){//下
        if(arrmap[r+1][c].cover){
          arrmap[r+1][c].cover=false;that.data.count--;that.setData({count:that.data.count})
          that.show4(r+1,c,arrmap)//递归
        }
      }
      if(c-1>=0 && arrmap[r][c-1].val==""){//左
        if(arrmap[r][c-1].cover){
        arrmap[r][c-1].cover=false;that.data.count--;that.setData({count:that.data.count})
        that.show4(r,c-1,arrmap)//递归
      }}
      if(c+1<app.column && arrmap[r][c+1].val==""){//右
        if(arrmap[r][c+1].cover){
        arrmap[r][c+1].cover=false;that.data.count--;that.setData({count:that.data.count})
        that.show4(r,c+1,arrmap)//递归
      }}
      return arrmap;
  },
  // show9:function(r,c,arrmap){//显示周边的9点
  //   var that=this;
  //   if(r-1>=0){//九宫格上三个
  //       if(c-1>=0 && arrmap[r-1][c-1].val==""){
  //         if(arrmap[r-1][c-1].cover){
  //         arrmap[r-1][c-1].cover=false;that.data.count--;that.setData({count:that.data.count})
  //         }}
  //       if(arrmap[r-1][c].val==""){
  //         if(arrmap[r-1][c].cover){
  //         arrmap[r-1][c].cover=false;that.data.count--;that.setData({count:that.data.count})
  //       }}
  //       if(c+1<app.column && arrmap[r-1][c+1].val==""){
  //         if(arrmap[r-1][c+1].cover){
  //         arrmap[r-1][c+1].cover=false;that.data.count--;that.setData({count:that.data.count})
  //       }}
  //     }
  //     if(r+1<app.row){//九宫格下三个
  //       if(c-1>=0 && arrmap[r+1][c-1].val==""){
  //         if(arrmap[r+1][c-1].cover){
  //         arrmap[r+1][c-1].cover=false;that.data.count--;that.setData({count:that.data.count})
  //       }}
  //       if(arrmap[r+1][c].val==""){
  //         if(arrmap[r+1][c].cover){
  //         arrmap[r+1][c].cover=false;that.data.count--;that.setData({count:that.data.count})
  //       }}
  //       if(c+1<app.column && arrmap[r+1][c+1].val==""){
  //         if(arrmap[r+1][c+1].cover){
  //         arrmap[r+1][c+1].cover=false;that.data.count--;that.setData({count:that.data.count})
  //       }}
  //     }
  //     //九宫格左右两个
  //     if(c-1>=0 && arrmap[r][c-1].val==""){
  //       if(arrmap[r][c-1].cover){
  //       arrmap[r][c-1].cover=false;that.data.count--;that.setData({count:that.data.count})
  //     }}
  //     if(c+1<app.column && arrmap[r][c+1].val==""){
  //       if(arrmap[r][c+1].cover){
  //       arrmap[r][c+1].cover=false;that.data.count--;that.setData({count:that.data.count})
  //     }}
  //     return arrmap;
  // },
  
  goset:function(){//跳转到游戏设置页面
    wx.switchTab({url: '../set/set'});
  },
  reset:function(){//console.log("重新开始")
    var that=this;
    that.setgamearr(app.row,app.column,app.bomb)
    that.setData({count:app.row*app.column,dialog_warn:false,dialog_suc:false,})
  }

})
