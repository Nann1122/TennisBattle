/**
 * Created by WangChong on 16/2/19.
 */
var NetAPI;
(function (NetAPI) {
    function Init() {
        NetAPI.api = RES.getRes("api");
        if (NetAPI.api != null) {
            ParseAPI();
        }
        else {
            LoadAPI();
        }
    }
    NetAPI.Init = Init;
    function ParseAPI() {
        for (var item in NetAPI.api) {
            NetAPI.api[item] = NetAPI.api[item].replace("%H", Info.head);
            NetAPI.api[item] = NetAPI.api[item].replace("%U", Info.uid);
            NetAPI.api[item] = NetAPI.api[item].replace("%A", Info.app);
        }
        NetManager.instance.Init();
    }
    /**
     * 连接服务器获取API
     */
    function LoadAPI() {
        var urlLoader = new egret.URLLoader;
        var urlreq = new egret.URLRequest;
        urlreq.url = "http://dev.fcbrains.com/games/family/json/api.json";
        urlLoader.addEventListener(egret.Event.COMPLETE, onComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        urlLoader.load(urlreq);
    }
    function onComplete(e) {
        console.log("~~从dev获取API成功~~");
        //MyDebug.MyLog("~~从dev获取API成功~~");
        NetAPI.api = JSON.parse(e.target.data.toString());
        ParseAPI();
    }
    function onError() {
        console.error("~~从dev获取API失败~~");
        //MyDebug.MyLog("~~从dev获取API失败~~");
    }
})(NetAPI || (NetAPI = {}));
