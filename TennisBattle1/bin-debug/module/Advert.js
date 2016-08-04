/**
 * Created by WangChong on 16/2/17.
 */
var Advert = (function (_super) {
    __extends(Advert, _super);
    function Advert() {
        _super.apply(this, arguments);
        this.advert = null;
        this.imgs = { "load": [], "game": [], "end": [] };
        /**
         * 下载Json文件 图片
         */
        this.index = 0;
        this.typeArray = ["load", "game", "end"];
        this.url = "http://www.fcbrains.com";
        /**
         * 多张广告切换动画
         */
        this.isAnimation = false;
        this.timeoutIndex = 0;
    }
    var d = __define,c=Advert,p=c.prototype;
    Advert.getInstance = function () {
        if (this.instance == null) {
            this.instance = new Advert();
        }
        return this.instance;
    };
    /**
     * 获取广告 Json文件
     */
    p.Init = function () {
        this.advert = RES.getRes("advert");
        if (this.advert != null) {
            this.GetAdvertImg();
        }
    };
    /**
     * 获取Json文件 图片
     */
    p.GetAdvertImg = function () {
        if (this.advert["app"].indexOf(Info.app) == -1) {
            MyDebug.MyLog("~~这个项目没有广告~~");
            console.log("~~这个项目没有广告~~");
            return;
        }
        this.DownLoadImg();
        this.ShowAdvert("load");
    };
    p.DownLoadImg = function () {
        if (this.advert[this.typeArray[0]].imgs.length == 0) {
            if (this.typeArray.length > 1) {
                this.typeArray.splice(0, 1);
                this.DownLoadImg();
                return;
            }
            else {
                return;
            }
        }
        console.warn("~~正在下载广告里的图片 当前是 " + this.typeArray[0] + (this.index + 1));
        var url = this.advert[this.typeArray[0]].imgs[this.index];
        RES.getResByUrl(url, this.DownLoadImgComplete, this);
    };
    p.DownLoadImgComplete = function (_img) {
        this.imgs[this.typeArray[0]].push(_img);
        this.index++;
        if (this.index < this.advert[this.typeArray[0]].imgs.length) {
            this.DownLoadImg();
        }
        else {
            this.index = 0;
            this.typeArray.splice(0, 1);
            if (this.typeArray.length > 0) {
                this.DownLoadImg();
            }
            else {
                console.log("~~广告里的图片 已经下载完毕~~");
                console.log(this.imgs.load.length + " " + this.imgs.game.length + " " + this.imgs.end.length);
            }
        }
    };
    p.ShowAdvert = function (_str) {
        this.RemoveAdvert();
        if (this.advert == null || this.advert[_str].imgs.length == 0) {
            return;
        }
        if (this.img != null) {
            return;
        }
        console.warn("~~准备添加广告~~");
        this.img = new eui.Image;
        this.url = this.advert[_str]["url"];
        this.img.source = this.imgs[_str][0];
        this.img.width = this.advert[_str]["width"];
        this.img.height = this.advert[_str]["height"];
        this.img.x = this.advert[_str]["x"];
        this.img.y = this.advert[_str]["y"];
        this.img.alpha = 1;
        this.img.touchEnabled = true;
        this.img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onAdvertClick, this);
        Main.gameLayer.addChild(this.img);
        Main.gameLayer.setChildIndex(this.img, 10000);
        this.isAnimation = true;
        if (this.advert[_str].animation != "") {
            this.AdvertTweenAni(_str, this.advert[_str].animation);
        }
        this.AdvertAnimation(_str);
    };
    /**
     * 移除广告
     */
    p.RemoveAdvert = function () {
        if (this.img != null) {
            console.warn("~~准备移除广告~~");
            this.isAnimation = false;
            egret.Tween.removeTweens(this.img);
            if (this.timeoutIndex != 0) {
                egret.clearTimeout(this.timeoutIndex);
            }
            Main.gameLayer.removeChild(this.img);
            this.img = null;
        }
    };
    p.AdvertAnimation = function (_str, _index) {
        if (_index === void 0) { _index = 0; }
        if (this.isAnimation == true) {
            if (this.timeoutIndex != 0) {
                egret.clearTimeout(this.timeoutIndex);
            }
            this.img.texture = this.imgs[_str][(_index % this.advert[_str].imgs.length)];
            if (this.img.texture != null && this.advert[_str].imgs.length == 1) {
                return;
            }
            _index++;
            this.timeoutIndex = egret.setTimeout(function () {
                this.AdvertAnimation(_str, _index);
            }, this, 500);
        }
    };
    /**
     * 广告Tween动画
     */
    p.AdvertTweenAni = function (_str, _type) {
        if (_type == "position") {
            var x = this.img.x;
            var y = this.img.y;
            var targetX = this.advert[_str]["position"].x;
            var targetY = this.advert[_str]["position"].y;
            var time = this.advert[_str]["position"].time;
            egret.Tween.get(this.img, { loop: true }).to({ x: targetX, y: targetY }, time, egret.Ease.quadInOut).wait(200).to({ x: x, y: y }, time, egret.Ease.quadInOut);
        }
        else if (_type == "alpha") {
            var time = this.advert[_str]["alpha"].time;
            egret.Tween.get(this.img, { loop: true }).to({ alpha: 0 }, time).wait(200).to({ alpha: 1 }, time);
        }
    };
    /**
     * 点击事件
     */
    p.onAdvertClick = function () {
        DCAgent.onEvent("normal_Advert_Click");
        egret.setTimeout(function () {
            window.location.href = this.url;
        }, this, 500);
    };
    return Advert;
}(eui.Group));
egret.registerClass(Advert,'Advert');
