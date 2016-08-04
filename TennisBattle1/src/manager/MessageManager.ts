/**
 * Created by LN on 2016/6/28.
 */
class MessageManager
{
    private static instance:MessageManager;
    public static getInstance():MessageManager {
        if(this.instance == null) {
            this.instance = new MessageManager();
        }
        return this.instance;
    }

    public LoadPlayerInfo()
    {
        if(Main.isPingTai)
        {
            GameView.m_UI.name_self.text = Info.nickname;
            GameView.m_UI.name_match.text = Info.matchNickname;
            RES.getResByUrl(Info.iconUrl, this.onGetPicComplete, this,RES.ResourceItem.TYPE_IMAGE);
            RES.getResByUrl(Info.matchIconUrl, this.onGetMatchPicComplete, this,RES.ResourceItem.TYPE_IMAGE);
        }
        else
        {
            GameView.m_UI.head_self.source = Info.icon;
            GameView.m_UI.name_self.text = Info.nickname;
            NetPlayerInfo.getInstance().GetPlayerInfo();
        }
    }
    /**
     * 获取玩家头像
     */
    private onGetPicComplete (_pic : egret.Texture)
    {
        if (_pic != null) {
            GameView.m_UI.head_self.source = _pic;
        }
    }
    private onGetMatchPicComplete (_pic : egret.Texture)
    {
        if (_pic != null) {
            GameView.m_UI.head_match.source = _pic;
        }
    }


    public onBattleStart(message:any)
    {
        GameController.getInstance().GameBegin();
        //egret.setTimeout(function(){
        //    GameController.getInstance().GameBegin();
        //},this,1000);
    }

    public onReceiveInfo(info:any)
    {
        var style:number = info["msgType"];
        var message:any = info["msg"];
        if(style == 1)
        {
            //console.log("onReceiveInfo: pos");
            var matchPosX:number = message["x"];
            var matchPosY:number = message["y"];

            GameController.getInstance().regulateMatchPos(matchPosX, matchPosY);
        }
        else if(style == 2)
        {
            //console.log("onReceiveInf: ball");
            var ballPosX:number = message["x"];
            var ballPosY:number = message["y"];
            var ballRotation:number = message["rotation"];
            var ballSpeed:number = message["speed"];

            GameController.getInstance().regulateBallAttribute(ballPosX,ballPosY,ballRotation,ballSpeed);
        }
    }

}