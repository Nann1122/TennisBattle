/**
 * Created by WangChong on 15/12/7.
 */
module Info {

    export var app : string = "zzwxr";            // TODO 修改项目名称
    export var appDataEyeId : string = "";     // TODO 修改项目对应DataEye的id
    export var head : string = "www";             // 存储是dev还是www
    //export var uid : string = "";
    //export var pass : string = "";
    export var fid : string = "";
    export var nickname : string = "";
    export var sex : string = "";
    export var add : string = "";
    export var iconUrl : string = "";
    export var icon;
    export var isLikeServer : boolean = true;     // 是否关注公众号
    export var averageScore : number = 2;         // 常模平均值  TODO 修改
    export var standardDeviation : number = 2;    // 常模标准差  TODO 修改
    export var rank : string = "";               // 排行 超过百分之多少的玩家

    //export var uid : string = "oqpGVwNjRcwkKPP2R7X9EzyDynTc";
    //export var pass : string = "319602af80802ea799ce25a40eb7538f89ae26af";

    export var uid : string = "oqpGVwD8cpATT3CpSjrzLTDP7cz4";
    export var pass : string = "a1753eb8f0523f2eeb41b1c3dea343c912d56044";

    export var platform : string = "unip";
    export var channel : string = "wechat";
    export var gameId : string = "wqdzz";       //todo  跟 app 一样

    export var battleId : string = "";
    export var vsToken : string = "";

    export var matchUid :string;
    export var matchNickname : string = "";
    export var matchIconUrl : string = "";

    export var playerScore : number = 0;
    export var matchResult:string = "lose";

    export var PingtaiStr : string = "";
    export var isPingtaiStr : boolean = false;
    export function ReceivePingtaiStr (response)
    {
        egret.log("Info-onPingTaiStr: " + response);
        if(response != null)
        {
            Info.head = response["head"];
            console.log("client head:", Info.head);
            Info.head = "dev";
            Info.uid = response["uid"];
            Info.pass = response["pass"];
            Info.battleId = response["battleId"];
            Info.vsToken = response["vsToken"];
            egret.log(Info.head, Info.uid, Info.pass, Info.battleId, Info.vsToken, response["opponents"]);
            for(var i:number = 0; i < response["opponents"].length; i++)
            {
                egret.log(i,"onPingTaiStr",response["opponents"][i]);
                if(response["opponents"][i] != Info.uid)
                {
                    Info.matchUid = response["opponents"][i];

                    if(i == 0)
                    {
                        GameController.getInstance().isFirstHit = true;
                    }
                }
            }

            for(var i:number = 0; i < response["opponents_auxInfo"].length; i++)
            {
                if(response["opponents_auxInfo"][i]["uid"] == Info.uid)
                {
                    Info.nickname = response["opponents_auxInfo"][i]["auxInfo"]["nickname"];
                    Info.iconUrl = "http://"+ Info.head + ".fcbrains.com/files/custom/" + response["opponents_auxInfo"][i]["auxInfo"]["usericon"];
                    console.log("opponents_auxInfo",i,Info.nickname,Info.iconUrl);
                }
                else
                {
                    Info.matchNickname = response["opponents_auxInfo"][i]["auxInfo"]["nickname"];
                    Info.matchIconUrl = "http://"+ Info.head + ".fcbrains.com/files/custom/" + response["opponents_auxInfo"][i]["auxInfo"]["usericon"];
                    console.log("opponents_auxInfo",i,Info.matchNickname,Info.matchIconUrl);
                }
            }

            Info.isPingtaiStr = true;
        }

    }

    var data;                                     // 存储要上传到服务器详细记录(ops)的数据
    export function SetData ()                    // 在GameController.ts 的 Calculation方法中调用 TODO 补全data内容
    {
        data =
        {
            "percent":GameController.getInstance().data.originalScore,       // 原始得分
            "de":                                                       // detail数据  TODO补全
            {                                                           //
                "Info":playerScore
            }
        }
    }
    export function GetData() : string          // 在上传ops时调用  此时data已由json格式转换为string格式
    {
        var dataStr : string = JSON.stringify(data);
        console.log(dataStr);
        return dataStr;
    }


}