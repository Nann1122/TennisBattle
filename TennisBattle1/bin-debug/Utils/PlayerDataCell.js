/**
 * Created by Melody on 2016/4/20.
 */
var PlayerDataCell = (function (_super) {
    __extends(PlayerDataCell, _super);
    function PlayerDataCell() {
        _super.call(this);
        this.Init();
    }
    var d = __define,c=PlayerDataCell,p=c.prototype;
    p.Init = function () {
        this.width = 500;
        this.height = 70;
        var bg = new eui.Image;
        bg.source = "rank_other";
        bg.width = 480;
        bg.height = 70;
        bg.x = 10;
        bg.y = 0;
        this.addChild(bg);
        this.playerdata_rank = new eui.Label;
        this.playerdata_rank.text = ""; //"1335";
        this.playerdata_rank.size = 25;
        this.playerdata_rank.fontFamily = "微软雅黑";
        this.playerdata_rank.textColor = 0x256d6a;
        this.playerdata_rank.textAlign = "center";
        //this.playerdata_rank.tex
        this.playerdata_rank.width = 100;
        this.playerdata_rank.height = 60;
        this.playerdata_rank.x = 10;
        this.playerdata_rank.y = 20;
        this.addChild(this.playerdata_rank);
        this.playerdata_head = new eui.Image;
        this.playerdata_head.source = "player_head_bg";
        this.playerdata_head.width = this.playerdata_head.height = 65;
        this.playerdata_head.x = 110;
        this.playerdata_head.y = 2;
        this.addChild(this.playerdata_head);
        this.playerdata_name = new eui.Label;
        this.playerdata_name.text = ""; //"啦啦啦啦啦啦我是卖报";
        this.playerdata_name.size = 20;
        this.playerdata_name.fontFamily = "微软雅黑";
        this.playerdata_name.textColor = 0x256d6a;
        this.playerdata_name.textAlign = "center";
        this.playerdata_name.width = 200;
        this.playerdata_name.height = 40;
        this.playerdata_name.x = 180;
        this.playerdata_name.y = 20;
        this.addChild(this.playerdata_name);
        this.playerdata_score = new eui.Label;
        this.playerdata_score.text = ""; //"12345678";
        this.playerdata_score.size = 20;
        this.playerdata_score.fontFamily = "微软雅黑";
        this.playerdata_score.textColor = 0x256d6a;
        this.playerdata_score.textAlign = "center";
        this.playerdata_score.width = 150;
        this.playerdata_score.height = 60;
        this.playerdata_score.x = 350;
        this.playerdata_score.y = 20;
        this.addChild(this.playerdata_score);
    };
    return PlayerDataCell;
}(eui.Group));
egret.registerClass(PlayerDataCell,'PlayerDataCell');
