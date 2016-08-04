/**
 * Created by LN on 2016/1/23.
 */
var EndView = (function (_super) {
    __extends(EndView, _super);
    function EndView() {
        _super.call(this);
        DialogManager.remove("GameView");
    }
    var d = __define,c=EndView,p=c.prototype;
    p.createChildren = function () {
        _super.prototype.createChildren.call(this);
        EndView.m_UI = new EndViewSkin();
        this.addChild(EndView.m_UI);
        Advert.getInstance().ShowAdvert("end");
        EndView.m_UI.end_again.touchEnabled = true;
        EndView.m_UI.end_more.touchEnabled = true;
        EndView.m_UI.end_again.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBtnAnimator, this);
        EndView.m_UI.end_more.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickBtnAnimator, this);
        EndView.m_UI.rankButton_quanqiu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuanQiu, this);
        EndView.m_UI.rankButton_gaofen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGaoFen, this);
        EndView.m_UI.curScore_label.text = Info.playerScore.toString();
        this.ChangeShare();
        //从排行榜或本地信息获取各成绩 todo
        NetPlayerRankInfo.getInstance().SubmitPlayerScore();
    };
    //获取运行平台
    p.isAndroidAgents = function () {
        var agent = window.navigator.userAgent.toLowerCase();
        if (("" + agent.match(/android/i)) == "android") {
            console.log("true");
            var url = "http://www.fcbrains.com/web/kjyx/dl/index.html";
            window.location.href = url;
        }
        else {
            console.log("false");
            var url = "http://www.fcbrains.com/web/kjyx/dl/index.html";
            window.location.href = url;
        }
    };
    /**
     * 点击按钮动画
     */
    p.onClickBtnAnimator = function (e) {
        e.target.touchEnabled = false;
        var target = e.currentTarget["_source"].toString();
        var _btn = e.target;
        _btn.scaleX = _btn.scaleY = 1;
        egret.Tween.get(_btn, { loop: false }).to({
            scaleX: 1.1,
            scaleY: 1.1
        }, 100).
            to({ scaleX: 1, scaleY: 1 }, 100).call(function () {
            switch (target) {
                case "TryAgain":
                    this.tryAgain();
                    break;
                case "more":
                    this.more();
                    break;
                case "detail":
                    this.detail();
                    break;
                case "share":
                    this.rankSystem();
                    break;
                default:
                    break;
            }
        }, this);
    };
    p.tryAgain = function () {
        console.log("再试一次");
        DCAgent.onEvent("normal_Again_Click");
        egret.setTimeout(function () {
            DialogManager.open(GameView, "GameView", 1);
        }, this, 500);
    };
    p.more = function () {
        console.log("返回首页");
        DCAgent.onEvent("normal_More_Click");
        egret.setTimeout(function () {
            var url = "http://" + Info.head + ".fcbrains.com/games/zqdn/index.html";
            window.location.href = url;
        }, this, 500);
    };
    p.detail = function () {
        console.log("返回潜能分析");
        egret.setTimeout(function () {
            var url = "http://" + Info.head + ".fcbrains.com/games/fkxt/index.html";
            window.location.href = url;
        }, this, 500);
    };
    p.rankSystem = function () {
        console.log("返回排行榜");
        egret.setTimeout(function () {
            var url = "http://" + Info.head + ".fcbrains.com/games/phxt/index.html";
            window.location.href = url;
        }, this, 500);
    };
    /**
     * 修改分享语 TODO
     */
    p.ChangeShare = function () {
        var shareText = "俺们二次元中出了一个" + Info.playerScore + "分的叛徒，快抓住TA！";
        ShareSDK.Update(shareText);
    };
    p.onQuanQiu = function () {
        EndView.m_UI.rankButton_gaofen.source = "player_rank0";
        EndView.m_UI.rankButton_quanqiu.source = "player_rank1";
        EndView.m_UI.player_rank_list.visible = true;
        EndView.m_UI.player_rank_list1.visible = false;
    };
    p.onGaoFen = function () {
        EndView.m_UI.rankButton_quanqiu.source = "player_rank0";
        EndView.m_UI.rankButton_gaofen.source = "player_rank1";
        EndView.m_UI.player_rank_list.visible = false;
        EndView.m_UI.player_rank_list1.visible = true;
    };
    return EndView;
}(View));
egret.registerClass(EndView,'EndView');
var EndViewSkin = (function (_super) {
    __extends(EndViewSkin, _super);
    function EndViewSkin() {
        _super.call(this);
        this.skinName = "src/skins/EndSkin.exml";
    }
    var d = __define,c=EndViewSkin,p=c.prototype;
    p.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    return EndViewSkin;
}(eui.Component));
egret.registerClass(EndViewSkin,'EndViewSkin');
