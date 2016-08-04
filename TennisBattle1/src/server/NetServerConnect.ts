/**
 * Created by LN on 2016/7/27.
 */
class NetServerConnect
{
    private static instance:NetServerConnect;
    public static getInstance():NetServerConnect
    {
        if(NetServerConnect.instance == null)
        {
            NetServerConnect.instance = new NetServerConnect();
            //添加监听事件
            NetServerConnect.instance.onServerMessage();
        }
        return NetServerConnect.instance;
    }

    public pomelo:Pomelo = new Pomelo();

    public ConnectWeiXin()
    {
        console.log("NetServer--WeiXin");
        this.ConnectionGate();
    }
    public DisConnectWeiXin()
    {
        console.log("NetServer--DisConnectWeiXin");
        var that = this;
        //18.断开对战服务器连接
        that.pomelo.disconnect();
        //22.连接大厅服务器
        that.pomelo.init({
            host:that.hallHost,
            port:that.hallPort
        }, function() {
            console.log("22.ConnectionHall success");

            //23.进入大厅
            that.EnterHallToQuit();
        });
    }

    public ConnectPingTai()
    {
        egret.log("NetServer--PingTai");

        var that = this;
        //9.断开大厅服务器连接
        that.pomelo.disconnect();
        //10.连接Gate服务器
        that.pomelo.init({
            host:that.gataHost,
            port:that.gataPort
        }, function(){
            console.log('ConnectionGate success');
            that.getVSEntry();
        });
    }
    public DisConnectPingTai()
    {
        console.log("NetServer--DisConnectPingTai");
        this.pomelo.disconnect();

        var url = "http://www.fcbrains.com?score=" + Info.playerScore + "&json=" + Info.matchResult;
        window.location.href = url;
    }

    private gataHost:string = "192.168.199.251";
    //private gataHost:string = "dev.fcbrains.com";

    private gataPort:string = "3000";
    //1.连接Gate服务器
    public ConnectionGate()
    {
        var that = this;
        that.pomelo.init({
            host:that.gataHost,
            port:that.gataPort
        }, function(){
            console.log('ConnectionGate success');

            //2.
            that.getHallServerAddress();
        });
    }

    public hallHost:string = "192.168.199.250";
    public hallPort:string = "3010";
    //2.通过Gate服务器获取大厅服务器地址
    public getHallServerAddress()
    {
        var that = this;
        that.pomelo.request('gate.gateHandler.queryHallEntry', {uid: Info.uid}, function(response){
            console.log("2.getHallServerAddress code: ", response.code);
            if (response.code === 0) {
                // 连接成功
                console.log("2.getHallServerAddress: ", response);
                that.hallHost = response.host;
                that.hallPort = response.port;
                console.log("2.getHallServerAddress1: ", that.hallHost, that.hallPort);
                //3.断开Gate服务器连接
                that.pomelo.disconnect();
                that.ConnectionHall();
            }
        });
    }

    //4.连接大厅服务器
    public ConnectionHall()
    {
        var that = this;
        that.pomelo.init({
            host:that.hallHost,
            port:that.hallPort
        }, function() {
            console.log("4.ConnectionHall success");
            that.EnterHall();
        });
    }

    //5.进入大厅
    public EnterHall()
    {
        var that = this;
        that.pomelo.request('hallConnector.hallEntryHandler.enter', {platform:Info.platform, channel:Info.channel, uid:Info.uid, pass:Info.pass}, function(response){
            console.log("5.EnterHall code: ", response.code);
            if (response.code === 0) {
                // 连接成功 TODO
                console.log("5.EnterHall:", response);

                if(!response.gameId)
                {
                    that.EnterGameHall();
                }
                else
                {
                    //已经在游戏厅，先退出游戏厅再进入 TODO
                    console.log("5.response.gameId: ",response.gameId, Info.gameId);
                    that.QuitGameHallToEnter();
                }
            }
        });
    }

    //先退出游戏厅再进入
    private bQuitGameHall:boolean = false;
    private QuitGameHallToEnter()
    {
        var that = this;
        //console.log("QuitGameHallToEnter", that.bQuitGameHall);
        that.pomelo.request('hallEngine.hallHandler.leaveGameHall', {force:that.bQuitGameHall}, function(response){
            console.log("QuitGameHallToEnter code: ", response.code);
            if (response.code === 0 || response.code ===50108) {
                console.log("QuitGameHallToEnter success");
                that.EnterGameHall();
            }
            else
            {
                that.bQuitGameHall = true;
                that.QuitGameHallToEnter();
                that.bQuitGameHall = false;
            }
        });
    }

    private gameId:any;
    private tableId:any;
    private tableName:any;
    //6.进入游戏厅
    public EnterGameHall()
    {
        var that = this;
        that.pomelo.request('hallEngine.hallHandler.enterGameHall', {gameId: Info.gameId, autoJoin:true}, function(response){
            console.log("6.EnterGameHall code: ", response.code);
            if (response.code === 0) {
                console.log("6.EnterGameHall: ", response);

                that.gameId = response["gameId"];
                that.tableId = response["table"]["tableId"];
                that.tableName = response["table"]["tableName"];
                console.log(that.gameId,that.tableId,that.tableName);

                that.handlerPlayerReady();
            }
            //if(response.code === 50103)
            //{
            //    that.QuitGameHallToEnter();
            //}
        });
    }

    //7.游戏准备
    public handlerPlayerReady()
    {
        var that = this;
        that.pomelo.request('hallEngine.hallHandler.playerReady', {}, function(response){
            console.log("7.handlerPlayerReady code: ", response.code);
            if (response.code === 0) {
                console.log("7.handlerPlayerReady success");
            }
        });
    }

    private battleId:any;
    private vsToken:any;
    private oppenents:any;
    //8.大厅服务器通知客户端对战信息
    //public onBattleLaunch()
    //{
    //    var that = this;
    //}

    public vsHost:string = "192.168.199.250";
    public vsPort:string = "3030";
    //11.通过Gate服务器获取对战服务器地址
    public getVSEntry() {
        var that = this;
        that.pomelo.request('gate.gateHandler.queryVsEntry', {uid: Info.uid}, function (response) {
            if (response.code === 0) {
                // 连接成功
                console.log("11.getVSEntry: " + response);
                that.vsHost = response.host;
                that.vsPort = response.port;
                console.log("11.getVSEntry1: ", that.vsHost, that.vsPort);
                //12.断开Gate服务器连接
                that.pomelo.disconnect();
                that.ConnectionVS();
            }
        });
    }

    //13.连接对战服务器
    public ConnectionVS()
    {
        var that = this;
        that.pomelo.init({
            host:that.vsHost,
            port:that.vsPort
        }, function(){
            console.log("13.ConnectionVS success");
            that.EnterVSHandler();
        });
    }

    //14.加入对战
    public EnterVSHandler()
    {
        var that = this;
        console.log(Info.battleId,Info.uid,Info.vsToken);
        that.pomelo.request('vsConnector.vsEntryHandler.enter', {battleId:Info.battleId, uid:Info.uid, vsToken:Info.vsToken}, function (response) {
            //console.log("14.EnterVSHandler 0 : " + response);
            if (response.code === 0) {
                // 连接成功
                console.log("14.EnterVSHandler: " + response);

                MessageManager.getInstance().onBattleStart(response);
            }
        });
    }

    //15.对战服务器向客户端推送对战场景数据
    public onServerMessage()
    {
        var that = this;

        //8.大厅服务器通知客户端对战信息  todo -weixin
        that.pomelo.on('onBattleLaunch', function(response):void {
            // response 对象就是服务器推送回来的对象
            console.log("8.onBattleLaunch: " + response);

            Info.battleId = response.battleId;
            Info.vsToken = response.vsToken;
            //Info.opponents = response.opponents;
            for(var i:number = 0; i < response.opponents.length; i++)
            {
                //console.log(i,"oppenents",Info.opponents[i]);
                if(response.opponents[i] != Info.uid)
                {
                    Info.matchUid = response.opponents[i];
                    console.log(Info.battleId, Info.vsToken, Info.matchUid);

                    if(i == 0)
                    {
                        GameController.getInstance().isFirstHit = true;
                    }

                    //todo  load玩家头像、昵称
                    MessageManager.getInstance().LoadPlayerInfo();
                }
            }

            //9.断开大厅服务器连接
            that.pomelo.disconnect();
            //10.连接Gate服务器
            that.pomelo.init({
                host:that.gataHost,
                port:that.gataPort
            }, function(){
                console.log('ConnectionGate success');
                that.getVSEntry();
            });
        });

        //初始化客户端场景
        //that.pomelo.on('onBattleStart', function(response):void {
        //    console.log("15.onBattleStart: " + response);
        //});


        //TODO  接受对手同步消息
        that.pomelo.on('onSyncData', function(response):void {
            //console.log("15.onSyncData: " + response["msgType"] + response["msg"]);

            MessageManager.getInstance().onReceiveInfo(response);
        });

        //17.对战服务器通知客户端对战结束
        that.pomelo.on('onBattleFinish', function(response):void {
            console.log("17.onBattleFinish" + response);

            //18.断开对战服务器连接
            that.pomelo.disconnect();
            //22.连接大厅服务器
            that.pomelo.init({
                host:that.hallHost,
                port:that.hallPort
            }, function() {
                console.log("22.ConnectionHall success");

                //23.进入大厅
                that.EnterHallToQuit();
            });
        });
    }

    //16.客户端向对战服务器同步游戏操作    TODO
    public syncBattleOp(info:any)
    {
        var that = this;
        console.log("16.syncBattleOp success0--",info);
        that.pomelo.request('vsEngine.vsEngineHandler.syncBattleOp', info, function (response) {
            if(response.code === 0)
            {
                console.log("16.syncBattleOp success",info);
            }
        });
    }

    //17.对战服务器通知客户端对战结束
    //public onBattleFinish()
    //{
    //    var that = this;
    //}

    //20.通过Gate服务器获取大厅服务器地址
    //21: 断开Gate服务器连接

    //23.进入大厅
    public EnterHallToQuit()
    {
        var that = this;
        that.pomelo.request('hallConnector.hallEntryHandler.enter', {platform:Info.platform, channel:Info.channel, uid:Info.uid, pass:Info.pass}, function(response){
            if (response.code === 0) {
                // 连接成功 TODO
                console.log("23.EnterHallToDrop:", response);
                that.QuitHall();
            }
        });
    }

    //24.退出大厅
    private bQuitHall:boolean = false;
    public QuitHall()
    {
        var that = this;
        console.log("QuitHall: ", that.bQuitHall);
        that.pomelo.request('hallEngine.hallHandler.quit', {force:that.bQuitHall}, function(response){
            console.log("24.QuitHall code", response.code);
            if (response.code === 0) {
                console.log("24.QuitHall success");

                //25.断开对战服务器连接
                that.pomelo.disconnect();
            }
            else
            {
                that.bQuitHall = true;
                that.QuitHall();
                that.bQuitHall = false;
            }
        });
    }
}