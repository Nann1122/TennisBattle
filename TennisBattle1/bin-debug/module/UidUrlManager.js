var UidUrlManager = (function () {
    function UidUrlManager() {
    }
    var d = __define,c=UidUrlManager,p=c.prototype;
    // 从Cookie中获取uid
    UidUrlManager.GetCookie = function (c_name) {
        // 从cookie获取UID
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                var str = document.cookie.substring(c_start, c_end);
                str = str.split('"')[0];
                if (c_name == "uid") {
                    Info.uid = str;
                }
                else if (c_name == "pass") {
                    Info.pass = str;
                }
                //LikeServerInfo.GetIfLikedServer ();
                return;
            }
            else {
                // 判断玩家获取uid是否失败
                if (localStorage.getItem("zqdn_cookie_uid") == null) {
                    localStorage.setItem("zqdn_cookie_uid", "1");
                }
                else {
                    localStorage.removeItem("zqdn_cookie_uid");
                    str = "error";
                    if (c_name == "uid") {
                        Info.uid = str;
                    }
                    else if (c_name == "pass") {
                        Info.pass = str;
                    }
                    return;
                }
            }
        }
        else {
            // 判断玩家获取uid是否失败
            if (localStorage.getItem("zqdn_cookie_uid") == null) {
                localStorage.setItem("zqdn_cookie_uid", "1");
            }
            else {
                localStorage.removeItem("zqdn_cookie_uid");
                str = "error";
                if (c_name == "uid") {
                    Info.uid = str;
                }
                else if (c_name == "pass") {
                    Info.pass = str;
                }
                return;
            }
        }
        window.location.href = "http://" + Info.head + ".fcbrains.com/" + Info.app + "/wxlogin";
    };
    UidUrlManager.ChangeURL = function () {
        var str = window.location.href.toString();
        if (str.indexOf("www") != -1) {
            Info.head = "www";
        }
        else {
            Info.head = "dev";
        }
        console.log(Info.head);
        if ((window.location.href.indexOf('?') != -1 || window.location.href.indexOf("uid") != -1)) {
            if (str.indexOf("uid") != -1) {
                var friendUid = str.split("uid=")[1];
                if (friendUid.indexOf("&") != -1) {
                    friendUid = friendUid.split("&")[0];
                }
                localStorage.setItem("zqdn_friend_uid", friendUid);
            }
            window.location.href = "http://" + Info.head + ".fcbrains.com/games/" + Info.app + "/index.html";
            return;
        }
        this.GetCookie("uid");
        this.GetCookie("pass");
    };
    return UidUrlManager;
}());
egret.registerClass(UidUrlManager,'UidUrlManager');
