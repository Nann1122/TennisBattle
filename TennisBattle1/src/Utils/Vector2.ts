/**
 * Created by LN on 2016/6/27.
 */
class Vector2
{
    public x:number;
    public y:number;

    public constructor(x:number,y:number)
    {
        this.x = x;
        this.y = y;
    }

    get magnitude():number
    {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    get normlize():Vector2
    {
        var x:number = this.x/this.magnitude;
        var y:number = this.y/this.magnitude;
        return new Vector2(x, y);
    }

    public Reduce(v2:Vector2):Vector2
    {
        var x:number = Math.round(this.x - v2.x);
        var y:number = Math.round(v2.y - this.y);   //y坐标由上到下递增！
        return new Vector2(x, y);
    }



}