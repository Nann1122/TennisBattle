/**
 * Created by WangChong on 16/1/12.
 */
var Erweima;
(function (Erweima) {
    function Show(_name) {
        var rect = new egret.Shape;
        rect.graphics.beginFill(0x000000, 0.8);
        rect.graphics.drawRect(0, 0, 640, 960);
        rect.graphics.endFill();
        Main.gameLayer.addChild(rect);
        rect.touchEnabled = true;
        rect.addEventListener(egret.TouchEvent.TOUCH_TAP, onEvent, this);
        add(_name);
        function onEvent() {
            remove();
            Main.gameLayer.removeChild(rect);
        }
    }
    Erweima.Show = Show;
    function add(_name) {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var canvasDiv = document.getElementById("canvasDiv");
        var img = document.createElement("img");
        img.width = canvasDiv.clientWidth / 2;
        img.height = img.width * 1.17; // 1.17为长比宽的比例，TODO 若更换二维码图片，则需修改该值
        var imgX = width / 2 - img.width / 2;
        var imgY = height / 2 - img.height / 2;
        img.id = "erweima";
        img.setAttribute("src", "resource/assets/" + _name + ".png");
        img.setAttribute("style", "margin:0px;padding:0px;position:absolute;z-index:99999;left:" + imgX + "px;top:" + imgY + "px");
        document.body.appendChild(img);
    }
    function remove() {
        var erweima = document.getElementById("erweima");
        document.body.removeChild(erweima);
    }
    function test() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var img = document.createElement("img");
        if (height / width > 1.5) {
            img.width = width;
            img.height = width * 1.5;
            var imgX = 0;
            var imgY = (height - img.height) / 2;
        }
        else {
            img.height = height;
            img.width = height / 1.5;
            var imgX = (width - img.width) / 2;
            var imgY = 0;
        }
        console.log("width" + width + " height" + height + " img.width" + img.width + " img.height" + img.height + " imgX" + imgX + " imgY" + imgY);
        img.id = "erweima";
        img.setAttribute("src", "resource/saoma.png");
        img.setAttribute("style", "margin:0px;padding:0px;position:absolute;z-index:99999;left:" + imgX + "px;top:" + imgY + "px");
        document.body.appendChild(img);
    }
})(Erweima || (Erweima = {}));
