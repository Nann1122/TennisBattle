var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.apply(this, arguments);
        this.isThemeLoadEnd = false;
        this.isResourceLoadEnd = false;
        this.isloadover = false;
        this.tempstr = new Array();
        this.tempmusicstr = "";
    }
    var d = __define,c=Main,p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter", assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        //Config loading process interface
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
        if (!Main.isPingTai) {
        }
    };
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    p.onConfigComplete = function (event) {
        var agentConfig = { appId: Info.appDataEyeId };
        DCAgent.init(agentConfig);
        DCAgent.onEvent("normal_Loading_Enter");
        Main.gameLayer = new egret.DisplayObjectContainer;
        this.addChild(Main.gameLayer);
        Main.euiLayer = new eui.UILayer;
        this.addChild(Main.euiLayer);
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    };
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the
     */
    p.onThemeLoadComplete = function () {
        this.isThemeLoadEnd = true;
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "loading") {
            DialogManager.open(LoadingView, "LoadingView", 1);
            RES.loadGroup("preload");
            NetAPI.Init();
            Advert.getInstance().Init();
        }
        if (event.groupName == "preload") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    };
    p.createScene = function () {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.addEventListener(egret.Event.ENTER_FRAME, this.onLoadingWebAudio, this);
        }
    };
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    };
    p.onPingTaiStr = function (response) {
        egret.log("onPingTaiStr: " + response);
        Info.uid = response["uid"];
        Info.pass = response["pass"];
        Info.battleId = response["battleId"];
        Info.vsToken = response["vsToken"];
        if (response["opponents"]) {
            for (var i = 0; i < response["opponents"].length; i++) {
                egret.log(i, "onPingTaiStr", response["opponents"][i]);
                if (response["opponents"][i] != Info.uid) {
                    Info.matchUid = response.opponents[i];
                    egret.log(Info.uid, Info.battleId, Info.vsToken, Info.matchUid);
                }
                if (i == 0) {
                    GameController.getInstance().isFirstHit = true;
                }
            }
        }
        else {
            egret.error("PingTaiStr null!");
        }
    };
    p.startCreateScene = function () {
        Main.leveldata_json = RES.getRes("leveldata");
        Main.teamdata_json = RES.getRes("teamdata");
        Main.modifydata_json = RES.getRes("modifydata");
        //egret.Tween.get(DialogManager.dict1["LoadingView"].m_UI.loading_group).to({alpha:0},200).call(function() {
        //    var shape: egret.Shape = new egret.Shape;
        //    Main.euiLayer.addChild(shape);
        //    shape.graphics.beginFill(0x000000, 1);
        //    shape.graphics.drawRect(0,0,640,960);
        //    shape.graphics.endFill();
        //    egret.Tween.get(shape).to({alpha:0}, 200).call(function() {
        //        Main.euiLayer.removeChild(shape);
        //    });
        //
        //    NetManager.instance.Init ();
        //    ShareSDK.init();
        //    this.Init();
        //}, this);
        if (!Main.isPingTai) {
            NetAPI.Init();
            NetManager.instance.Init();
            ShareSDK.init();
            Advert.getInstance().Init();
        }
        this.Init();
    };
    p.onLoadingWebAudio = function () {
        //egret.log("LoadAudio:"+LoadAudio());
        this.isloadover = LoadAudio();
        if (this.isloadover) {
            //egret.log("load over, isSupportedAudio:", SupportedAudio());
            //console.log(AudioData());
            //GameManager.getInstance().audioDataArr = AudioData();
            //console.log(GameManager.getInstance().audioDataArr);
            this.startCreateScene();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onLoadingWebAudio, this);
            return;
        }
    };
    /**
     * 初始化方法
     */
    p.Init = function () {
        egret.log("Main Init");
        //离开游戏
        //this.stage.addEventListener(egret.Event.DEACTIVATE, function(){console.log(111);}, this);
        //生成声音json "./webaudio/0.mp3",
        //for(var i:number = 0; i < 10; i++)
        //{
        //    var str:string = "\"./webaudio/"+i+".mp3\",";
        //    this.tempstr.push(str);
        //    this.tempmusicstr += str;
        //}
        //console.log(this.tempmusicstr);
        if (Main.isPingTai) {
            DialogManager.open(GameView, "GameView", 1);
            GameManager.getInstance().PlayNet();
            this.addEventListener(egret.Event.ENTER_FRAME, this.onPingTaiEvent, this);
        }
        else {
            //DCAgent.onEvent("normal_Title_Enter");
            DialogManager.open(GameSelectView, "GameSelectView", 1);
        }
    };
    p.onPingTaiEvent = function () {
        if (Info.isPingtaiStr) {
            NetServerConnect.getInstance().ConnectPingTai();
            //todo  load玩家头像、昵称
            MessageManager.getInstance().LoadPlayerInfo();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onPingTaiEvent, this);
        }
    };
    Main.isPingTai = false;
    return Main;
}(eui.UILayer));
egret.registerClass(Main,'Main');
