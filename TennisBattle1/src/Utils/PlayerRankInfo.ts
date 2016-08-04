/**
 * Created by LN on 2016/4/1.
 */
class PlayerRankInfo
{
    private static instance:PlayerRankInfo;
    public static getInstance():PlayerRankInfo{
        if(this.instance == null){
            this.instance = new PlayerRankInfo();
        }
        return this.instance;
    }

    public playerScoreMax:number = 0;
    public playerRank:number = 0;

    public topRange:Array<PlayerInfo> = new Array();
    public selfRange:Array<PlayerInfo> = new Array();
}

class PlayerInfo
{
    public constructor()
    {
    }

    public _playerUid:string = "";
    public _playerRank:number = 0;
    public _playerIconUrl:string = "";
    public _playerName:string = "";
    public _playerScore:number = 0;

    public _playerBgSource:string = "";
}