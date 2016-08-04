/**
 * Created by LN on 2016/7/6.
 */
class GameSelectView extends View {

    public static m_UI: GameSelectViewSkin;

    public constructor()
    {
        super();
    }

    /**
     * add方法执行完毕，调用该方法
     */
    public createChildren() {
        super.createChildren();
        GameSelectView.m_UI = new GameSelectViewSkin();
        this.addChild(GameSelectView.m_UI);

        GameSelectView.m_UI.select_single.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SelectSingle, this);
        GameSelectView.m_UI.select_net.addEventListener(egret.TouchEvent.TOUCH_TAP, this.SelectNet, this);
    }

    private SelectSingle()
    {
        DialogManager.open( GameView, "GameView", 1);
        GameManager.getInstance().PlaySingle();
    }

    private SelectNet()
    {
        DialogManager.open( GameView, "GameView", 1);
        GameManager.getInstance().PlayNet();
    }
}

class GameSelectViewSkin extends eui.Component
{
    public constructor ()
    {
        super ();
        this.skinName = "src/skins/GameSelectSkin.exml";  // ָ��SkinĿ¼��ȫ��
    }

    public partAdded(partName:string, instance:any):void
    {
        super.partAdded(partName, instance);
    }

    public game_bg : eui.Image;
    public select_single : eui.Image;
    public select_net : eui.Image;

}