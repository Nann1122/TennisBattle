/**
 * Created by LN on 2016/1/20.
 */
class LoadingView extends View {

    public m_UI: LoadingViewSkin;

    public constructor()
    {
        super();
    }


    /**
     * add方法执行完毕，调用该方法
     */
    public createChildren()
    {
        super.createChildren();
        this.m_UI = new LoadingViewSkin();
        this.addChild(this.m_UI);
        //console.log(this.m_UI.logo_right);
        //AnchorUtil.setAnchor(this.m_UI.logo_right, 0.5);

        this.LoadingAni ();
        this.LogoLeftAni ();
        //this.LogoGroupAni ();
        egret.Tween.get(this.m_UI.logo_right, {loop: true}).to({rotation:360}, 3000);
    }

    /**
     * Loading 字母跳动动画
     */
    private loadingText : Array<string> = ["l","o","a","d","i","n","g","1","2","3"];
    private LoadingAni ()
    {
        if (this.isHide) {
            return;
        }
        for (var i : number = 0; i < this.loadingText.length; i++) {
            egret.Tween.get(this.m_UI["loading_" + this.loadingText[i]]).wait(300 * i).to({y: 435}, 120, egret.Ease.quadOut).wait(60)
                .to({y:450}, 60, egret.Ease.quintOut);
        }
        egret.setTimeout(this.LoadingAni, this, 300 * this.loadingText.length);

    }

    /**
     * 大脑左边转动动画
     */
    private isHide = false;
    private logoLeftAniIndex : number = 0;
    private LogoLeftAni ()
    {
        if (this.isHide) {
            return;
        }
        this.logoLeftAniIndex = (this.logoLeftAniIndex + 1) % 24;

        this.m_UI.logo_left.source = "logo_left.logo_ani_" + this.logoLeftAniIndex;
        egret.setTimeout(this.LogoLeftAni, this, 41.7);
    }

    /**
     * 大脑
     */
    private LogoGroupAni ()
    {
        //egret.Tween.get(this.logo_group, {loop:true}).to({y:280}, 800, egret.Ease.quadInOut).to({y:318}, 800, egret.Ease.quadInOut);
        //egret.Tween.get(this.logo_shadow, {loop:true}).to({scaleX:0.8,scaleY:0.8}, 800, egret.Ease.quadInOut).to({scaleX:1,scaleY:1}, 800, egret.Ease.quadInOut);
    }
}

class LoadingViewSkin extends eui.Component
{
    public constructor ()
    {
        super ();
        this.skinName = "src/skins/LoadingSkin.exml";  // 指定Skin目录及全名
    }

    public partAdded(partName:string, instance:any):void
    {
        super.partAdded(partName, instance);
    }
    public loading_group : eui.Group;        //

    public logo_right : eui.Image;        //

    public logo_left : eui.Image;        //

    public loading_l : eui.Image;     //

    public loading_o : eui.Image;     //

    public loading_a : eui.Image;     //

    public loading_d : eui.Image;     //

    public loading_i : eui.Image;     //

    public loading_n : eui.Image;     //

    public loading_g : eui.Image;     //

    public loading_1 : eui.Image;     //

    public loading_2 : eui.Image;     //

    public loading_3 : eui.Image;     //

}