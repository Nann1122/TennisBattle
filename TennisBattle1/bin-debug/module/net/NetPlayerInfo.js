/**
 * Created by LN on 2016/7/7.
 */
var NetPlayerInfo = (function () {
    function NetPlayerInfo() {
    }
    var d = __define,c=NetPlayerInfo,p=c.prototype;
    NetPlayerInfo.getInstance = function () {
        if (this.instance == null) {
            this.instance = new NetPlayerInfo();
        }
        return this.instance;
    };
    p.GetPlayerInfo = function () {
        var urlLoader = new egret.URLLoader;
        var urlreq = new egret.URLRequest;
        urlreq.url = "http://" + Info.head + ".fcbrains.com/ginfo/" + Info.matchUid;
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoadInfoComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, function (e) {
            console.error("网络连接失败……match玩家信息获取失败。");
        }, this);
        urlLoader.load(urlreq);
    };
    p.onLoadInfoComplete = function (e) {
        this.InfoJson = e.target.data.toString();
        console.log(this.InfoJson);
        var info = JSON.parse(this.InfoJson);
        Info.matchNickname = info["nickname"];
        Info.matchIconUrl = info["headimgurl"];
        console.log("matchNickname: " + Info.matchNickname);
        if (Info.matchNickname == null || Info.matchNickname == null) {
            console.log("网络连接失败……match玩家信息获取失败。");
        }
        else {
            console.log("match玩家信息Json解析成功");
            this.GetPlayerPic();
        }
    };
    /**
     * 获取玩家头像
     */
    p.GetPlayerPic = function () {
        RES.getResByUrl(Info.matchIconUrl, this.onGetPicComplete, this, RES.ResourceItem.TYPE_IMAGE);
    };
    p.onGetPicComplete = function (_pic) {
        if (_pic != null) {
            GameView.m_UI.head_match.source = _pic;
            GameView.m_UI.name_match.text = Info.matchNickname;
        }
        console.log("~~match玩家头像获取完成  " + _pic + "  " + Info.iconUrl);
    };
    return NetPlayerInfo;
}());
egret.registerClass(NetPlayerInfo,'NetPlayerInfo');
