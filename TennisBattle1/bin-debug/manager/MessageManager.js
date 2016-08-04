/**
 * Created by LN on 2016/6/28.
 */
var MessageManager = (function () {
    function MessageManager() {
    }
    var d = __define,c=MessageManager,p=c.prototype;
    MessageManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new MessageManager();
        }
        return this.instance;
    };
    p.LoadPlayerInfo = function () {
        if (Main.isPingTai) {
            GameView.m_UI.name_self.text = Info.nickname;
            GameView.m_UI.name_match.text = Info.matchNickname;
            RES.getResByUrl(Info.iconUrl, this.onGetPicComplete, this, RES.ResourceItem.TYPE_IMAGE);
            RES.getResByUrl(Info.matchIconUrl, this.onGetMatchPicComplete, this, RES.ResourceItem.TYPE_IMAGE);
        }
        else {
            GameView.m_UI.head_self.source = Info.icon;
            GameView.m_UI.name_self.text = Info.nickname;
            NetPlayerInfo.getInstance().GetPlayerInfo();
        }
    };
    /**
     * 获取玩家头像
     */
    p.onGetPicComplete = function (_pic) {
        if (_pic != null) {
            GameView.m_UI.head_self.source = _pic;
        }
    };
    p.onGetMatchPicComplete = function (_pic) {
        if (_pic != null) {
            GameView.m_UI.head_match.source = _pic;
        }
    };
    p.onBattleStart = function (message) {
        GameController.getInstance().GameBegin();
        //egret.setTimeout(function(){
        //    GameController.getInstance().GameBegin();
        //},this,1000);
    };
    p.onReceiveInfo = function (info) {
        var style = info["msgType"];
        var message = info["msg"];
        if (style == 1) {
            //console.log("onReceiveInfo: pos");
            var matchPosX = message["x"];
            var matchPosY = message["y"];
            GameController.getInstance().regulateMatchPos(matchPosX, matchPosY);
        }
        else if (style == 2) {
            //console.log("onReceiveInf: ball");
            var ballPosX = message["x"];
            var ballPosY = message["y"];
            var ballRotation = message["rotation"];
            var ballSpeed = message["speed"];
            GameController.getInstance().regulateBallAttribute(ballPosX, ballPosY, ballRotation, ballSpeed);
        }
    };
    return MessageManager;
}());
egret.registerClass(MessageManager,'MessageManager');
