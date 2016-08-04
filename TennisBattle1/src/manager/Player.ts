/**
 * Created by LN on 2016/7/19.
 */
class Player extends eui.Group
{
    public constructor()
    {
        super();

        this.Init();
    }

    private commonLength:number = 120;

    public playerImage:eui.Image;

    public position:Vector2;
    public front:Vector2;

    private Init()
    {
        var commonLength:number = this.commonLength;

        this.width = this.height = commonLength;
        this.anchorOffsetX = this.anchorOffsetY = commonLength*0.5;
        this.touchEnabled = false;
        GameView.m_UI.scene_group.addChild(this);

        this.playerImage = new eui.Image();
        this.playerImage.width = this.playerImage.height = commonLength;
        this.playerImage.anchorOffsetX = this.playerImage.anchorOffsetY = commonLength*0.5;
        this.playerImage.x = this.width*0.5;
        this.playerImage.y = this.height*0.5;
        this.addChild(this.playerImage);
    }

}