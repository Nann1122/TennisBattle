/**
 * Created by LN on 2016/5/18.
 */
var EffectMoveClip = (function (_super) {
    __extends(EffectMoveClip, _super);
    function EffectMoveClip() {
        _super.call(this);
    }
    var d = __define,c=EffectMoveClip,p=c.prototype;
    p.init = function (str1, str2) {
        //console.log("init");
        var data = RES.getRes(str1);
        var img = RES.getRes(str2);
        this.mcf = new egret.MovieClipDataFactory(data, img);
        this.mc = new egret.MovieClip();
        this.mc.movieClipData = this.mcf.generateMovieClipData();
        this.addChild(this.mc);
        //动画帧率
        //this.mc.frameRate = 1;
        //this.Play(1);
        //this.mc.addEventListener(egret.Event.COMPLETE, this.removeMC, this);
    };
    p.removeMC = function (evt) {
        if (this.parent != null) {
            //console.log("！！！！yichu-removeMC");
            this.parent.removeChild(this);
        }
    };
    p.PlayAnimation = function (times) {
        //console.log("play");
        this.mc.play(times);
        if (times == 1) {
            this.mc.addEventListener(egret.Event.COMPLETE, this.removeMC, this);
        }
    };
    return EffectMoveClip;
}(egret.Sprite));
egret.registerClass(EffectMoveClip,'EffectMoveClip');
