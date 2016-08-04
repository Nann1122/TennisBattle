/**
 * Created by WangChong on 15/12/1.
 */

class View extends eui.Group
{
    /**
     * 显示方法，在DialogManager脚本中调用
     */
    public show() {
        if (!this.parent) {
            Main.euiLayer.addChild(this);
        }
    }

    /**
     * 移除显示方法，在DialogManager脚本中调用
     */
    public hide() {
        if (this.parent) {
            Main.euiLayer.removeChild(this);
        }
    }

}