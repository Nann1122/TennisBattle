/**
 * Created by LN on 2016/4/25.
 */
class GameManager
{
    private static instance:GameManager;
    public static getInstance():GameManager
    {
        if(GameManager.instance == null)
        {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    public allLevelNum:number = 15;

    //暂停
    public isPause:boolean = false;
    public isGameOver:boolean = false;

    public isSingle:boolean = false;
    public isNet:boolean = false;
    public PlaySingle()
    {
        this.isSingle = true;
        this.isNet = false;

        GameController.getInstance().GameBegin();
    }
    public PlayNet() {
        this.isSingle = false;
        this.isNet = true;

        //TODO
        if (!Main.isPingTai)
        {
            NetServerConnect.getInstance().ConnectWeiXin();
        }
    }

    private oldTime:number;//记录老时间
    private nowTime:number;//现在的时间
    public betweenTime : number;
    public TimeBegin()
    {
        this.oldTime =egret.getTimer();
        this.nowTime=egret.getTimer();
        Main.euiLayer.addEventListener(egret.Event.ENTER_FRAME,this.TimeFrame,this);
    }
    public TimeEnd()
    {
        this.betweenTime = 0;
        Main.euiLayer.removeEventListener(egret.Event.ENTER_FRAME,this.TimeFrame,this);
    }
    private TimeFrame()
    {
        this.oldTime=this.nowTime;
        this.nowTime=egret.getTimer();
        this.betweenTime= this.nowTime-this.oldTime;
    }

    //检测碰撞
    public static hitTest(obj1: egret.DisplayObject,obj2: egret.DisplayObject): boolean
    {
        var rect1: egret.Rectangle = obj1.getBounds();
        var rect2: egret.Rectangle = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    }

}