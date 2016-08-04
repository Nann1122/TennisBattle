/**
 * Created by WangChong on 15/12/1.
 */
var GameController = (function () {
    function GameController() {
        //策划数据修改
        this.ballSpeedInit = 300; //网球初始速度
        this.ballfieldWidth = 500; //球场宽
        this.ballfieldHeight = 800; //球场长
        this.ballNetLength = 300; //初始网长
        this.stopToNetLength = 100;
        this.shotFrontAngle = 60; //红色环-击球夹角
        this.shotMaxDis = 125;
        this.shotMinDis = 75;
        this.shotBeforeTime = 100; //击球前的时间
        //决定击球方向
        this.defultHorizontalMaxSpeed = 500; //手指水平最大速度
        this.defultMaxAngle = 60; //最大偏转角度
        this.handDefaultSpeed = 200;
        this.netAddSelf = 0;
        this.netAddMatch = 0;
        this.isSingle = false;
        //速度系数
        this.modShotArea = 0; //击球区域系数
        this.modHandSpeed = 0; //手指速度系数
        this.modBallSpeed = 0; //网球速度系数
        this.modGoldSpeed = 0; //初始奖励速度
        this.ballHitedNum = 0;
        this.isFirstHit = false;
        this.levelNum = 1;
        //AI
        this.isMatchHit = false;
        this.AIPlayerSpeed = 500;
        this.AIBallSpeed = 500;
        this.AIHitNum = 0;
        this.AiHitMaxNum = 0;
        //手指移动速度
        this.handDirArr = new Array();
        this.perMoveArrX = new Array();
        this.perMoveArr = new Array();
        this.oldMoveX = 0;
        this.nowMoveX = 0;
        this.oldMoveY = 0;
        this.nowMoveY = 0;
        this.curHandMoveSpeedX = 0;
        this.curHandMoveSpeed = 0;
        this.curHandMoveDir = 0;
        this.isHandTouch = false;
        this.handTouchTime = 0;
        this.temp_BeginX = 0;
        this.temp_BeginY = 0;
        this.temp_MoveX = 0;
        this.temp_MoveY = 0;
        this.temp_EndX = 0;
        this.temp_EndY = 0;
        this.ballSpeed = 0;
        this.ballRotation = 0;
        /**
         * 游戏结束逻辑
         */
        this.overIsBoss = false;
        this.overLoriNum = 0;
    }
    var d = __define,c=GameController,p=c.prototype;
    GameController.getInstance = function () {
        if (GameController.instance == null) {
            GameController.instance = new GameController();
        }
        return GameController.instance;
    };
    /**
     * 初始化游戏数据，然后开始
     */
    p.Init = function () {
        this.data = {
            "originalScore": 0,
            "finalScore": 0,
        };
        //初始化数据
        this.levelNum = 1;
        this.ballHitedNum = 0;
        this.AIHitNum = 0;
        this.AiHitMaxNum = 0;
        this.ModifyData();
        this.GoldPrivilege();
        //向服务器发消息，要匹配其他玩家，并进入等待界面 TODO
        this.GameWaiting(true);
    };
    p.ModifyData = function () {
        //this.ballSpeedInit = Main.modifydata_json["ballSpeedInit"];
        //this.ballfieldWidth = Main.modifydata_json["ballfieldWidth"];
        //this.ballfieldHeight = Main.modifydata_json["ballfieldHeight"];
        //this.ballNetLength = Main.modifydata_json["ballNetLength"];
    };
    p.GameWaiting = function (bWait) {
        GameView.m_UI.waiting.visible = bWait;
        if (bWait) {
            egret.Tween.get(GameView.m_UI.waiting, { loop: true }).to({ rotation: 360 }, 1000);
        }
        else {
            egret.Tween.removeTweens(GameView.m_UI.waiting);
            GameView.m_UI.waiting.rotation = 0;
        }
    };
    p.GameBegin = function () {
        this.isSingle = GameManager.getInstance().isSingle;
        console.log("GameBegin isNet ", GameManager.getInstance().isNet);
        GameManager.getInstance().TimeBegin();
        this.GameWaiting(false);
        this.CreatWorld();
    };
    //金币功能  TODO
    p.GoldPrivilege = function () {
        //修改球网长度
        GameView.m_UI.ballnet_left.height = GameView.m_UI.ballnet_right.height = this.ballNetLength + this.netAddSelf + this.netAddMatch;
        GameView.m_UI.ballnet_left.y = GameView.m_UI.ballnet_right.y = 480 - this.ballNetLength * 0.5 - this.netAddMatch;
        //修改球初始速度
    };
    p.CreatWorld = function () {
        console.log("CreatWorld level ", this.levelNum);
        this.playerMatch = new Player();
        this.playerMatch.x = 320;
        this.playerMatch.y = 80;
        this.playerMatch.position = new Vector2(this.playerMatch.x, this.playerMatch.y);
        this.playerMatch.front = new Vector2(0, -1);
        this.playerMatch.playerImage.source = "player1";
        this.playerMatch.playerImage.touchEnabled = false;
        this.playerSelf = new Player();
        this.playerSelf.x = 320;
        this.playerSelf.y = 880;
        this.playerSelf.position = new Vector2(this.playerSelf.x, this.playerSelf.y);
        this.playerSelf.front = new Vector2(0, 1);
        this.playerSelf.playerImage.source = "player0";
        this.ball = new TennisBall();
        if (this.isFirstHit) {
            this.ball.x = 320;
            this.ball.y = 360;
        }
        else {
            this.ball.x = 320;
            this.ball.y = 600;
        }
        GameView.m_UI.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.MoveBeginEvent, this);
        GameView.m_UI.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.MoveingEvent, this);
        GameView.m_UI.addEventListener(egret.TouchEvent.TOUCH_END, this.MoveEndEvent, this);
        GameView.m_UI.addEventListener(egret.Event.ENTER_FRAME, this.FrameEvent, this);
    };
    //帧事件
    p.FrameEvent = function () {
        this.SectorRange();
        this.HandMoveEvent();
        if (this.isSingle) {
            this.MatcherAI();
        }
    };
    p.MatcherAI = function () {
        this.playerMatch.position = new Vector2(this.playerMatch.x, this.playerMatch.y);
        var matcherPos = this.playerMatch.position;
        var ballPos = this.ball.position;
        if (this.ball.y < 480) {
            egret.Tween.removeTweens(this.playerMatch);
            var speed = this.AIPlayerSpeed;
            var tempV = (ballPos.Reduce(matcherPos)).normlize;
            var angle = MyTools.Angle(new Vector2(1, 0), tempV);
            if (this.ball.y < this.playerMatch.y) {
                angle = -angle;
            }
            var radian = angle * Math.PI / 180;
            var speedX = Math.round(speed * Math.cos(radian));
            var speedY = Math.round(speed * Math.sin(radian));
            //console.log(angle, radian, speedX, speedY);
            var disMatcherBall = MyTools.V2Distance(matcherPos, ballPos);
            if (disMatcherBall <= (this.shotMaxDis * 0.5)) {
                //todo AI更改ball的速度、角度
                if (this.AIHitNum < this.AiHitMaxNum) {
                    this.ball.ballSpeed = this.AIBallSpeed; //100 + Math.floor(Math.random()*400)
                    this.ball.rotation = 30 + Math.floor(Math.random() * 120);
                    if (!this.isMatchHit) {
                        ++this.AIHitNum;
                        this.BallHitedSpeedMod();
                        this.isMatchHit = true;
                    }
                }
            }
            else {
                if (!this.isMatchHit) {
                    if (this.playerMatch.y <= (480 - this.stopToNetLength)) {
                        //this.playerMatch.x = this.ball.x;
                        this.playerMatch.x += speedX * GameManager.getInstance().betweenTime * 0.001;
                        this.playerMatch.y += speedY * GameManager.getInstance().betweenTime * 0.001;
                    }
                    else {
                        this.playerMatch.y = 480 - this.stopToNetLength;
                    }
                }
            }
        }
        else {
            egret.Tween.get(this.playerMatch).to({ x: 320, y: 160 }, 1000);
        }
    };
    p.NextLevel = function () {
        ++this.levelNum;
        if (this.levelNum > 10) {
            this.AIPlayerSpeed = 1500;
            this.AIBallSpeed = 1000;
        }
        else {
            this.AIPlayerSpeed = 500 + this.levelNum * 100;
            this.AIBallSpeed = 400 + this.levelNum * 40;
            this.AiHitMaxNum = this.levelNum + Math.floor(Math.random() * this.levelNum);
        }
        this.AIHitNum = 0;
        console.log("Ai:", this.levelNum, this.AIHitNum, this.AiHitMaxNum);
        this.playerMatch.x = 320;
        this.playerMatch.y = 80;
        this.playerSelf.x = 320;
        this.playerSelf.y = 880;
        if (this.levelNum % 2 == 0) {
            this.ball.x = 320;
            this.ball.y = 360;
        }
        else {
            this.ball.x = 320;
            this.ball.y = 600;
        }
    };
    //扇形范围
    p.SectorRange = function () {
        var ballPos = this.ball.position;
        var dis;
        if (this.ball.y >= 480) {
            this.isMatchHit = false;
            //玩家自身
            var selfPos = new Vector2(this.playerSelf.x, this.playerSelf.y);
            var disSelfBall = MyTools.V2Distance(selfPos, ballPos);
            dis = disSelfBall;
            //
            if (dis <= this.shotMinDis) {
                this.modShotArea = -0.4;
                this.ball.ballState = BallState.ball_range0;
            }
            if (dis <= this.shotMaxDis && dis > this.shotMinDis) {
                this.ball.ballImage.source = "ball1";
                var tempV = (ballPos.Reduce(this.playerSelf.position)).normlize;
                var angle = MyTools.Angle(this.playerSelf.front, tempV);
                //console.log("SectorRange-angle: ", angle, this.playerSelf.front);
                if (angle <= this.shotFrontAngle) {
                    this.modShotArea = 0.5;
                    this.ball.ballState = BallState.ball_range2;
                }
                else {
                    this.modShotArea = 0;
                    this.ball.ballState = BallState.ball_range1;
                }
            }
            if (dis > this.shotMaxDis) {
                this.ball.ballImage.source = "ball";
                this.ball.ballState = BallState.ball_free;
            }
        }
        else {
            this.ball.ballState = BallState.ball_matchfield;
        }
    };
    p.HandMoveEvent = function () {
        if (this.isHandTouch) {
            this.handTouchTime += GameManager.getInstance().betweenTime;
            this.oldMoveX = this.nowMoveX;
            this.nowMoveX = this.temp_MoveX;
            this.oldMoveY = this.nowMoveY;
            this.nowMoveY = this.temp_MoveY;
            var tempx = this.nowMoveX - this.oldMoveX;
            this.handDirArr.push(tempx);
            var lengthX = Math.abs(tempx);
            var tempv = new Vector2(this.nowMoveY - this.oldMoveY, this.nowMoveX - this.oldMoveX);
            var length = Math.round(tempv.magnitude);
            this.perMoveArrX.push(lengthX);
            this.perMoveArr.push(length);
        }
    };
    p.MoveBeginEvent = function (e) {
        this.temp_BeginX = e.stageX;
        this.temp_BeginY = e.stageY;
        //console.log("temp_Begin: ",this.temp_BeginX,this.temp_BeginY);
        this.isHandTouch = true;
        this.handTouchTime = 0;
        this.perMoveArr.length = 0;
        this.perMoveArrX.length = 0;
        this.handDirArr.length = 0;
    };
    p.MoveingEvent = function (e) {
        this.temp_MoveX = e.stageX;
        this.temp_MoveY = e.stageY;
        //console.log("temp_Move: ",this.temp_MoveX,this.temp_MoveY,this.oldMoveX);
        //todo
        if (this.playerSelf.y >= (480 + this.stopToNetLength)) {
            this.playerSelf.x = this.temp_MoveX;
            this.playerSelf.y = this.temp_MoveY;
            this.playerSelf.position = new Vector2(this.playerSelf.x, this.playerSelf.y);
            //if(e.target == this.playerSelf.playerImage){}   todo 发送玩家移动的坐标
            if (GameManager.getInstance().isNet) {
                var sendplayerpos = {
                    msgType: 1,
                    msg: {
                        "x": this.playerSelf.x,
                        "y": this.playerSelf.y,
                    }
                };
                var sendinfo = {
                    type: 'sync_data',
                    data: sendplayerpos
                };
                console.log("MoveingEvent:", sendinfo);
                NetServerConnect.getInstance().syncBattleOp(sendinfo);
            }
        }
        else {
            this.playerSelf.y = 480 + this.stopToNetLength;
        }
    };
    p.MoveEndEvent = function (e) {
        this.temp_EndX = e.stageX;
        this.temp_EndY = e.stageY;
        //console.log("temp_End: ",this.temp_EndX,this.temp_EndY);
        this.isHandTouch = false;
        //颠倒顺序
        this.handDirArr.reverse();
        this.perMoveArr.reverse();
        this.perMoveArrX.reverse();
        //console.log(this.handDirArr,this.perMoveArr, this.perMoveArrX);
        //MyTools.SortNumTurnBig(this.perMoveArrX);
        //MyTools.SortNumTurnBig(this.perMoveArr);
        //console.log("end handTouchTime: ",this.handTouchTime,this.perMoveArr,perMoveArrX);
        //计算手指滑动速度
        var len = ((this.shotBeforeTime / this.handTouchTime) < 1) ? Math.round((this.perMoveArr.length - 1) * (this.shotBeforeTime / this.handTouchTime)) : this.perMoveArr.length; //三元运算符
        var moveLength = 0;
        var moveLengthX = 0;
        var moveDir = 0;
        for (var i = 1; i < len; i++) {
            moveLength += this.perMoveArr[i];
            moveLengthX += this.perMoveArrX[i];
            moveDir += this.handDirArr[i];
        }
        if (moveDir > 0) {
            moveDir = 1;
        }
        else if (moveDir < 0) {
            moveDir = -1;
        }
        this.curHandMoveDir = moveDir;
        this.curHandMoveSpeed = 1000 * moveLength / this.shotBeforeTime;
        this.curHandMoveSpeedX = 1000 * moveLengthX / this.shotBeforeTime;
        //todo 手指速度系数
        this.modHandSpeed = 0.2 * Math.floor((this.curHandMoveSpeed - this.handDefaultSpeed) / 100);
        if (this.modHandSpeed > 1) {
            this.modHandSpeed = 1;
        }
        //console.log("end speed:", this.curHandMoveDir, this.curHandMoveSpeed, this.modHandSpeed, this.curHandMoveSpeedX, moveLength, len);
        if (this.ball.ballState == BallState.ball_range0 || this.ball.ballState == BallState.ball_range1 || this.ball.ballState == BallState.ball_range2) {
            this.NetballMove();
        }
        ////test!!
        //var radianMove:number = Math.atan2(this.temp_EndY-this.temp_BeginY,this.temp_EndX-this.temp_BeginX);
        //var dirMove:number = Math.round(radianMove*180/Math.PI);
        ////console.log("rotation: ",radianMove, dirMove);
        //this.ball.rotation = dirMove;
    };
    p.NetballMove = function () {
        console.log(this.modShotArea, this.modHandSpeed, this.modBallSpeed, this.modGoldSpeed);
        this.ballSpeed = this.ballSpeedInit * (1 + this.modShotArea + this.modHandSpeed + this.modBallSpeed + this.modGoldSpeed);
        //todo
        if (this.ballSpeed > 1500) {
            this.ballSpeed = 1500;
        }
        else if (this.ballSpeed < 100) {
            this.ballSpeed = 100;
        }
        //todo
        var handSpeedX = this.curHandMoveSpeedX;
        var defultHorizontalMaxSpeed = this.defultHorizontalMaxSpeed;
        if (handSpeedX > defultHorizontalMaxSpeed) {
            handSpeedX = defultHorizontalMaxSpeed;
        }
        this.ballRotation = (-this.curHandMoveDir) * Math.round(this.defultMaxAngle * handSpeedX / defultHorizontalMaxSpeed) - 90;
        console.log("NetballMove: ", this.ballSpeed, this.ballRotation);
        this.ball.ballSpeed = this.ballSpeed;
        this.ball.rotation = this.ballRotation;
        this.BallHitedSpeedMod();
        //todo 发送ball的坐标、速度、角度
        if (GameManager.getInstance().isNet) {
            var sendballinfo = {
                msgType: 2,
                msg: {
                    "x": this.ball.x,
                    "y": this.ball.y,
                    "rotation": this.ball.rotation,
                    "speed": this.ball.ballSpeed
                }
            };
            var sendinfo = {
                type: 'sync_data',
                data: sendballinfo
            };
            console.log("NetballMove:", sendinfo);
            NetServerConnect.getInstance().syncBattleOp(sendinfo);
        }
    };
    //速度系数，跟挥拍次数有关
    p.BallHitedSpeedMod = function () {
        ++this.ballHitedNum;
        if (this.ballHitedNum >= 10) {
            this.modBallSpeed += 0.05;
        }
        else if (this.ballHitedNum >= 30) {
            this.modBallSpeed += 0.1;
        }
        console.log("BallHitedSpeedMod:", this.ballHitedNum, this.modBallSpeed);
    };
    p.regulateMatchPos = function (x, y) {
        //console.log("regulateMatchPos");
        this.playerMatch.x = 640 - x;
        this.playerMatch.y = 960 - y;
    };
    p.regulateBallAttribute = function (x, y, rotation, speed) {
        //console.log("regulateBallAttribute");
        this.ball.x = 640 - x;
        this.ball.y = 960 - y;
        this.ball.rotation = rotation - 180;
        this.ball.ballSpeed = speed;
        this.BallHitedSpeedMod();
    };
    p.GameOver = function () {
        this.Calculation();
        //GameView.m_UI.addEventListener(egret.TouchEvent.TOUCH_TAP, this.GameEnd, this);
        if (Main.isPingTai) {
            NetServerConnect.getInstance().DisConnectPingTai();
        }
        else {
            NetServerConnect.getInstance().DisConnectWeiXin();
        }
    };
    p.GameEnd = function () {
        DCAgent.onEvent("normal_Level_Finish");
        DialogManager.open(EndView, "EndView", 1);
        GameView.m_UI.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.GameEnd, this);
    };
    /**
     * 计算分数
     */
    p.Calculation = function () {
        //TODO 计算得分
        //var score:number = 0;
        //Info.playerScore = score;
        console.log("Calculation:", Info.playerScore);
        this.data.originalScore = Info.playerScore;
        if (!Main.isPingTai) {
            Info.SetData(); // 设置游戏详细数据，用于提交ops TODO 在Info里做
            NetManager.instance.SubmitPlayerScore(this.data.originalScore);
        }
    };
    return GameController;
}());
egret.registerClass(GameController,'GameController');
