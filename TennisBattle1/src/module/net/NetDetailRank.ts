/**
 * Created by WangChong on 15/9/25.
 */


/**
 *  Init 在NetManager调用
 *  GetPlayerDetailInfo   在NetManager调用
 *  SubmitPlayerScore 在同NetManager中SubmitPlayerScore一样位置调用
 */
class NetDetailRank {
    public static instance : NetDetailRank = new NetDetailRank;

    private rankType : Array<string>;
    private rankTypeJson : string;
    private addData:Array<string> = ["Beijing","Tianjin","Shanghai","Chongqing","Hebei","Shanxi","Inner Monglolia","Liaoning","Jilin","Heilongjiang","Jiangsu","Zhejiang","Anhui","Fujian","Jiangxi","Shandong","Henan","Hubei","Hunan","Guangdong","Guangxi","Hainan","Sichuan","Guizhou","Yunnan","Tibet","Shaanxi","Gansu","Qinghai","Ningxia","Xinjiang","Hong Kong","Macao","Taiwan","foreign"];

    private CreateRankType ()
    {
        this.rankType = new Array;
        if (NetManager.instance.sysTime.year != "") {
            var date : string = NetManager.instance.sysTime.year + "/" + NetManager.instance.sysTime.month + "/" + NetManager.instance.sysTime.day;
            var week : number = Week.getWeek(date);
            var weekType : string =  Info.app + "_rank_" + week;
            this.rankType.push(weekType);
        }
        //if (this.playerDetailInfo.sex != ""){
        //    if (this.playerDetailInfo.sex == "1"){
        //        this.rankType.push(Info.app + "_rank_sex_nan");
        //    } else if (this.playerDetailInfo.sex == "2") {
        //        this.rankType.push(Info.app + "_rank_sex_nv");
        //    }
        //}

        console.log("this.addData",this.addData);
        if (this.playerDetailInfo.add != ""){
            if (this.playerDetailInfo.add == "Inner Monglolia") {
                this.rankType.push(Info.app + "_rank_add_" + "InnerMonglolia");
            } else if(this.playerDetailInfo.add == "Hong Kong") {
                this.rankType.push(Info.app + "_rank_add_" + "HongKong");
            } else if (this.addData.indexOf(this.playerDetailInfo.add) != -1) {
                this.rankType.push(Info.app + "_rank_add_" + this.playerDetailInfo.add);
            }
        }
        //if (this.playerDetailInfo.age != ""){
        //    this.rankType.push(Info.app + "_rank_age_" + this.playerDetailInfo.age);
        //}

        for (var item in this.rankType){
            console.warn("this.rankType:" + item);
        }

        this.rankTypeJson = "[";
        for (var i = 0; i < this.rankType.length; i++)
        {
            this.rankTypeJson += "\"" + this.rankType[i] + "\"";
            if (i < this.rankType.length - 1) {
                this.rankTypeJson += ",";
            }
        }
        this.rankTypeJson += "]";
        console.warn("this.rankTypeJson:  " +  this.rankTypeJson);
    }





    /**
     * 玩家附加信息
     */

    private playerDetailInfo = {
        "sex": "",
        "add": "",
        "age": "",
        "edu": ""
    };
    /**
     * 获取玩家附加信息
     */
    public GetxxbgInfo () {
        console.log("~~正在获取玩家附加信息...");
        var urlLoader : egret.URLLoader = new egret.URLLoader;
        var urlreq : egret.URLRequest = new egret.URLRequest;
        urlreq.url = NetAPI.api["xxbginfo"];
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onPlayerDetailInfoLoadComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPlayerDetailInfoLoadError, this);
        urlLoader.load(urlreq);
    }
    private onPlayerDetailInfoLoadComplete (e : egret.Event) {
        console.log(e.target.data.toString())
        var playerDetailInfo = JSON.parse (e.target.data.toString());
        // 将获取到的玩家信息赋给变量
        this.playerDetailInfo.sex = Info.sex.toString();
        this.playerDetailInfo.add = playerDetailInfo["add"];
        this.playerDetailInfo.age = playerDetailInfo["age"];
        this.playerDetailInfo.edu = playerDetailInfo["edu"];
        if (this.playerDetailInfo.add == "" || this.playerDetailInfo.add == null) {
            this.playerDetailInfo.add = Info.add;
        }

        this.CreateRankType ();
        console.log("add: " + this.playerDetailInfo.add + " age: " + this.playerDetailInfo.age + " edu: " + this.playerDetailInfo.edu + " sex: " + this.playerDetailInfo.sex);
    }
    private onPlayerDetailInfoLoadError () {
        this.playerDetailInfo.sex = Info.sex.toString();
        this.playerDetailInfo.add = Info.add;
        console.error("!!网络连接失败……玩家附加信息获取失败。!!");
        MyDebug.MyLog("!!网络连接失败……玩家附加信息获取失败!!");
        this.CreateRankType ();
    }

    // 上传用户分数
    private loadRank : egret.URLLoader = new egret.URLLoader;
    public SubmitPlayerScore (_score) {
        if (Info.uid.indexOf("error") != -1) {
            return;
        }
        // 将NetManager的SubmitPlayerScore方法的分数赋给finalScore
        var urlreq : egret.URLRequest = new egret.URLRequest (NetAPI.api["multirank"]);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("ranknames=" + this.rankTypeJson + "&uid=" + Info.uid + "&pass=" + Info.pass + "&score=" + _score);
        console.warn("ranknames=" + this.rankTypeJson + "&uid=" + Info.uid + "&pass=" + Info.pass + "&score=" + _score);
        this.loadRank.addEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.loadRank.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);
        this.loadRank.load(urlreq);
        console.log("~~正在上传玩家类别排行分数...");
        MyDebug.MyLog("~~正在上传玩家类别排行分数...");
    }

    private onSubmitPlayerScoreComplete () {
        this.loadRank.removeEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.loadRank.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);

        console.log("~~类别排行数据已上传完成~~");
        MyDebug.MyLog("~~类别排行数据已上传完成~~");
    }

    private onSubmitPlayerScoreError () {
        this.loadRank.removeEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.loadRank.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);

        console.error("！！类别排行数据已上传失败！！");
        MyDebug.MyLog("!!类别排行数据已上传失败!!");
    }





}