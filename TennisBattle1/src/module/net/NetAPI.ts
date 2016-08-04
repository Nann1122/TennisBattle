/**
 * Created by WangChong on 16/2/19.
 */
module NetAPI
{

//  %H:替换为www or dev
//  %U:用户UID
//  %A:H5应用对应的名称

//  %R:排行榜名称
//  %C:应用下的分类名称，如gonglue(攻略的拼音)

    export var api;

    export function Init() {
        api = RES.getRes("api");

        if (api != null)
        {
            ParseAPI();
        }
        else
        {
            LoadAPI();
        }
    }

    function ParseAPI ()
    {
        for (var item in api)
        {
            api[item] = api[item].replace("%H", Info.head);
            api[item] = api[item].replace("%U", Info.uid);
            api[item] = api[item].replace("%A", Info.app);
        }

        NetManager.instance.Init ();

    }


    /**
     * 连接服务器获取API
     */
    function LoadAPI () {
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.url = "http://dev.fcbrains.com/games/family/json/api.json";
        urlLoader.addEventListener(egret.Event.COMPLETE, onComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        urlLoader.load(urlreq);
    }
    function onComplete(e : egret.Event)
    {
        console.log("~~从dev获取API成功~~");
        //MyDebug.MyLog("~~从dev获取API成功~~");
        api = JSON.parse(e.target.data.toString());
        ParseAPI();
    }
    function onError()
    {
        console.error("~~从dev获取API失败~~")
        //MyDebug.MyLog("~~从dev获取API失败~~");
    }
}