/**
 * Created by WangChong on 15/12/08.
 * 
 * 所有50dh 替换为当前项目名称
 *
 * 修改 平均值 averageScoreSelf
 * 修改 标准差 standardDeviationSelf
 *
 * Init 方法需在项目主函数初始化
 * SubmitPlayerDetail 方法在游戏刚结束在可以生成详细数据时调用 需替换方法内detailJson内容
 *
 * 为UidUrlManager、ShareSDK脚本的50dh改名为项目名称
 *
 *
 */


class NetManager {

    public static instance : NetManager = new NetManager ();

    private InfoJson : string = "";

    public Init () {
        console.log("uid=" + Info.uid + " pass=" + Info.pass);

        if (NetAPI.api != null && Info.uid != "error")
        {
            //this.onLoadGameNorm ();
            this.GetFriendUid ();
            this.GetInfo ();
            //this.GetSysTime ();
            //this.GetIfFollowedServer();
        }
    }

    /**
     * 获取 上传用户朋友Uid
     */
    private GetFriendUid () {
        if (localStorage.getItem("zqdn_friend_uid") == null) {
            return;
        }
        Info.fid = localStorage.getItem("zqdn_friend_uid");
        localStorage.removeItem("zqdn_friend_uid");
        console.log ("friendUid: " + Info.fid);
        //MyDebug.MyLog("friendUid: " + Info.fid);

        DCAgent.onEvent("normal_Sharelink_Enter");

        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest (NetAPI.api["addfriend"]);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&fuid=" + Info.fid);
        urlLoader.addEventListener(egret.Event.COMPLETE, onComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        urlLoader.load(urlreq);
        console.log("~~正在上传详细数据...");
        //MyDebug.MyLog("~~正在上传详细数据...");
        function onComplete ()
        {
            console.log( "~~上传用户朋友Uid成功~~");
            //MyDebug.MyLog("~~上传用户朋友Uid成功~~");
        }
        function onError ()
        {
            console.log( "!!上传用户朋友Uid失败!!");
            //MyDebug.MyLog("!!上传用户朋友Uid失败!!");
        }
    }

    /**
     * 通过PlayerUID获取Player信息
     */
    private GetInfo () {
        if (localStorage.getItem("zqdn_Info") != null) {
            this.InfoJson = localStorage.getItem("zqdn_Info");
            console.log("~~本地获取Info~~");
            //MyDebug.MyLog("~~本地获取Info~~");
            this.PickPlayerDataFromJson ();
        }
        else {
            console.log("~~网络获取Info~~");
            //MyDebug.MyLog("~~网络获取Info~~");
            this.ConnectToGetInfo ();
        }
    }

    /**
     * 连接到服务器获取该UID的玩家信息
     */
    private ConnectToGetInfo () {
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.url = NetAPI.api["getginfo"];
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoadInfoComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, (e)=> {
            console.error("网络连接失败……玩家信息获取失败。");
            //MyDebug.MyLog("网络连接失败……玩家信息获取失败。");
        }, this);
        urlLoader.load(urlreq);
    }
    private onLoadInfoComplete (e : egret.Event) {
        this.InfoJson = e.target.data.toString();

        this.PickPlayerDataFromJson ();
        localStorage.setItem("zqdn_Info", this.InfoJson);
    }

    /**
     * 从玩家信息Json文件提取数据
     */
    private PickPlayerDataFromJson () {

        console.log(this.InfoJson);
        var info = JSON.parse (this.InfoJson);
        // 将获取到的玩家信息赋给变量
        Info.nickname = info["nickname"];
        Info.iconUrl = info["headimgurl"];
        Info.sex = info["sex"];
        Info.add = info["province"];
        console.log("name: " + Info.nickname + " id: " + Info.uid);
        if (Info.nickname == null || Info.iconUrl == null) {
            console.log("网络连接失败……玩家信息获取失败。");
            //MyDebug.MyLog("网络连接失败……玩家信息获取失败。");
        } else {
            console.log("玩家信息Json解析成功");
            //MyDebug.MyLog("玩家信息Json解析成功");
            this.GetPlayerPic ();
        }
    }

    /**
     * 获取玩家头像
     */
    private GetPlayerPic () {
        RES.getResByUrl(Info.iconUrl, this.onGetPicComplete, this,RES.ResourceItem.TYPE_IMAGE);
    }
    private onGetPicComplete (_pic : egret.Texture)
    {
        if (_pic != null) {
            Info.icon = _pic;
        }
        console.log("~~玩家头像获取完成  " + _pic + "  " + Info.iconUrl);
        //MyDebug.MyLog("~~玩家头像获取完成  " + _pic + "  " + Info.iconUrl);
    }

    /**
     * 连接服务器获取常模数据
     */
    private onLoadGameNorm () {
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.url = NetAPI.api["norm"];
        urlLoader.addEventListener(egret.Event.COMPLETE, onComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        urlLoader.load(urlreq);

        function onComplete(e : egret.Event)
        {
            var normInfo = JSON.parse(e.target.data.toString ());
            // 当获取到的平均值或标准差正常
            if (!isNaN(parseFloat(normInfo["averageScore"])) && !isNaN(parseFloat(normInfo["standardDeviation"]))){
                Info.averageScore = parseFloat(normInfo["averageScore"]);
                Info.standardDeviation = parseFloat(normInfo["standardDeviation"]);
                console.log("网络获取常模成功  averageScore: " + Info.averageScore + " standardDeviation: " + Info.standardDeviation);
            }
        }
        function onError()
        {
            console.error("！！网络获取常模失败！！")
        }
    }

    /**
     * 上传用户分数
     */
    private submitScore : number;
    public SubmitPlayerScore (_score: number) {
        if (isNaN(_score))
        {
            return;
        }
        this.submitScore = _score;
        Info.rank = "";
        if (NetAPI.api == null || Info.uid == "error") {
            return;
        }
        var url = NetAPI.api["newrank"];
        url = url.replace("%R", Info.app + "_rank");
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest (url);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("uid=" + Info.uid + "&pass=" + Info.pass + "&score=" + _score);
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onPostPlayerScoreComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostPlayerScoreError, this);
        urlLoader.load(urlreq);
        console.log("~~正在上传玩家分数... " + _score);
        MyDebug.MyLog("~~正在上传玩家分数... " + _score);
    }
    private onPostPlayerScoreComplete (e : egret.Event) {
        var playerRank = JSON.parse (e.target.data.toString());
        var allPlayerCount : number = parseInt(playerRank["total"]);
        var nowPlayerCount : number = parseInt(playerRank["rank"]);
        console.log(e.target.data.toString() + "all : " + allPlayerCount + " now : " + nowPlayerCount);
        // 当allplayercount和nowplayercount为空时，则再次调用获取json
        if (isNaN(allPlayerCount) || isNaN(nowPlayerCount)) {
            console.log("网络获取Json异常……开始本地计算排名...");
            MyDebug.MyLog("网络获取Json异常……开始本地计算排名...");
            this.CalculateRank ();
            this.SubmitPlayerDetail ();
        } else {
            if (nowPlayerCount == 1) {
                Info.rank = "100";
            } else {
                Info.rank = (((allPlayerCount-1) - (nowPlayerCount-1)) / (allPlayerCount-1) * 100).toFixed(2);
            }
            if (isNaN(parseFloat(Info.rank))) {
                Info.rank = "-2";
            }
            console.log("~~上传玩家分数、获取用户排名信息完成~~" + e.target.data.toString() + "all : " + allPlayerCount + " now : " + nowPlayerCount + " rank: " + Info.rank);
            //MyDebug.MyLog("~~上传玩家分数、获取用户排名信息完成~~" + e.target.data.toString() + "all : " + allPlayerCount + " now : " + nowPlayerCount + " rank: " + Info.rank);

            this.SubmitPlayerDetail ();
            NetDetailRank.instance.SubmitPlayerScore (this.submitScore);
            //this.GetSysTime ();
        }
    }
    private onPostPlayerScoreError (e : egret.Event) {
        this.CalculateRank ();
        this.SubmitPlayerDetail ();
    }

    /**
     * 本地计算排名
     */
    public CalculateRank () {
        var norm : number = jStat.ztest(this.submitScore, Info.averageScore, Info.standardDeviation, 1);
        if (GameController.getInstance().data.originalScore > Info.averageScore) {
            norm = 1 - norm;
        }
        Info.rank = (norm * 100).toFixed(2);
        if (isNaN(parseFloat(Info.rank))) {
            Info.rank = "-1";
        }
        console.log("原始得分：" + this.submitScore + " 平均值：" + Info.averageScore + " 标准差：" + Info.standardDeviation);
        console.log("超过百分之" + Info.rank);
        MyDebug.MyLog("本地计算排行，，超过百分之" + Info.rank);
    }

    /**
     * 上传用户详细测试数据
     */
    private SubmitPlayerDetail () {
        var data : string = Info.GetData();
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.url = NetAPI.api["oprecord"];
        urlreq.data = new egret.URLVariables("pass=" + Info.pass + "&content=" + data);
        urlLoader.addEventListener(egret.Event.COMPLETE, (e)=> {
            console.log("~~上传详细数据成功~~");
            //MyDebug.MyLog("~~上传详细数据成功~~");
        }, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, (e)=> {
            console.error("!!网络连接失败……数据未成功上传。!!")
            //MyDebug.MyLog("!!网络连接失败……数据未成功上传。!!");
        }, this);
        urlLoader.load(urlreq);
        console.log("~~正在上传详细数据...");
        //MyDebug.MyLog("~~正在上传详细数据...");
    }

    /**
     * 获取是否 关注公众号
     */
    public GetIfFollowedServer () {
        console.log ("~~正在获取是否 关注公众号~~");
        //MyDebug.MyLog("~~正在获取是否 关注公众号~~");
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.url = NetAPI.api["getmpuinfo"];
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onFollowedServerComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, (e)=>{
            console.error ("！！获取是否 关注公众号失败!!");
            //MyDebug.MyLog("!!获取是否 关注公众号失败!!");
        }, this);
        urlLoader.load(urlreq);
    }
    private onFollowedServerComplete (e : egret.Event) {
        console.log(e.target.data.toString());
        var receiveStr : string = e.target.data.toString();
        var followedJson;
        if (receiveStr.indexOf("head") != -1 && receiveStr.indexOf("body") != -1)
        {
            var aux : string = receiveStr.split("<body>")[1];
            aux = aux.split("</body>")[0];
            aux = aux.replace(new RegExp("&quot;", 'g'), "\"");
            console.log(aux);
            followedJson = JSON.parse(aux);
        }
        else
        {
            followedJson = JSON.parse(receiveStr);
        }
        if (followedJson["subscribe"] == 1) {
            Info.isLikeServer = true;
            console.warn ("~~获取是否 关注公众号成功  已关注~~");
            MyDebug.MyLog("~~获取是否 关注公众号成功  已关注~~");
        } else {
            Info.isLikeServer = false;
            console.warn ("~~获取是否 关注公众号成功  未关注~~");
            MyDebug.MyLog("~~获取是否 关注公众号成功  未关注~~");
        }
    }

    public sysTime = {
        "year":"2000",
        "month":"01",
        "day":"01",
        "hour":"11",
        "minute":"59",
        "second":"59"
    }

    /**
     * 获取时间
     */
    public GetSysTime () {
        console.log("~~正在获取服务器时间...");
        MyDebug.MyLog("~~正在获取服务器时间...");
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.url = NetAPI.api["time"];
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onSysTimeLoadComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSysTimeLoadError, this);
        urlLoader.load(urlreq);
    }
    private onSysTimeLoadComplete (e : egret.Event) {
        console.log(e.target.data.toString());
        var sysTime = JSON.parse (e.target.data.toString());
        var t : string = sysTime["time"];
        this.sysTime.year = t.split('/')[0];
        this.sysTime.month = t.split('/')[1];
        this.sysTime.day = t.split('/')[2].split(' ')[0];
        this.sysTime.hour = t.split('/')[2].split(' ')[1].split(':')[0];
        this.sysTime.minute = t.split('/')[2].split(' ')[1].split(':')[1];
        this.sysTime.second = t.split('/')[2].split(' ')[1].split(':')[2];

        console.warn("year:" + this.sysTime.year + " month:" + this.sysTime.month + " day:" + this.sysTime.day
            + " hour:" + this.sysTime.hour + " minute:" + this.sysTime.minute + " second:" + this.sysTime.second);

        MyDebug.MyLog("year:" + this.sysTime.year + " month:" + this.sysTime.month + " day:" + this.sysTime.day
            + " hour:" + this.sysTime.hour + " minute:" + this.sysTime.minute + " second:" + this.sysTime.second);

        NetDetailRank.instance.GetxxbgInfo ();
    }
    private onSysTimeLoadError () {
        console.error("!!获取服务器时间 失败!!");
        MyDebug.MyLog("!!获取服务器时间 失败!!");
        NetDetailRank.instance.GetxxbgInfo ();
    }

}
