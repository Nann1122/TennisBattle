/**
 * Created by LN on 2016/4/1.
 */
var PlayerRankInfo = (function () {
    function PlayerRankInfo() {
        this.playerScoreMax = 0;
        this.playerRank = 0;
        this.topRange = new Array();
        this.selfRange = new Array();
    }
    var d = __define,c=PlayerRankInfo,p=c.prototype;
    PlayerRankInfo.getInstance = function () {
        if (this.instance == null) {
            this.instance = new PlayerRankInfo();
        }
        return this.instance;
    };
    return PlayerRankInfo;
}());
egret.registerClass(PlayerRankInfo,'PlayerRankInfo');
var PlayerInfo = (function () {
    function PlayerInfo() {
        this._playerUid = "";
        this._playerRank = 0;
        this._playerIconUrl = "";
        this._playerName = "";
        this._playerScore = 0;
        this._playerBgSource = "";
    }
    var d = __define,c=PlayerInfo,p=c.prototype;
    return PlayerInfo;
}());
egret.registerClass(PlayerInfo,'PlayerInfo');
