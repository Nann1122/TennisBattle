/**
 * Created by LN on 2016/1/20.
 */
class GameView extends View {

    public static m_UI: GameViewSkin;

    public constructor()
    {
        super();
        DialogManager.remove("EndView");
    }

    /**
     * add方法执行完毕，调用该方法
     */
    public createChildren() {
        super.createChildren();
        GameView.m_UI = new GameViewSkin();
        this.addChild(GameView.m_UI);

        //Advert.getInstance().ShowAdvert("game");

        GameView.m_UI.waiting.width = GameView.m_UI.waiting.height = 200;
        GameView.m_UI.waiting.anchorOffsetX = GameView.m_UI.waiting.anchorOffsetY = GameView.m_UI.waiting.width*0.5;
        GameView.m_UI.waiting.x = 320;
        GameView.m_UI.waiting.y = 480;

        GameController.getInstance().Init();
    }
}

class GameViewSkin extends eui.Component
{
    public constructor ()
    {
        super ();
        this.skinName = "src/skins/GameSkin.exml";  // 指定Skin目录及全名
    }

    public partAdded(partName:string, instance:any):void
    {
        super.partAdded(partName, instance);
    }

    public game_bg : eui.Image;

    public player_group : eui.Group;
    public head_self : eui.Image;
    public head_match : eui.Image;
    public name_self : eui.Label;
    public name_match : eui.Label;

    public ballnet_left : eui.Image;
    public ballnet_right : eui.Image;

    public black_rect : eui.Rect;
    public instruction : eui.Image;
    public begin : eui.Image;

    public scene_group : eui.Group;

    public count_label : eui.Label;

    public waiting : eui.Image;


}