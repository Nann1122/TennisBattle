/**
 * Created by WangChong on 16/5/30.
 */
var MyNet;
(function (MyNet) {
    // ��ȡ������Ϣ
    function GetInfo() {
        var url = window.location.href.toString();
        if (url.indexOf("nickname") == -1)
            return;
        //var url = "zzwxr/index.html?uid=��myUid��&pass=��myPass��&nickname=��Mynickname��&headimg=��http://www.baidu.com��";
        var info = new Array();
        info = url.split('&');
        MyNet.uid = info[0].split("uid=")[1];
        MyNet.pass = info[1].split("pass=")[1];
        MyNet.nickname = info[2].split("nickname=")[1];
        MyNet.headurl = info[3].split("headimg=")[1];
        console.log("uid:" + MyNet.uid + " pass:" + MyNet.pass + " nickname:" + MyNet.nickname + " headurl:" + MyNet.headurl);
        if (MyNet.headurl != null) {
            RES.getResByUrl(MyNet.headurl, onHeadComplete, this, RES.ResourceItem.TYPE_IMAGE);
        }
    }
    MyNet.GetInfo = GetInfo;
    function onHeadComplete(_pic) {
        if (_pic != null) {
            MyNet.headimg = _pic;
        }
    }
    // �ϴ�����
    function SubmitData(_score, _json) {
        //var url = "http://www.fcbrains.com?score=" + _score + "&json=" + _json;
        //alert(url);
        var url = "http://" + Info.head + ".fcbrains.com?score=" + _score + "&json=" + _json;
        window.location.href = url;
    }
    MyNet.SubmitData = SubmitData;
})(MyNet || (MyNet = {}));
