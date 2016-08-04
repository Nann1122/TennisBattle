/**
 * Created by LN on 2016/4/1.
 */
class NetPlayerRankInfo
{
    private static instance:NetPlayerRankInfo;
    public static getInstance():NetPlayerRankInfo
    {
        if(this.instance == null)
        {
            this.instance = new NetPlayerRankInfo();
        }
        return this.instance;
    }

    private submitPlayerScoreLoader:egret.URLLoader = new egret.URLLoader();
    public SubmitPlayerScore()
    {
        var url = NetAPI.api["newrank"];
        url = url.replace("%R", Info.app + "_rank");
        //var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest (url);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&score=" + Info.playerScore);

        //var urlreq : egret.URLRequest = new egret.URLRequest (this.submitPlayerScore);
        //urlreq.method = egret.URLRequestMethod.POST;
        //urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&score=" + Info.playerScore);

        console.log("playerscore：" + urlreq.data);
        this.submitPlayerScoreLoader.addEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.submitPlayerScoreLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);

        this.submitPlayerScoreLoader.load(urlreq);
    }
    private onSubmitPlayerScoreComplete(event : egret.Event)
    {
        this.submitPlayerScoreLoader.removeEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.submitPlayerScoreLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);
        console.warn("onSubmitPlayerScoreComplete");

        this.GetPlayerRank();
    }
    private onSubmitPlayerScoreError(event : egret.Event)
    {
        this.submitPlayerScoreLoader.removeEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.submitPlayerScoreLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);
        console.error("onSubmitPlayerScoreError");
    }

    public playerRank:number = 0;
    public playerScore:number = 0;
    private getPlayerRankLoader:egret.URLLoader = new egret.URLLoader();
    public GetPlayerRank()
    {
        var url = NetAPI.api["getbestranks"];
        url = url.replace("%R", Info.app + "_rank");
        var urlreq : egret.URLRequest = new egret.URLRequest (url);

        //var url:string = this.getPlayerRank + Info.uid;
        //var urlreq : egret.URLRequest = new egret.URLRequest(url);

        this.getPlayerRankLoader.addEventListener(egret.Event.COMPLETE, this.onGetPlayerRankComplete, this);
        this.getPlayerRankLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetPlayerRankError, this);
        this.getPlayerRankLoader.load(urlreq);
    }
    private onGetPlayerRankComplete()
    {
        this.getPlayerRankLoader.removeEventListener(egret.Event.COMPLETE, this.onGetPlayerRankComplete, this);
        this.getPlayerRankLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetPlayerRankError, this);
        console.warn("onGetPlayerRankComplete");

        var playerRankJson : string = this.getPlayerRankLoader.data.toString();
        var playerRank = JSON.parse(playerRankJson);
        console.log("playerRankJson: "+playerRankJson);
        MyDebug.MyLog("playerRankJson: "+playerRankJson);

        this.playerScore = parseInt(playerRank.score.toString());
        this.playerRank = parseInt(playerRank.rank.toString());
        console.log("Get playerScore: "+this.playerScore + ",playerRank: "+this.playerRank);

        PlayerRankInfo.getInstance().playerScoreMax = this.playerScore;
        PlayerRankInfo.getInstance().playerRank = this.playerRank;

        this.GetSelfRankRange();
    }
    private onGetPlayerRankError()
    {
        this.getPlayerRankLoader.removeEventListener(egret.Event.COMPLETE, this.onGetPlayerRankComplete, this);
        this.getPlayerRankLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetPlayerRankError, this);
        console.error("onGetPlayerRankError");
    }

    //玩家排名
    private getSelfrRankRangeLoader:egret.URLLoader = new egret.URLLoader();
    public GetSelfRankRange()
    {
        this.selfUids = "";
        var start:number = 0;
        var end:number = 0;
        if(this.playerRank > 5)
        {
            start = this.playerRank-5;
            end = this.playerRank+4;
        }
        else
        {
            start = 1;
            end = 10;
        }

        var url = NetAPI.api["getbestrankls"];
        url = url.replace("%R", Info.app + "_rank");
        var urlreq : egret.URLRequest = new egret.URLRequest (url);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&start=" + start + "&stop=" + end);

        //var urlreq : egret.URLRequest = new egret.URLRequest (this.getRankRange);
        //urlreq.method = egret.URLRequestMethod.POST;
        //urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&start=" + start + "&stop=" + end);

        this.getSelfrRankRangeLoader.addEventListener(egret.Event.COMPLETE, this.onGetSelfRankRangeComplete, this);
        this.getSelfrRankRangeLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetSelfRankRangeError, this);
        this.getSelfrRankRangeLoader.load(urlreq);
    }
    private onGetSelfRankRangeComplete()
    {
        this.getSelfrRankRangeLoader.removeEventListener(egret.Event.COMPLETE, this.onGetSelfRankRangeComplete, this);
        this.getSelfrRankRangeLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetSelfRankRangeError, this);
        console.warn("onGetPlayerRankRangeComplete");

        var selfRankRangeJson:string = this.getSelfrRankRangeLoader.data.toString();
        var selfRangeInfo = JSON.parse(selfRankRangeJson);
        console.log("selfRankRangeJson: "+selfRankRangeJson);

        PlayerRankInfo.getInstance().selfRange.length = 0;

        for(var i : number = 0; i < selfRangeInfo.length; i++)
        {
            if(selfRangeInfo[i] != null)
            {
                var playerInfo:PlayerInfo = new PlayerInfo();
                playerInfo._playerUid = selfRangeInfo[i].uid;
                playerInfo._playerScore = selfRangeInfo[i].score;
                playerInfo._playerRank = selfRangeInfo[i].rank;

                if(selfRangeInfo[i].uid == Info.uid)
                {
                    playerInfo._playerBgSource = "rank_self";
                }
                else
                {
                    playerInfo._playerBgSource = "rank_other";
                }

                PlayerRankInfo.getInstance().selfRange.push(playerInfo);

                if(i != selfRangeInfo.length - 1){
                    this.selfUids += "\"" + selfRangeInfo[i].uid + "\"" + ",";
                } else {
                    this.selfUids += "\"" + selfRangeInfo[i].uid + "\"" ;
                }
            }
        }

        this.selfUids =  "[" + this.selfUids + "]";
        console.log("selfUids: " + this.selfUids);
        this.onGetSelfInfo();
    }
    private onGetSelfRankRangeError()
    {
        this.getSelfrRankRangeLoader.removeEventListener(egret.Event.COMPLETE, this.onGetSelfRankRangeComplete, this);
        this.getSelfrRankRangeLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetSelfRankRangeError, this);
        console.error("onGetPlayerRankRangeError");
    }

    //玩家信息
    private selfUids:string = "";
    private getSelfInfoLoader:egret.URLLoader = new egret.URLLoader();
    private onGetSelfInfo()
    {
        var url = NetAPI.api["getginfobatch"];
        var urlreq : egret.URLRequest = new egret.URLRequest (url);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&uids=" + this.selfUids);

        //var urlreq:egret.URLRequest = new egret.URLRequest(this.getPlayerInfo);
        //urlreq.method = egret.URLRequestMethod.POST;
        //urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&uids=" + this.selfUids);

        this.getSelfInfoLoader.addEventListener(egret.Event.COMPLETE, this.onGetSelfInfoComplete, this);
        this.getSelfInfoLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetSelfInfoError, this);
        this.getSelfInfoLoader.load(urlreq);
    }
    private onGetSelfInfoComplete()
    {
        this.getSelfInfoLoader.removeEventListener(egret.Event.COMPLETE, this.onGetSelfInfoComplete, this);
        this.getSelfInfoLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetSelfInfoError, this);
        console.warn("onGetPlayerInfoComplete");

        var selfInfo = JSON.parse(this.getSelfInfoLoader.data);
        console.log("selfInfoJSON: "+this.getSelfInfoLoader.data);

        for(var i:number = 0; i < selfInfo.length; i++)
        {
            PlayerRankInfo.getInstance().selfRange[i]._playerName = selfInfo[i].info.nickname;
            PlayerRankInfo.getInstance().selfRange[i]._playerIconUrl = selfInfo[i].info.headimgurl;
        }

        this.GetTopRankRange();
    }
    //显示头像
    //private showHead(icon:egret.Texture){
    //    this.playerdata_head.source = icon;
    //}
    private onGetSelfInfoError()
    {
        this.getSelfInfoLoader.removeEventListener(egret.Event.COMPLETE, this.onGetSelfInfoComplete, this);
        this.getSelfInfoLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetSelfInfoError, this);
        console.error("onGetPlayerInfoError");
    }


    //全球前十
    private getTopRankRangeLoader:egret.URLLoader = new egret.URLLoader();
    public GetTopRankRange()
    {
        this.topUids = "";

        var url = NetAPI.api["getbestrankls"];
        url = url.replace("%R", Info.app + "_rank");
        var urlreq : egret.URLRequest = new egret.URLRequest (url);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&start=" + 1 + "&stop=" + 10);

        //var urlreq : egret.URLRequest = new egret.URLRequest (this.getRankRange);
        //urlreq.method = egret.URLRequestMethod.POST;
        //urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&start=" + 1 + "&stop=" + 10);

        this.getTopRankRangeLoader.addEventListener(egret.Event.COMPLETE, this.onGetTopRankRangeComplete, this);
        this.getTopRankRangeLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetTopRankRangeError, this);
        this.getTopRankRangeLoader.load(urlreq);
    }
    private onGetTopRankRangeComplete()
    {
        this.getTopRankRangeLoader.removeEventListener(egret.Event.COMPLETE, this.onGetTopRankRangeComplete, this);
        this.getTopRankRangeLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetTopRankRangeError, this);
        console.warn("onGetTopRankRangeComplete");

        var topRankRangeJson : string = this.getTopRankRangeLoader.data.toString();
        var topRangeInfo = JSON.parse(topRankRangeJson);
        console.log("topRankRangeJson: "+topRankRangeJson);
        MyDebug.MyLog("topRankRangeJson: "+topRankRangeJson);

        PlayerRankInfo.getInstance().topRange.length = 0;

        for(var i : number = 0; i < topRangeInfo.length; i++)
        {
            if(topRangeInfo[i] != null)
            {
                var playerInfo:PlayerInfo = new PlayerInfo();
                playerInfo._playerUid = topRangeInfo[i].uid;
                playerInfo._playerScore = topRangeInfo[i].score;
                playerInfo._playerRank = topRangeInfo[i].rank;

                if(topRangeInfo[i].uid == Info.uid)
                {
                    playerInfo._playerBgSource = "rank_self";
                }
                else
                {
                    playerInfo._playerBgSource = "rank_other";
                }

                PlayerRankInfo.getInstance().topRange.push(playerInfo);

                if(i != topRangeInfo.length - 1){
                    this.topUids += "\"" + topRangeInfo[i].uid + "\"" + ",";
                } else {
                    this.topUids += "\"" + topRangeInfo[i].uid + "\"" ;
                }
            }
        }

        this.topUids =  "[" + this.topUids + "]";
        console.log("topUids: " + this.topUids);
        this.onGetTopInfo();
    }
    private onGetTopRankRangeError()
    {
        this.getTopRankRangeLoader.removeEventListener(egret.Event.COMPLETE, this.onGetTopRankRangeComplete, this);
        this.getTopRankRangeLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetTopRankRangeError, this);
        console.error("onGetTopRankRangeError");
    }

    //top玩家信息
    private topUids:string = "";
    private getTopInfoLoader:egret.URLLoader = new egret.URLLoader();
    private onGetTopInfo()
    {
        var url = NetAPI.api["getginfobatch"];
        var urlreq : egret.URLRequest = new egret.URLRequest (url);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&uids=" + this.topUids);

        //var urlreq:egret.URLRequest = new egret.URLRequest(this.getPlayerInfo);
        ////var url:string = this.getPlayerInfo;
        ////playerInfoRequest.url = url;
        //urlreq.method = egret.URLRequestMethod.POST;
        //urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&uids=" + this.topUids);

        this.getTopInfoLoader.addEventListener(egret.Event.COMPLETE, this.onGetTopInfoComplete, this);
        this.getTopInfoLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetTopInfoError, this);
        this.getTopInfoLoader.load(urlreq);
    }
    private onGetTopInfoComplete()
    {
        this.getTopInfoLoader.removeEventListener(egret.Event.COMPLETE, this.onGetTopInfoComplete, this);
        this.getTopInfoLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetTopInfoError, this);
        console.warn("onGetTopInfoComplete");

        var topInfo = JSON.parse(this.getTopInfoLoader.data);
        console.log("topInfoJSON: "+this.getTopInfoLoader.data);
        for(var i:number = 0; i < topInfo.length; i++)
        {
            PlayerRankInfo.getInstance().topRange[i]._playerName = topInfo[i].info.nickname;
            PlayerRankInfo.getInstance().topRange[i]._playerIconUrl = topInfo[i].info.headimgurl;
        }

        console.log("所有数据获取完成~~~");
        this.FuzhiQuanQiu();
        this.FuzhiGaofen();
    }
    private onGetTopInfoError()
    {
        this.getTopInfoLoader.removeEventListener(egret.Event.COMPLETE, this.onGetTopInfoComplete, this);
        this.getTopInfoLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetTopInfoError, this);
        console.error("onGetTopInfoError");
    }

    public FuzhiQuanQiu() {
        for(var i=0;i<PlayerRankInfo.getInstance().selfRange.length;i++){
            var cell:PlayerDataCell= new PlayerDataCell;
            cell.playerdata_head.source= PlayerRankInfo.getInstance().selfRange[i]._playerIconUrl;
            cell.playerdata_rank.text= PlayerRankInfo.getInstance().selfRange[i]._playerRank+"";
            cell.playerdata_name.text= PlayerRankInfo.getInstance().selfRange[i]._playerName+"";
            cell.playerdata_score.text= PlayerRankInfo.getInstance().selfRange[i]._playerScore+"";
            EndView.m_UI.player_rank_list.addChild(cell);
        }
    }
    public FuzhiGaofen(){
        for(var i=0;i<PlayerRankInfo.getInstance().topRange.length;i++){
            var cell:PlayerDataCell= new PlayerDataCell;
            cell.playerdata_head.source= PlayerRankInfo.getInstance().topRange[i]._playerIconUrl;
            cell.playerdata_rank.text= PlayerRankInfo.getInstance().topRange[i]._playerRank+"";
            cell.playerdata_name.text= PlayerRankInfo.getInstance().topRange[i]._playerName+"";
            cell.playerdata_score.text= PlayerRankInfo.getInstance().topRange[i]._playerScore+"";
            EndView.m_UI.player_rank_list1.addChild(cell);
        }
    }


}