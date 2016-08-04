/**
 * Created by LN on 2016/4/25.
 */
var GameManager = (function () {
    function GameManager() {
        this.allLevelNum = 15;
        //暂停
        this.isPause = false;
        this.isGameOver = false;
        this.isSingle = false;
        this.isNet = false;
    }
    var d = __define,c=GameManager,p=c.prototype;
    GameManager.getInstance = function () {
        if (GameManager.instance == null) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    };
    p.PlaySingle = function () {
        this.isSingle = true;
        this.isNet = false;
        GameController.getInstance().GameBegin();
    };
    p.PlayNet = function () {
        this.isSingle = false;
        this.isNet = true;
        //TODO
        if (!Main.isPingTai) {
            NetServerConnect.getInstance().ConnectWeiXin();
        }
    };
    p.TimeBegin = function () {
        this.oldTime = egret.getTimer();
        this.nowTime = egret.getTimer();
        Main.euiLayer.addEventListener(egret.Event.ENTER_FRAME, this.TimeFrame, this);
    };
    p.TimeEnd = function () {
        this.betweenTime = 0;
        Main.euiLayer.removeEventListener(egret.Event.ENTER_FRAME, this.TimeFrame, this);
    };
    p.TimeFrame = function () {
        this.oldTime = this.nowTime;
        this.nowTime = egret.getTimer();
        this.betweenTime = this.nowTime - this.oldTime;
    };
    //检测碰撞
    GameManager.hitTest = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    };
    return GameManager;
}());
egret.registerClass(GameManager,'GameManager');
