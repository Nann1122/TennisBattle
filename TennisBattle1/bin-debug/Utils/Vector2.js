/**
 * Created by LN on 2016/6/27.
 */
var Vector2 = (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    var d = __define,c=Vector2,p=c.prototype;
    d(p, "magnitude"
        ,function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    );
    d(p, "normlize"
        ,function () {
            var x = this.x / this.magnitude;
            var y = this.y / this.magnitude;
            return new Vector2(x, y);
        }
    );
    p.Reduce = function (v2) {
        var x = Math.round(this.x - v2.x);
        var y = Math.round(v2.y - this.y); //y坐标由上到下递增！
        return new Vector2(x, y);
    };
    return Vector2;
}());
egret.registerClass(Vector2,'Vector2');
