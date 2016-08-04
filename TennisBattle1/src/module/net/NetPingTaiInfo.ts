/**
 * Created by LN on 2016/8/2.
 */
class NetPingTaiInfo
{
    private static instance:NetPingTaiInfo;
    public static getInstance():NetPingTaiInfo
    {
        if(this.instance == null)
        {
            this.instance = new NetPingTaiInfo();
        }
        return this.instance;
    }




}