/**
 * Created by LN on 2016/7/18.
 */
var BallState;
(function (BallState) {
    BallState[BallState["ball_free"] = 0] = "ball_free";
    BallState[BallState["ball_matchfield"] = 1] = "ball_matchfield";
    BallState[BallState["ball_range0"] = 2] = "ball_range0";
    BallState[BallState["ball_range1"] = 3] = "ball_range1";
    BallState[BallState["ball_range2"] = 4] = "ball_range2";
    BallState[BallState["ball_fail"] = 5] = "ball_fail";
    BallState[BallState["ball_success"] = 6] = "ball_success";
})(BallState || (BallState = {}));
var TennisBall = (function (_super) {
    __extends(TennisBall, _super);
    function TennisBall() {
        _super.call(this);
        this.commonLength = 50;
        this.ballfieldWidth = 500;
        this.ballfieldHeight = 800;
        this.ballNetLength = 300;
        this.ballDirection = 0;
        this.ballSpeed = 0;
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        this.Init();
    }
    var d = __define,c=TennisBall,p=c.prototype;
    p.Init = function () {
        var commonLength = this.commonLength;
        this.width = this.height = commonLength;
        this.anchorOffsetX = this.anchorOffsetY = commonLength * 0.5;
        this.x = 320;
        this.y = 480;
        this.position = new Vector2(this.x, this.y);
        this.touchEnabled = false;
        GameView.m_UI.scene_group.addChild(this);
        this.ballImage = new eui.Image("ball");
        this.ballImage.width = this.ballImage.height = commonLength;
        this.ballImage.anchorOffsetX = this.ballImage.anchorOffsetY = commonLength * 0.5;
        this.ballImage.x = this.width * 0.5;
        this.ballImage.y = this.height * 0.5;
        this.ballImage.touchEnabled = false;
        this.addChild(this.ballImage);
        this.rotation = 90;
        this.ballfieldWidth = GameController.getInstance().ballfieldWidth;
        this.ballfieldHeight = GameController.getInstance().ballfieldHeight;
        this.ballNetLength = GameController.getInstance().ballNetLength;
        this.tempfieldWidth = (640 - this.ballfieldWidth) * 0.5;
        this.tempfieldHeight = (960 - this.ballfieldHeight) * 0.5;
        this.ballState = BallState.ball_free;
        GameView.m_UI.scene_group.addEventListener(egret.Event.ENTER_FRAME, this.onMoveToFront, this);
    };
    p.onMoveToFront = function () {
        var tempfieldHeight = this.tempfieldHeight;
        var tempfieldWidth = this.tempfieldWidth;
        var tempNetHeight = this.ballNetLength * 0.5;
        var netUpY = 480 - tempNetHeight - GameController.getInstance().netAddMatch;
        var netDownY = 480 + tempNetHeight + GameController.getInstance().netAddSelf;
        //console.log(tempfieldWidth,tempNetHeight,netUpY,netDownY);
        this.ballDirection = this.rotation;
        var radian = this.ballDirection * Math.PI / 180;
        this.ballSpeedX = Math.round(this.ballSpeed * Math.cos(radian));
        this.ballSpeedY = Math.round(this.ballSpeed * Math.sin(radian));
        //console.log(this.ballDirection,radian,this.ballSpeedX, this.ballSpeedY);
        this.x += this.ballSpeedX * GameManager.getInstance().betweenTime * 0.001;
        this.y += this.ballSpeedY * GameManager.getInstance().betweenTime * 0.001;
        this.position = new Vector2(this.x, this.y);
        //todo
        if (this.x > (640 - tempfieldWidth) || this.x < tempfieldWidth) {
            if (this.y <= netDownY && this.y >= netUpY) {
                if (this.rotation >= 0) {
                    this.rotation = 180 - this.ballDirection;
                }
                else {
                    this.rotation = -180 - this.ballDirection;
                }
                if (this.x > (640 - tempfieldWidth)) {
                    this.x = (640 - tempfieldWidth);
                }
                else if (this.x < tempfieldWidth) {
                    this.x = tempfieldWidth;
                }
            }
            else {
                console.log("stopX: ", this.x, this.y);
                this.ballSpeed = 0;
                this.BallEnd();
                GameView.m_UI.scene_group.removeEventListener(egret.Event.ENTER_FRAME, this.onMoveToFront, this);
            }
        }
        if (this.y > (960 - tempfieldHeight) || this.y < tempfieldHeight) {
            console.log("stopY: ", this.x, this.y);
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
    };
    p.BallEnd = function () {
        if (this.y < 480) {
            console.log("success!");
            Info.matchResult = "win";
            Info.playerScore = 1;
        }
        else {
            console.log("fail!");
            Info.matchResult = "lose";
            Info.playerScore = 0;
        }
        egret.setTimeout(function () {
            if (GameManager.getInstance().isSingle) {
                GameController.getInstance().NextLevel();
                GameView.m_UI.scene_group.addEventListener(egret.Event.ENTER_FRAME, this.onMoveToFront, this);
            }
            else {
                //todo
                GameController.getInstance().GameOver();
            }
        }, this, 1000);
    };
    return TennisBall;
}(eui.Group));
egret.registerClass(TennisBall,'TennisBall');
