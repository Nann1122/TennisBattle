/**
 * Created by LN on 2016/1/23.
 */
class EndView extends View {

    public static m_UI: EndViewSkin;
    public constructor ()
    {
        super ();
        DialogManager.remove("GameView");
    }

    public createChildren ()
    {
        super.createChildren ();
        EndView.m_UI = new EndViewSkin ();
        this.addChild( EndView.m_UI );
        Advert.getInstance().ShowAdvert("end");

        EndView.m_UI.end_again.touchEnabled=true;
        EndView.m_UI.end_more.touchEnabled=true;
        EndView.m_UI.end_again.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickBtnAnimator,this);
        EndView.m_UI.end_more.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickBtnAnimator,this);
        EndView.m_UI.rankButton_quanqiu.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onQuanQiu, this);
        EndView.m_UI.rankButton_gaofen.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGaoFen, this);

        EndView.m_UI.curScore_label.text = Info.playerScore.toString();

        this.ChangeShare();
        //从排行榜或本地信息获取各成绩 todo
        NetPlayerRankInfo.getInstance().SubmitPlayerScore();
    }

    //获取运行平台
    public isAndroidAgents()
    {
        var agent = window.navigator.userAgent.toLowerCase();
        if(("" + agent.match(/android/i)) == "android") {
            console.log("true");

            var url : string = "http://www.fcbrains.com/web/kjyx/dl/index.html";
            window.location.href = url;

        } else {
            console.log("false");

            var url : string = "http://www.fcbrains.com/web/kjyx/dl/index.html";
            window.location.href = url;
        }
    }

    /**
     * 点击按钮动画
     */
    private onClickBtnAnimator (e : egret.Event)
    {
        e.target.touchEnabled = false;
        var target = e.currentTarget["_source"].toString();
        var _btn = e.target;
        _btn.scaleX = _btn.scaleY = 1;
        egret.Tween.get(_btn, {loop: false}).to({
            scaleX: 1.1,
            scaleY: 1.1
        }, 100).
            to({scaleX:1,scaleY:1}, 100).call(function() {
                switch (target) {
                    case "TryAgain":
                        this.tryAgain()
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
                    default :
                        break;
                }
            }, this);
    }

    private tryAgain () {
        console.log("再试一次");
        DCAgent.onEvent("normal_Again_Click");

        egret.setTimeout(function() {
            DialogManager.open(GameView,"GameView",1);
        }, this, 500);

    }

    private more () {

        console.log("返回首页");
        DCAgent.onEvent("normal_More_Click");

        egret.setTimeout(function(){
            var url = "http://" + Info.head + ".fcbrains.com/games/zqdn/index.html";
            window.location.href = url;
        },this, 500);



    }

    private detail () {
        console.log("返回潜能分析");

        egret.setTimeout(function(){
            var url = "http://" + Info.head + ".fcbrains.com/games/fkxt/index.html";
            window.location.href = url;
        },this, 500);
    }

    private rankSystem () {
        console.log("返回排行榜");

        egret.setTimeout(function(){
            var url = "http://" + Info.head + ".fcbrains.com/games/phxt/index.html";
            window.location.href = url;
        },this, 500);
    }

    /**
     * 修改分享语 TODO
     */
    private ChangeShare ()
    {
        var shareText : string = "俺们二次元中出了一个"+ Info.playerScore +"分的叛徒，快抓住TA！";
        ShareSDK.Update(shareText);
    }

    private onQuanQiu(){

        EndView.m_UI.rankButton_gaofen.source = "player_rank0";
        EndView.m_UI.rankButton_quanqiu.source = "player_rank1";
        EndView.m_UI.player_rank_list.visible=true;
        EndView.m_UI.player_rank_list1.visible=false;

    }
    private onGaoFen(){
        EndView.m_UI.rankButton_quanqiu.source = "player_rank0";
        EndView.m_UI.rankButton_gaofen.source = "player_rank1";
        EndView.m_UI.player_rank_list.visible=false;
        EndView.m_UI.player_rank_list1.visible=true;
    }

}

class EndViewSkin extends eui.Component {
    public constructor ()
    {
        super ();

        this.skinName = "src/skins/EndSkin.exml";
    }

    public partAdded(partName:string, instance:any):void
    {
        super.partAdded(partName, instance);
    }

    public player_rank_group:eui.Group;
    public player_rank_list:eui.Group;
    public player_rank_list1:eui.Group;

    public rankButton_quanqiu:eui.Image;
    public rankButton_gaofen:eui.Image;
    public end_again:eui.Image;
    public end_more:eui.Image;

    public curScore_label:eui.Label;

}

