/**
 * Created by LN on 2016/7/7.
 */
class NetPlayerInfo
{
    private static instance:NetPlayerInfo;
    public static getInstance():NetPlayerInfo
    {
        if(this.instance == null)
        {
            this.instance = new NetPlayerInfo();
        }
        return this.instance;
    }

    public GetPlayerInfo()
    {
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.url = "http://"+ Info.head + ".fcbrains.com/ginfo/" +  Info.matchUid;
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoadInfoComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, (e)=> {
            console.error("网络连接失败……match玩家信息获取失败。");
        }, this);
        urlLoader.load(urlreq);
    }
    private InfoJson;
    private onLoadInfoComplete (e : egret.Event) {
        this.InfoJson = e.target.data.toString();

        console.log(this.InfoJson);
        var info = JSON.parse (this.InfoJson);

        Info.matchNickname = info["nickname"];
        Info.matchIconUrl = info["headimgurl"];
        console.log("matchNickname: " + Info.matchNickname);
        if (Info.matchNickname == null || Info.matchNickname == null) {
            console.log("网络连接失败……match玩家信息获取失败。");
        } else {
            console.log("match玩家信息Json解析成功");
            this.GetPlayerPic ();
        }
    }

    /**
     * 获取玩家头像
     */
    private GetPlayerPic () {
        RES.getResByUrl(Info.matchIconUrl, this.onGetPicComplete, this,RES.ResourceItem.TYPE_IMAGE);
    }
    private onGetPicComplete (_pic : egret.Texture)
    {
        if (_pic != null) {
            GameView.m_UI.head_match.source = _pic;
            GameView.m_UI.name_match.text = Info.matchNickname;
        }
        console.log("~~match玩家头像获取完成  " + _pic + "  " + Info.iconUrl);
    }

}