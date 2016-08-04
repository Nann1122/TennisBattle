/**
 * Created by LN on 2016/1/20.
 */
var LoadingView = (function (_super) {
    __extends(LoadingView, _super);
    function LoadingView() {
        _super.call(this);
        /**
         * Loading 字母跳动动画
         */
        this.loadingText = ["l", "o", "a", "d", "i", "n", "g", "1", "2", "3"];
        /**
         * 大脑左边转动动画
         */
        this.isHide = false;
        this.logoLeftAniIndex = 0;
    }
    var d = __define,c=LoadingView,p=c.prototype;
    /**
     * add方法执行完毕，调用该方法
     */
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        this.m_UI = new LoadingViewSkin();
        this.addChild(this.m_UI);
        //console.log(this.m_UI.logo_right);
        //AnchorUtil.setAnchor(this.m_UI.logo_right, 0.5);
        this.LoadingAni();
        this.LogoLeftAni();
        //this.LogoGroupAni ();
        egret.Tween.get(this.m_UI.logo_right, { loop: true }).to({ rotation: 360 }, 3000);
    };
    p.LoadingAni = function () {
        if (this.isHide) {
            return;
        }
        for (var i = 0; i < this.loadingText.length; i++) {
            egret.Tween.get(this.m_UI["loading_" + this.loadingText[i]]).wait(300 * i).to({ y: 435 }, 120, egret.Ease.quadOut).wait(60)
                .to({ y: 450 }, 60, egret.Ease.quintOut);
        }
        egret.setTimeout(this.LoadingAni, this, 300 * this.loadingText.length);
    };
    p.LogoLeftAni = function () {
        if (this.isHide) {
            return;
        }
        this.logoLeftAniIndex = (this.logoLeftAniIndex + 1) % 24;
        this.m_UI.logo_left.source = "logo_left.logo_ani_" + this.logoLeftAniIndex;
        egret.setTimeout(this.LogoLeftAni, this, 41.7);
    };
    /**
     * 大脑
     */
    p.LogoGroupAni = function () {
        //egret.Tween.get(this.logo_group, {loop:true}).to({y:280}, 800, egret.Ease.quadInOut).to({y:318}, 800, egret.Ease.quadInOut);
        //egret.Tween.get(this.logo_shadow, {loop:true}).to({scaleX:0.8,scaleY:0.8}, 800, egret.Ease.quadInOut).to({scaleX:1,scaleY:1}, 800, egret.Ease.quadInOut);
    };
    return LoadingView;
}(View));
egret.registerClass(LoadingView,'LoadingView');
var LoadingViewSkin = (function (_super) {
    __extends(LoadingViewSkin, _super);
    function LoadingViewSkin() {
        _super.call(this);
        this.skinName = "src/skins/LoadingSkin.exml"; // 指定Skin目录及全名
    }
    var d = __define,c=LoadingViewSkin,p=c.prototype;
    p.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    return LoadingViewSkin;
}(eui.Component));
egret.registerClass(LoadingViewSkin,'LoadingViewSkin');
