/**
 * Created by LN on 2016/8/2.
 */
var NetPingTaiInfo = (function () {
    function NetPingTaiInfo() {
    }
    var d = __define,c=NetPingTaiInfo,p=c.prototype;
    NetPingTaiInfo.getInstance = function () {
        if (this.instance == null) {
            this.instance = new NetPingTaiInfo();
        }
        return this.instance;
    };
    return NetPingTaiInfo;
}());
egret.registerClass(NetPingTaiInfo,'NetPingTaiInfo');
