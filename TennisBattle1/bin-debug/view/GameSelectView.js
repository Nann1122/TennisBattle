/**
 * Created by LN on 2016/7/6.
 */
var GameSelectView = (function (_super) {
    __extends(GameSelectView, _super);
    function GameSelectView() {
        _super.call(this);
    }
    var d = __define,c=GameSelectView,p=c.prototype;
    /**
     * add方法执行完毕，调用该方法
     */
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        GameSelectView.m_UI = new GameSelectViewSkin();
        this.addChild(GameSelectView.m_UI);
        GameSelectView.m_UI.select_single.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SelectSingle, this);
        GameSelectView.m_UI.select_net.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SelectNet, this);
    };
    p.SelectSingle = function () {
        DialogManager.open(GameView, "GameView", 1);
        GameManager.getInstance().PlaySingle();
    };
    p.SelectNet = function () {
        DialogManager.open(GameView, "GameView", 1);
        GameManager.getInstance().PlayNet();
    };
    return GameSelectView;
}(View));
egret.registerClass(GameSelectView,'GameSelectView');
var GameSelectViewSkin = (function (_super) {
    __extends(GameSelectViewSkin, _super);
    function GameSelectViewSkin() {
        _super.call(this);
        this.skinName = "src/skins/GameSelectSkin.exml"; // ָ��SkinĿ¼��ȫ��
    }
    var d = __define,c=GameSelectViewSkin,p=c.prototype;
    p.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    return GameSelectViewSkin;
}(eui.Component));
egret.registerClass(GameSelectViewSkin,'GameSelectViewSkin');
