/**
 * Created by LN on 2016/7/18.
 */
enum BallState
{
    ball_free,
    ball_matchfield,
    ball_range0,    //-0.4
    ball_range1,    //0
    ball_range2,    //0.5
    ball_fail,
    ball_success
}

class TennisBall extends eui.Group
{
    public constructor()
    {
        super();

        this.Init();
    }

    private commonLength:number = 50;

    public ballImage:eui.Image;

    public ballfieldWidth:number = 500;
    public ballfieldHeight:number = 800;
    public ballNetLength:number = 300;

    public tempfieldWidth:number;
    public tempfieldHeight:number;

    public ballState:BallState;

    public position:Vector2;
    private Init()
    {
        var commonLength:number = this.commonLength;

        this.width = this.height = commonLength;
        this.anchorOffsetX = this.anchorOffsetY = commonLength*0.5;
        this.x = 320;
        this.y = 480;
        this.position = new Vector2(this.x, this.y);
        this.touchEnabled = false;

        GameView.m_UI.scene_group.addChild(this);

        this.ballImage = new eui.Image("ball");
        this.ballImage.width = this.ballImage.height = commonLength;
        this.ballImage.anchorOffsetX = this.ballImage.anchorOffsetY = commonLength*0.5;
        this.ballImage.x = this.width*0.5;
        this.ballImage.y = this.height*0.5;
        this.ballImage.touchEnabled = false;
        this.addChild(this.ballImage);

        this.rotation = 90;

        this.ballfieldWidth = GameController.getInstance().ballfieldWidth;
        this.ballfieldHeight = GameController.getInstance().ballfieldHeight;
        this.ballNetLength = GameController.getInstance().ballNetLength;

        this.tempfieldWidth = (640 - this.ballfieldWidth)*0.5;
        this.tempfieldHeight = (960 - this.ballfieldHeight)*0.5;

        this.ballState = BallState.ball_free;

        GameView.m_UI.scene_group.addEventListener(egret.Event.ENTER_FRAME, this.onMoveToFront, this);
    }

    public ballDirection:number = 0;
    public ballSpeed:number = 0;
    private ballSpeedX:number = 0;
    private ballSpeedY:number = 0;
    private onMoveToFront()
    {
        var tempfieldHeight:number = this.tempfieldHeight;
        var tempfieldWidth:number = this.tempfieldWidth;
        var tempNetHeight:number = this.ballNetLength*0.5;
        var netUpY:number = 480-tempNetHeight - GameController.getInstance().netAddMatch;
        var netDownY:number = 480+tempNetHeight + GameController.getInstance().netAddSelf;
        //console.log(tempfieldWidth,tempNetHeight,netUpY,netDownY);

        this.ballDirection = this.rotation;
        var radian:number = this.ballDirection*Math.PI/180;

        this.ballSpeedX = Math.round(this.ballSpeed*Math.cos(radian));
        this.ballSpeedY = Math.round(this.ballSpeed*Math.sin(radian));

        //console.log(this.ballDirection,radian,this.ballSpeedX, this.ballSpeedY);

        this.x += this.ballSpeedX*GameManager.getInstance().betweenTime*0.001;
        this.y += this.ballSpeedY*GameManager.getInstance().betweenTime*0.001;
        this.position = new Vector2(this.x, this.y);

        //todo
        if(this.x > (640-tempfieldWidth) || this.x < tempfieldWidth)
        {
            if(this.y <= netDownY && this.y >= netUpY)
            {
                if(this.rotation >= 0)
                {
                    this.rotation = 180 - this.ballDirection;
                }
                else
                {
                    this.rotation = -180 - this.ballDirection;
                }
                if(this.x > (640-tempfieldWidth))
                {
                    this.x = (640-tempfieldWidth);
                }
                else if(this.x < tempfieldWidth)
                {
                    this.x = tempfieldWidth;
                }
            }
            else
            {
                console.log("stopX: ",this.x,this.y);
                this.ballSpeed = 0;
                this.BallEnd();
                GameView.m_UI.scene_group.removeEventListener(egret.Event.ENTER_FRAME, this.onMoveToFront, this);
            }
        }

        if(this.y > (960-tempfieldHeight) || this.y < tempfieldHeight)
        {
            console.log("stopY: ",this.x,this.y);
            this.ballSpeed = 0;
            this.BallEnd();
            GameView.m_UI.scene_group.removeEventListener(egret.Event.ENTER_FRAME, this.onMoveToFront, this);
        }

        ////Temp!!todo
        //if(this.x > (640-tempfieldWidth) || this.x < tempfieldWidth)
        //{
        //    if(this.rotation >= 0)
        //    {
        //        this.rotation = 180 - this.ballDirection;
        //    }
        //    else
        //    {
        //        this.rotation = -180 - this.ballDirection;
        //    }
        //    if(this.x > (640-tempfieldWidth))
        //    {
        //        this.x = (640-tempfieldWidth);
        //    }
        //    else if(this.x < tempfieldWidth)
        //    {
        //        this.x = tempfieldWidth;
        //    }
        //}
        //if(this.y > (960-this.tempfieldHeight) || this.y < this.tempfieldHeight)
        //{
        //    this.rotation = -this.ballDirection;
        //    if(this.y > (960-this.tempfieldHeight))
        //    {
        //        this.y = (960-this.tempfieldHeight);
        //    }
        //    else if(this.y < this.tempfieldHeight)
        //    {
        //        this.y = this.tempfieldHeight;
        //    }
        //}

        //if(this.x > 640 || this.x < 0)
        //{
        //    if(this.rotation >= 0)
        //    {
        //        this.rotation = 180 - this.ballDirection;
        //    }
        //    else
        //    {
        //        this.rotation = -180 - this.ballDirection;
        //    }
        //    if(this.x > 640)
        //    {
        //        this.x = 640;
        //    }
        //    else if(this.x < 0)
        //    {
        //        this.x = 0;
        //    }
        //}
        //else if(this.y > 960 || this.y < 0)
        //{
        //    this.rotation = -this.ballDirection;
        //    if(this.y > 960)
        //    {
        //        this.y = 960;
        //    }
        //    else if(this.y < 0)
        //    {
        //        this.y = 0;
        //    }
        //}
    }

    private BallEnd()
    {
        if(this.y < 480)
        {
            console.log("success!");
            Info.matchResult = "win";
            Info.playerScore = 1;
        }
        else
        {
            console.log("fail!");
            Info.matchResult = "lose";
            Info.playerScore = 0;
        }

        egret.setTimeout(function(){
            if(GameManager.getInstance().isSingle)
            {
                GameController.getInstance().NextLevel();
                GameView.m_UI.scene_group.addEventListener(egret.Event.ENTER_FRAME, this.onMoveToFront, this);
            }
            else
            {
                //todo
                GameController.getInstance().GameOver();
            }
        },this,1000);

    }

}