/**
 * Created by LN on 2016/5/18.
 */
class EffectMoveClip extends egret.Sprite
{
    private mcf:egret.MovieClipDataFactory;
    public mc:egret.MovieClip;

    public constructor()
    {
        super();
    }

    public init(str1:string,str2:string)
    {
        //console.log("init");
        var data = RES.getRes(str1);
        var img = RES.getRes(str2);

        this.mcf = new egret.MovieClipDataFactory(data,img);
        this.mc = new egret.MovieClip();
        this.mc.movieClipData = this.mcf.generateMovieClipData();
        this.addChild(this.mc);

        //动画帧率
        //this.mc.frameRate = 1;

        //this.Play(1);
        //this.mc.addEventListener(egret.Event.COMPLETE, this.removeMC, this);
    }

    public removeMC(evt:egret.Event):void
    {
        if(this.parent!=null)
        {
            //console.log("！！！！yichu-removeMC");
            this.parent.removeChild(this);
        }
    }

    public PlayAnimation(times:number)
    {
        //console.log("play");
        this.mc.play(times);
        if(times == 1)
        {
            this.mc.addEventListener(egret.Event.COMPLETE, this.removeMC, this);
        }
    }
}