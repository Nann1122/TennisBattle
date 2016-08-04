/**
 * Created by WangChong on 15/12/7.
 */
var Info;
(function (Info) {
    Info.app = "zzwxr"; // TODO 修改项目名称
    Info.appDataEyeId = ""; // TODO 修改项目对应DataEye的id
    Info.head = "www"; // 存储是dev还是www
    //export var uid : string = "";
    //export var pass : string = "";
    Info.fid = "";
    Info.nickname = "";
    Info.sex = "";
    Info.add = "";
    Info.iconUrl = "";
    Info.isLikeServer = true; // 是否关注公众号
    Info.averageScore = 2; // 常模平均值  TODO 修改
    Info.standardDeviation = 2; // 常模标准差  TODO 修改
    Info.rank = ""; // 排行 超过百分之多少的玩家
    //export var uid : string = "oqpGVwNjRcwkKPP2R7X9EzyDynTc";
    //export var pass : string = "319602af80802ea799ce25a40eb7538f89ae26af";
    Info.uid = "oqpGVwD8cpATT3CpSjrzLTDP7cz4";
    Info.pass = "a1753eb8f0523f2eeb41b1c3dea343c912d56044";
    Info.platform = "unip";
    Info.channel = "wechat";
    Info.gameId = "wqdzz"; //todo  跟 app 一样
    Info.battleId = "";
    Info.vsToken = "";
    Info.matchNickname = "";
    Info.matchIconUrl = "";
    Info.playerScore = 0;
    Info.matchResult = "lose";
    Info.PingtaiStr = "";
    Info.isPingtaiStr = false;
    function ReceivePingtaiStr(response) {
        egret.log("Info-onPingTaiStr: " + response);
        if (response != null) {
            Info.head = response["head"];
            console.log("client head:", Info.head);
            Info.head = "dev";
            Info.uid = response["uid"];
            Info.pass = response["pass"];
            Info.battleId = response["battleId"];
            Info.vsToken = response["vsToken"];
            egret.log(Info.head, Info.uid, Info.pass, Info.battleId, Info.vsToken, response["opponents"]);
            for (var i = 0; i < response["opponents"].length; i++) {
                egret.log(i, "onPingTaiStr", response["opponents"][i]);
                if (response["opponents"][i] != Info.uid) {
                    Info.matchUid = response["opponents"][i];
                    if (i == 0) {
                        GameController.getInstance().isFirstHit = true;
                    }
                }
            }
            for (var i = 0; i < response["opponents_auxInfo"].length; i++) {
                if (response["opponents_auxInfo"][i]["uid"] == Info.uid) {
                    Info.nickname = response["opponents_auxInfo"][i]["auxInfo"]["nickname"];
                    Info.iconUrl = "http://" + Info.head + ".fcbrains.com/files/custom/" + response["opponents_auxInfo"][i]["auxInfo"]["usericon"];
                    console.log("opponents_auxInfo", i, Info.nickname, Info.iconUrl);
                }
                else {
                    Info.matchNickname = response["opponents_auxInfo"][i]["auxInfo"]["nickname"];
                    Info.matchIconUrl = "http://" + Info.head + ".fcbrains.com/files/custom/" + response["opponents_auxInfo"][i]["auxInfo"]["usericon"];
                    console.log("opponents_auxInfo", i, Info.matchNickname, Info.matchIconUrl);
                }
            }
            Info.isPingtaiStr = true;
        }
    }
    Info.ReceivePingtaiStr = ReceivePingtaiStr;
    var data; // 存储要上传到服务器详细记录(ops)的数据
    function SetData() {
        data =
            {
                "percent": GameController.getInstance().data.originalScore,
                "de": // detail数据  TODO补全
                {
                    "Info": Info.playerScore
                }
            };
    }
    Info.SetData = SetData;
    function GetData() {
        var dataStr = JSON.stringify(data);
        console.log(dataStr);
        return dataStr;
    }
    Info.GetData = GetData;
})(Info || (Info = {}));
