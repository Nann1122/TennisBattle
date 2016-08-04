/**
 * Created by WangChong on 16/5/30.
 */
module MyNet{
    export var uid : string;
    export var pass : string;
    export var nickname : string;
    export var headurl : string;
    export var headimg;

    // 获取玩家信息
    export function GetInfo()
    {
        var url = window.location.href.toString();
        if (url.indexOf("nickname")== -1)
            return;
        //var url = "zzwxr/index.html?uid=“myUid”&pass=“myPass”&nickname=“Mynickname”&headimg=“http://www.baidu.com”";
        var info = new Array();
        info = url.split('&');
        uid = info[0].split("uid=")[1];
        pass = info[1].split("pass=")[1];
        nickname = info[2].split("nickname=")[1];
        headurl = info[3].split("headimg=")[1];

        console.log("uid:" + uid + " pass:" + pass + " nickname:" + nickname + " headurl:" + headurl);

        if (headurl != null)
        {
            RES.getResByUrl(headurl, onHeadComplete, this,RES.ResourceItem.TYPE_IMAGE);
        }
    }

    function onHeadComplete(_pic : egret.Texture)
    {
        if (_pic != null) {
            headimg = _pic;
        }
    }

    // 上传分数
    export function SubmitData(_score, _json : string)
    {
        //var url = "http://www.fcbrains.com?score=" + _score + "&json=" + _json;
        //alert(url);
        var url = "http://"+Info.head+".fcbrains.com?score=" + _score + "&json=" + _json;
        window.location.href = url;
    }
}