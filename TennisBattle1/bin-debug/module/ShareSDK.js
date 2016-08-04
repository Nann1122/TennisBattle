var ShareSDK;
(function (ShareSDK) {
    var url;
    var desc;
    var imgUrl;
    var appId = "";
    var nonceStr = "";
    var timestamp = "";
    var signature = "";
    function Update(_title) {
        ShareSDK.title = _title;
        getWeiXinShareTimeline(); //分享朋友圈
        getWeiXinShareAppMessage(); //分享朋友
        getWeiXinShareQQ(); //分享QQ
        getWeiXinShareWeiBo(); //分享到腾讯微博
    }
    ShareSDK.Update = Update;
    function init() {
        console.log("initShareSDK");
        //初始化分享内容
        ShareSDK.title = "地球人注意啦，一大波萝莉正在逼近！";
        desc = "非常大脑之守护二次元！";
        ShareSDK.link = "http://" + Info.head + ".fcbrains.com/games/" + Info.app + "/index.html?uid=" + Info.uid;
        imgUrl = "http://" + Info.head + ".fcbrains.com/games/" + Info.app + "/img/icon.png";
        //你的后端数据JSON入口
        url = "http://" + Info.head + ".fcbrains.com/" + Info.app + "/mpjsauthinfo";
        //获取签名
        getSignPackage();
    }
    ShareSDK.init = init;
    /**
     * 获取签名分享
     */
    var urlloader;
    function getSignPackage() {
        urlloader = new egret.URLLoader();
        var req = new egret.URLRequest(url);
        urlloader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        req.method = egret.URLRequestMethod.GET;
        urlloader.addEventListener(egret.Event.CONNECT, onConnected, this);
        urlloader.addEventListener(egret.Event.COMPLETE, onCompleteGetJson, this);
        urlloader.addEventListener(egret.IOErrorEvent.IO_ERROR, function (e) {
            console.error("WeiXin 注入失败!!");
        }, this);
        urlloader.load(req);
    }
    function onConnected(e) {
        console.log("connect");
    }
    function onCompleteGetJson(event) {
        //console.log("getJson");
        var signPackageTemp = JSON.parse(urlloader.data.toString());
        console.log(signPackageTemp);
        appId = signPackageTemp["appId"];
        //console.log(appId);
        timestamp = signPackageTemp["timestamp"];
        //console.log(timestamp);
        nonceStr = signPackageTemp["nonceStr"];
        //console.log(nonceStr);
        signature = signPackageTemp["signature"];
        //console.log(signature);
        //基本配置
        getWeiXinConfig();
        getWeiXinShareTimeline(); //分享朋友圈
        //getWeiXinShareAppMessage();//分享朋友
        //getWeiXinShareQQ();//分享QQ
        //getWeiXinShareWeiBo();//分享到腾讯微博
    }
    /**
     * 获取微信配置
     */
    function getWeiXinConfig() {
        //console.log("getWeixinConfig");
        /*
         * 注意：
         * 1. 所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
         * 2. 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
         * 3. 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
         *
         * 如有问题请通过以下渠道反馈：
         * 邮箱地址：weixin-open@qq.com
         * 邮件主题：【微信JS-SDK反馈】具体问题
         * 邮件内容说明：用简明的语言描述问题所在，并交代清楚遇到该问题的场景，可附上截屏图片，微信团队会尽快处理你的反馈。
         */
        //配置参数
        var bodyConfig = new BodyConfig();
        bodyConfig.debug = false; // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        bodyConfig.appId = appId; // 必填，公众号的唯一标识
        bodyConfig.timestamp = timestamp; // 必填，生成签名的时间戳
        bodyConfig.nonceStr = nonceStr; // 必填，生成签名的随机串
        bodyConfig.signature = signature; // 必填，签名，见附录1
        bodyConfig.jsApiList = [
            // 所有要调用的 API 都要加到这个列表中
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard' //查看微信卡包中的卡券接口
        ];
        wx.config(bodyConfig);
        //console.log("weixinConfig complete");
    }
    /**
     * 获取微信分享到朋友圈
     */
    var bodyMenuShareTimeline = new BodyMenuShareTimeline();
    function getWeiXinShareTimeline() {
        bodyMenuShareTimeline.title = ShareSDK.title;
        bodyMenuShareTimeline.link = ShareSDK.link;
        bodyMenuShareTimeline.imgUrl = imgUrl;
        bodyMenuShareTimeline.trigger = function () {
            //alert('用户点击分享到朋友圈');
        };
        bodyMenuShareTimeline.success = function () {
            DCAgent.onEvent('normal_Share_Event');
            //alert('已分享');
        };
        bodyMenuShareTimeline.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareTimeline.fail = function (res) {
            //alert(JSON.stringify(res));
        };
        wx.onMenuShareTimeline(bodyMenuShareTimeline);
    }
    /**
     * 获取微信分享到朋友
     */
    var bodyMenuShareAppMessage = new BodyMenuShareAppMessage();
    function getWeiXinShareAppMessage() {
        bodyMenuShareAppMessage.title = ShareSDK.title;
        bodyMenuShareAppMessage.desc = desc;
        bodyMenuShareAppMessage.link = ShareSDK.link;
        bodyMenuShareAppMessage.imgUrl = imgUrl;
        bodyMenuShareAppMessage.trigger = function () {
            //alert('用户点击发送给朋友');
        };
        bodyMenuShareAppMessage.success = function () {
            DCAgent.onEvent('normal_Share_Event');
            //alert('已分享');
        };
        bodyMenuShareAppMessage.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareAppMessage.fail = function (res) {
            //alert(JSON.stringify(res));
        };
        wx.onMenuShareAppMessage(bodyMenuShareAppMessage);
    }
    /**
     * 获取微信分享到QQ
     */
    var bodyMenuShareQQ = new BodyMenuShareQQ();
    function getWeiXinShareQQ() {
        bodyMenuShareQQ.title = ShareSDK.title;
        bodyMenuShareQQ.desc = desc;
        bodyMenuShareQQ.link = ShareSDK.link;
        bodyMenuShareQQ.imgUrl = imgUrl;
        bodyMenuShareQQ.trigger = function () {
            //alert('用户点击分享到QQ');
        };
        bodyMenuShareQQ.complete = function (res) {
            //alert(JSON.stringify(res));
        };
        bodyMenuShareQQ.success = function () {
            DCAgent.onEvent('normal_Share_Event');
            //alert('已分享');
        };
        bodyMenuShareQQ.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareQQ.fail = function (res) {
            //alert(JSON.stringify(res));
        };
        wx.onMenuShareQQ(bodyMenuShareQQ);
        //alert('已注册获取“分享到QQ”状态事件');
    }
    /**
     * 获取微信分享到腾讯微博
     */
    var bodyMenuShareWeibo = new BodyMenuShareWeibo();
    function getWeiXinShareWeiBo() {
        bodyMenuShareWeibo.title = ShareSDK.title;
        bodyMenuShareWeibo.desc = desc;
        bodyMenuShareWeibo.link = ShareSDK.link;
        bodyMenuShareWeibo.imgUrl = imgUrl;
        bodyMenuShareWeibo.trigger = function () {
            //alert('用户点击分享到微博');
        };
        bodyMenuShareWeibo.complete = function (res) {
            //alert(JSON.stringify(res));
        };
        bodyMenuShareWeibo.success = function () {
            DCAgent.onEvent('normal_Share_Event');
            //alert('已分享');
        };
        bodyMenuShareWeibo.cancel = function () {
            //alert('已取消');
        };
        bodyMenuShareWeibo.fail = function (res) {
            //alert(JSON.stringify(res));
        };
        wx.onMenuShareWeibo(bodyMenuShareWeibo);
        //alert('已注册获取“分享到微博”状态事件');
    }
})(ShareSDK || (ShareSDK = {}));
