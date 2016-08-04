/**
 * Created by LN on 2016/7/21.
 */
var NetServerPingTai = (function () {
    function NetServerPingTai() {
        this.pomelo = new Pomelo();
        this.gataHost = "192.168.199.251";
        this.gataPort = "3000";
        this.vsHost = "192.168.199.250";
        this.vsPort = "3030";
        //24.退出大厅
        this.bQuitHall = false;
    }
    var d = __define,c=NetServerPingTai,p=c.prototype;
    NetServerPingTai.getInstance = function () {
        if (NetServerPingTai.instance == null) {
            NetServerPingTai.instance = new NetServerPingTai();
            //添加监听事件
            NetServerPingTai.instance.onServerMessage();
        }
        return NetServerPingTai.instance;
    };
    p.Init = function () {
        console.log("NetServer--PingTai");
        //this.onBattleLaunch();
    };
    //private gataHost:string = "dev.fcbrains.com";
    //private gataPort:string = "3000";
    //8.大厅服务器通知客户端对战信息
    p.onBattleLaunch = function () {
        var that = this;
        //10.连接Gate服务器
        that.pomelo.init({
            host: that.gataHost,
            port: that.gataPort
        }, function () {
            console.log('ConnectionGate success');
            that.getVSEntry();
        });
    };
    //11.通过Gate服务器获取对战服务器地址
    p.getVSEntry = function () {
        var that = this;
        that.pomelo.request('gate.gateHandler.queryVsEntry', { uid: Info.uid }, function (response) {
            if (response.code === 0) {
                // 连接成功
                console.log("11.getVSEntry: " + response);
                that.vsHost = response.host;
                that.vsPort = response.port;
                egret.log("11.getVSEntry1: ", that.vsHost, that.vsPort);
                //12.断开Gate服务器连接
                that.pomelo.disconnect();
                that.ConnectionVS();
            }
        });
    };
    //13.连接对战服务器
    p.ConnectionVS = function () {
        var that = this;
        that.pomelo.init({
            host: that.vsHost,
            port: that.vsPort
        }, function () {
            egret.log("13.ConnectionVS success");
            that.EnterVSHandler();
        });
    };
    //14.加入对战
    p.EnterVSHandler = function () {
        var that = this;
        console.log(Info.battleId, Info.uid, Info.vsToken);
        that.pomelo.request('vsConnector.vsEntryHandler.enter', { battleId: Info.battleId, uid: Info.uid, vsToken: Info.vsToken }, function (response) {
            //console.log("14.EnterVSHandler 0 : " + response);
            if (response.code === 0) {
                // 连接成功
                egret.log("14.EnterVSHandler: " + response);
                MessageManager.getInstance().onBattleStart(response);
            }
        });
    };
    //15.对战服务器向客户端推送对战场景数据
    p.onServerMessage = function () {
        var that = this;
        ////初始化客户端场景  todo
        //that.pomelo.on('onBattleStart', function(response):void {
        //    console.log("15.onBattleStart: " + response);
        //
        //});
        //TODO  接受对手同步消息
        that.pomelo.on('onSyncData', function (response) {
            //console.log("15.onSyncData: " + response["msgType"] + response["msg"]);
            MessageManager.getInstance().onReceiveInfo(response);
        });
        ////17.对战服务器通知客户端对战结束
        //that.pomelo.on('onBattleFinish', function(response):void {
        //    console.log("17.onBattleFinish" + response);
        //
        //    //18.断开对战服务器连接
        //    that.pomelo.disconnect();
        //    //22.连接大厅服务器
        //    that.pomelo.init({
        //        host:that.hallHost,
        //        port:that.hallPort
        //    }, function() {
        //        console.log("22.ConnectionHall success");
        //
        //        //23.进入大厅
        //        that.EnterHallToQuit();
        //    });
        //});
    };
    //16.客户端向对战服务器同步游戏操作    TODO
    p.syncBattleOp = function (info) {
        var that = this;
        that.pomelo.request('vsEngine.vsEngineHandler.syncBattleOp', info, function (response) {
            if (response.code === 0) {
            }
        });
    };
    //17.对战服务器通知客户端对战结束
    //public onBattleFinish()
    //{
    //    var that = this;
    //}
    //20.通过Gate服务器获取大厅服务器地址
    //21: 断开Gate服务器连接
    //23.进入大厅
    p.EnterHallToQuit = function () {
        var that = this;
        that.pomelo.request('hallConnector.hallEntryHandler.enter', { platform: Info.platform, channel: Info.channel, uid: Info.uid, pass: Info.pass }, function (response) {
            if (response.code === 0) {
                // 连接成功 TODO
                console.log("23.EnterHallToDrop:", response);
                that.QuitHall();
            }
        });
    };
    p.QuitHall = function () {
        var that = this;
        console.log("QuitHall: ", that.bQuitHall);
        that.pomelo.request('hallEngine.hallHandler.quit', { force: that.bQuitHall }, function (response) {
            console.log("24.QuitHall code", response.code);
            if (response.code === 0) {
                console.log("24.QuitHall success");
                //25.断开对战服务器连接
                that.pomelo.disconnect();
            }
            else {
                that.bQuitHall = true;
                that.QuitHall();
                that.bQuitHall = false;
            }
        });
    };
    return NetServerPingTai;
}());
egret.registerClass(NetServerPingTai,'NetServerPingTai');
