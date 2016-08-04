/**
 * Created by WangChong on 15/9/25.
 */
/**
 *  Init 在NetManager调用
 *  GetPlayerDetailInfo   在NetManager调用
 *  SubmitPlayerScore 在同NetManager中SubmitPlayerScore一样位置调用
 */
var NetDetailRank = (function () {
    function NetDetailRank() {
        this.addData = ["Beijing", "Tianjin", "Shanghai", "Chongqing", "Hebei", "Shanxi", "Inner Monglolia", "Liaoning", "Jilin", "Heilongjiang", "Jiangsu", "Zhejiang", "Anhui", "Fujian", "Jiangxi", "Shandong", "Henan", "Hubei", "Hunan", "Guangdong", "Guangxi", "Hainan", "Sichuan", "Guizhou", "Yunnan", "Tibet", "Shaanxi", "Gansu", "Qinghai", "Ningxia", "Xinjiang", "Hong Kong", "Macao", "Taiwan", "foreign"];
        /**
         * 玩家附加信息
         */
        this.playerDetailInfo = {
            "sex": "",
            "add": "",
            "age": "",
            "edu": ""
        };
        // 上传用户分数
        this.loadRank = new egret.URLLoader;
    }
    var d = __define,c=NetDetailRank,p=c.prototype;
    p.CreateRankType = function () {
        this.rankType = new Array;
        if (NetManager.instance.sysTime.year != "") {
            var date = NetManager.instance.sysTime.year + "/" + NetManager.instance.sysTime.month + "/" + NetManager.instance.sysTime.day;
            var week = Week.getWeek(date);
            var weekType = Info.app + "_rank_" + week;
            this.rankType.push(weekType);
        }
        //if (this.playerDetailInfo.sex != ""){
        //    if (this.playerDetailInfo.sex == "1"){
        //        this.rankType.push(Info.app + "_rank_sex_nan");
        //    } else if (this.playerDetailInfo.sex == "2") {
        //        this.rankType.push(Info.app + "_rank_sex_nv");
        //    }
        //}
        console.log("this.addData", this.addData);
        if (this.playerDetailInfo.add != "") {
            if (this.playerDetailInfo.add == "Inner Monglolia") {
                this.rankType.push(Info.app + "_rank_add_" + "InnerMonglolia");
            }
            else if (this.playerDetailInfo.add == "Hong Kong") {
                this.rankType.push(Info.app + "_rank_add_" + "HongKong");
            }
            else if (this.addData.indexOf(this.playerDetailInfo.add) != -1) {
                this.rankType.push(Info.app + "_rank_add_" + this.playerDetailInfo.add);
            }
        }
        //if (this.playerDetailInfo.age != ""){
        //    this.rankType.push(Info.app + "_rank_age_" + this.playerDetailInfo.age);
        //}
        for (var item in this.rankType) {
            console.warn("this.rankType:" + item);
        }
        this.rankTypeJson = "[";
        for (var i = 0; i < this.rankType.length; i++) {
            this.rankTypeJson += "\"" + this.rankType[i] + "\"";
            if (i < this.rankType.length - 1) {
                this.rankTypeJson += ",";
            }
        }
        this.rankTypeJson += "]";
        console.warn("this.rankTypeJson:  " + this.rankTypeJson);
    };
    /**
     * 获取玩家附加信息
     */
    p.GetxxbgInfo = function () {
        console.log("~~正在获取玩家附加信息...");
        var urlLoader = new egret.URLLoader;
        var urlreq = new egret.URLRequest;
        urlreq.url = NetAPI.api["xxbginfo"];
        urlLoader.addEventListener(egret.Event.COMPLETE, this.onPlayerDetailInfoLoadComplete, this);
        urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPlayerDetailInfoLoadError, this);
        urlLoader.load(urlreq);
    };
    p.onPlayerDetailInfoLoadComplete = function (e) {
        console.log(e.target.data.toString());
        var playerDetailInfo = JSON.parse(e.target.data.toString());
        // 将获取到的玩家信息赋给变量
        this.playerDetailInfo.sex = Info.sex.toString();
        this.playerDetailInfo.add = playerDetailInfo["add"];
        this.playerDetailInfo.age = playerDetailInfo["age"];
        this.playerDetailInfo.edu = playerDetailInfo["edu"];
        if (this.playerDetailInfo.add == "" || this.playerDetailInfo.add == null) {
            this.playerDetailInfo.add = Info.add;
        }
        this.CreateRankType();
        console.log("add: " + this.playerDetailInfo.add + " age: " + this.playerDetailInfo.age + " edu: " + this.playerDetailInfo.edu + " sex: " + this.playerDetailInfo.sex);
    };
    p.onPlayerDetailInfoLoadError = function () {
        this.playerDetailInfo.sex = Info.sex.toString();
        this.playerDetailInfo.add = Info.add;
        console.error("!!网络连接失败……玩家附加信息获取失败。!!");
        MyDebug.MyLog("!!网络连接失败……玩家附加信息获取失败!!");
        this.CreateRankType();
    };
    p.SubmitPlayerScore = function (_score) {
        if (Info.uid.indexOf("error") != -1) {
            return;
        }
        // 将NetManager的SubmitPlayerScore方法的分数赋给finalScore
        var urlreq = new egret.URLRequest(NetAPI.api["multirank"]);
        urlreq.method = egret.URLRequestMethod.POST;
        urlreq.data = new egret.URLVariables("ranknames=" + this.rankTypeJson + "&uid=" + Info.uid + "&pass=" + Info.pass + "&score=" + _score);
        console.warn("ranknames=" + this.rankTypeJson + "&uid=" + Info.uid + "&pass=" + Info.pass + "&score=" + _score);
        this.loadRank.addEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.loadRank.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);
        this.loadRank.load(urlreq);
        console.log("~~正在上传玩家类别排行分数...");
        MyDebug.MyLog("~~正在上传玩家类别排行分数...");
    };
    p.onSubmitPlayerScoreComplete = function () {
        this.loadRank.removeEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.loadRank.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);
        console.log("~~类别排行数据已上传完成~~");
        MyDebug.MyLog("~~类别排行数据已上传完成~~");
    };
    p.onSubmitPlayerScoreError = function () {
        this.loadRank.removeEventListener(egret.Event.COMPLETE, this.onSubmitPlayerScoreComplete, this);
        this.loadRank.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onSubmitPlayerScoreError, this);
        console.error("！！类别排行数据已上传失败！！");
        MyDebug.MyLog("!!类别排行数据已上传失败!!");
    };
    NetDetailRank.instance = new NetDetailRank;
    return NetDetailRank;
}());
egret.registerClass(NetDetailRank,'NetDetailRank');
