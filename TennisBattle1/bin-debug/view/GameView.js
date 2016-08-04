/**
 * Created by LN on 2016/1/20.
 */
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        _super.call(this);
        DialogManager.remove("EndView");
    }
    var d = __define,c=GameView,p=c.prototype;
    /**
     * add方法执行完毕，调用该方法
     */
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        GameView.m_UI = new GameViewSkin();
        this.addChild(GameView.m_UI);
        //Advert.getInstance().ShowAdvert("game");
        GameView.m_UI.waiting.width = GameView.m_UI.waiting.height = 200;
        GameView.m_UI.waiting.anchorOffsetX = GameView.m_UI.waiting.anchorOffsetY = GameView.m_UI.waiting.width * 0.5;
        GameView.m_UI.waiting.x = 320;
        GameView.m_UI.waiting.y = 480;
        GameController.getInstance().Init();
    };
    return GameView;
}(View));
egret.registerClass(GameView,'GameView');
var GameViewSkin = (function (_super) {
    __extends(GameViewSkin, _super);
    function GameViewSkin() {
        _super.call(this);
        this.skinName = "src/skins/GameSkin.exml"; // 指定Skin目录及全名
    }
    var d = __define,c=GameViewSkin,p=c.prototype;
    p.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    return GameViewSkin;
}(eui.Component));
egret.registerClass(GameViewSkin,'GameViewSkin');
