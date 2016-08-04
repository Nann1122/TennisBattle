/**
 * Created by LN on 2016/7/19.
 */
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        this.commonLength = 120;
        this.Init();
    }
    var d = __define,c=Player,p=c.prototype;
    p.Init = function () {
        var commonLength = this.commonLength;
        this.width = this.height = commonLength;
        this.anchorOffsetX = this.anchorOffsetY = commonLength * 0.5;
        this.touchEnabled = false;
        GameView.m_UI.scene_group.addChild(this);
        this.playerImage = new eui.Image();
        this.playerImage.width = this.playerImage.height = commonLength;
        this.playerImage.anchorOffsetX = this.playerImage.anchorOffsetY = commonLength * 0.5;
        this.playerImage.x = this.width * 0.5;
        this.playerImage.y = this.height * 0.5;
        this.addChild(this.playerImage);
    };
    return Player;
}(eui.Group));
egret.registerClass(Player,'Player');
