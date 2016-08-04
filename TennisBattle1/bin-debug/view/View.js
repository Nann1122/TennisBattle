/**
 * Created by WangChong on 15/12/1.
 */
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.apply(this, arguments);
    }
    var d = __define,c=View,p=c.prototype;
    /**
     * 显示方法，在DialogManager脚本中调用
     */
    p.show = function () {
        if (!this.parent) {
            Main.euiLayer.addChild(this);
        }
    };
    /**
     * 移除显示方法，在DialogManager脚本中调用
     */
    p.hide = function () {
        if (this.parent) {
            Main.euiLayer.removeChild(this);
        }
    };
    return View;
}(eui.Group));
egret.registerClass(View,'View');
