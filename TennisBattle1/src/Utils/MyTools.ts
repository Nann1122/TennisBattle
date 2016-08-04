/**
 * Created by LN on 2016/7/21.
 */
class MyTools
{
    //private static instance:MyTools;
    //public static getInstance():MyTools {
    //    if(this.instance == null) {
    //        this.instance = new MyTools();
    //    }
    //    return this.instance;
    //}

    //向量的模
    public static V2Magnitude(v:Vector2):number
    {
        return Math.sqrt(v.x*v.x + v.y*v.y);
    }
    //向量相乘
    public static V2Multi(v1:Vector2, v2:Vector2):number
    {
        return (v1.x*v2.x + v1.y*v2.y);
    }
    //向量夹角
    public static Angle(v1:Vector2, v2:Vector2):number
    {
        var a:number = this.V2Multi(v1, v2);
        var b:number = this.V2Magnitude(v1)*this.V2Magnitude(v2);
        var radian:number = Math.acos(a/b);
        //console.log(a,b,radian);
        return Math.round(radian*180/Math.PI);
    }

    //两点距离
    public static V2Distance(v1:Vector2, v2:Vector2):number
    {
        var disX = v1.x - v2.x;
        var disY = v1.y - v2.y;
        var dis = Math.sqrt((disX * disX + disY * disY));
        return dis;
    }

    //数字由大到小排序
    public static SortNumTurnBig(arr:Array<number>)
    {
        return arr.sort(function(a,b){return b-a;});
    }
    //数字由小到大排序
    public static SortNumTurnSmall(arr:Array<number>)
    {
        return arr.sort(function(a,b){return a-b;});
    }
}