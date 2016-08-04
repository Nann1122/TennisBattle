/**
 * Created by LN on 2016/7/4.
 */
var ServerEvent = function () {

};

module.exports = ServerEvent;

ServerEvent.prototype.FirstHitRandom = function () {

};

function getDistance(x1, y1, x2, y2) {
    var disX = x1 - x2;
    var disY = y1 - y2;
    var dis = Math.sqrt((disX * disX + disY * disY));
    return dis;
};