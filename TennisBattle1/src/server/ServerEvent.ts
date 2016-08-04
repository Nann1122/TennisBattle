class ServerEvent
{
    private static instance:ServerEvent;
    public static getInstance():ServerEvent {
        if(this.instance == null) {
            this.instance = new ServerEvent();
        }
        return this.instance;
    }

    public FirstHitRandom()
    {

    }

}
