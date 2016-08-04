/**
 * Created by WangChong on 16/2/17.
 */
class Advert extends eui.Group {
    private static instance:Advert;
    public static getInstance():Advert {
        if(this.instance == null) {
            this.instance = new Advert();
        }
        return this.instance;
    }

    private advert = null;
    private imgs = {"load": [], "game": [], "end": []};

    /**
     * 获取广告 Json文件
     */
    public Init ()
    {
        this.advert = RES.getRes("advert");
        if (this.advert != null)
        {
            this.GetAdvertImg();
        }
    }

    /**
     * 获取Json文件 图片
     */
    private GetAdvertImg ()
    {
        if (this.advert["app"].indexOf(Info.app) == -1) {
            MyDebug.MyLog("~~这个项目没有广告~~");
            console.log("~~这个项目没有广告~~");
            return;
        }
        this.DownLoadImg();
        this.ShowAdvert("load");
    }

    /**
     * 下载Json文件 图片
     */
    private index : number = 0;
    private typeArray : Array<string> = ["load","game","end"];
    private DownLoadImg ()
    {
        if (this.advert[this.typeArray[0]].imgs.length == 0)
        {
            if (this.typeArray.length > 1)
            {
                this.typeArray.splice(0,1);
                this.DownLoadImg();
                return;
            }
            else{
                return;
            }
        }
        console.warn("~~正在下载广告里的图片 当前是 " + this.typeArray[0] + (this.index+1));
        var url : string = this.advert[this.typeArray[0]].imgs[this.index];
        RES.getResByUrl(url, this.DownLoadImgComplete, this);
    }
    private DownLoadImgComplete (_img : egret.Texture)
    {
        this.imgs[this.typeArray[0]].push(_img);
        this.index++;
        if (this.index < this.advert[this.typeArray[0]].imgs.length)
        {
            this.DownLoadImg();
        }
        else
        {
            this.index = 0;
            this.typeArray.splice(0,1);
            if (this.typeArray.length > 0)
            {
                this.DownLoadImg();
            }
            else
            {
                console.log("~~广告里的图片 已经下载完毕~~")
                console.log(this.imgs.load.length + " " + this.imgs.game.length + " " + this.imgs.end.length);
            }
        }
    }

    /**
     * 添加并显示广告
     */
    private img : eui.Image;
    private url : string = "http://www.fcbrains.com";
    public ShowAdvert (_str : string)
    {
        this.RemoveAdvert();

        if (this.advert == null || this.advert[_str].imgs.length == 0)
        {
            return;
        }
        if (this.img != null)
        {
            return;
        }
        console.warn("~~准备添加广告~~")
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
        if (this.advert[_str].animation != "")
        {
            this.AdvertTweenAni(_str, this.advert[_str].animation);
        }

        this.AdvertAnimation(_str);
    }

    /**
     * 移除广告
     */
    public RemoveAdvert ()
    {

        if (this.img != null)
        {
            console.warn("~~准备移除广告~~");
            this.isAnimation = false;
            egret.Tween.removeTweens(this.img);
            if (this.timeoutIndex != 0)
            {
                egret.clearTimeout(this.timeoutIndex);
            }
            Main.gameLayer.removeChild(this.img);
            this.img = null;
        }
    }

    /**
     * 多张广告切换动画
     */
    private isAnimation : boolean = false;
    private timeoutIndex : number = 0;
    private AdvertAnimation (_str : string, _index : number = 0)
    {
        if (this.isAnimation == true)
        {
            if (this.timeoutIndex != 0)
            {
                egret.clearTimeout(this.timeoutIndex);
            }
            this.img.texture = this.imgs[_str][(_index % this.advert[_str].imgs.length)];
            if (this.img.texture != null && this.advert[_str].imgs.length == 1)
            {
                return;
            }
            _index++;
            this.timeoutIndex = egret.setTimeout(function()
            {
                this.AdvertAnimation(_str, _index);
            }, this, 500);
        }
    }

    /**
     * 广告Tween动画
     */
    private AdvertTweenAni (_str : string, _type : string)
    {
        if (_type == "position")
        {
            var x = this.img.x;
            var y = this.img.y;
            var targetX = this.advert[_str]["position"].x;
            var targetY = this.advert[_str]["position"].y;
            var time = this.advert[_str]["position"].time;
            egret.Tween.get(this.img, {loop:true}).to({x: targetX, y: targetY}, time, egret.Ease.quadInOut).wait(200).to({x: x, y: y}, time, egret.Ease.quadInOut);
        }
        else if (_type == "alpha")
        {
            var time = this.advert[_str]["alpha"].time;
            egret.Tween.get(this.img, {loop:true}).to({alpha: 0}, time).wait(200).to({alpha: 1}, time);
        }
    }

    /**
     * 点击事件
     */
    private onAdvertClick ()
    {

        DCAgent.onEvent("normal_Advert_Click");
        egret.setTimeout(function(){
            window.location.href = this.url;
        }, this, 500);
    }
}