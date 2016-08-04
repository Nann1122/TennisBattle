var ServerEvent = (function () {
    function ServerEvent() {
    }
    var d = __define,c=ServerEvent,p=c.prototype;
    ServerEvent.getInstance = function () {
        if (this.instance == null) {
            this.instance = new ServerEvent();
        }
        return this.instance;
    };
    p.FirstHitRandom = function () {
    };
    return ServerEvent;
}());
egret.registerClass(ServerEvent,'ServerEvent');
