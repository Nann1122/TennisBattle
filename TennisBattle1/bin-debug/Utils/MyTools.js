/**
 * Created by LN on 2016/7/21.
 */
var MyTools = (function () {
    function MyTools() {
    }
    var d = __define,c=MyTools,p=c.prototype;
    //private static instance:MyTools;
    //public static getInstance():MyTools {
    //    if(this.instance == null) {
    //        this.instance = new MyTools();
    //    }
    //    return this.instance;
    //}
    //向量的模
    MyTools.V2Magnitude = function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    };
    //向量相乘
    MyTools.V2Multi = function (v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y);
    };
    //向量夹角
    MyTools.Angle = function (v1, v2) {
        var a = this.V2Multi(v1, v2);
        var b = this.V2Magnitude(v1) * this.V2Magnitude(v2);
        var radian = Math.acos(a / b);
        //console.log(a,b,radian);
        return Math.round(radian * 180 / Math.PI);
    };
    //两点距离
    MyTools.V2Distance = function (v1, v2) {
        var disX = v1.x - v2.x;
        var disY = v1.y - v2.y;
        var dis = Math.sqrt((disX * disX + disY * disY));
        return dis;
    };
    //数字由大到小排序
    MyTools.SortNumTurnBig = function (arr) {
        return arr.sort(function (a, b) { return b - a; });
    };
    //数字由小到大排序
    MyTools.SortNumTurnSmall = function (arr) {
        return arr.sort(function (a, b) { return a - b; });
    };
    return MyTools;
}());
egret.registerClass(MyTools,'MyTools');
