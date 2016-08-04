//class AudioManager{
//
//    public static sound : egret.Sound;
//
//    public static channel : egret.SoundChannel;
//
//    public static soundPlayBegin : number = 0;
//
//    public static Init(_name : string)
//    {
//        this.sound = RES.getRes(_name);
//    }
//    /** 播放 */
//    public static PlaySound (_name : string) {
//
//        if (_name != "" && _name != null) {
//
//            this.channel = this.sound.play(0,1);
//
//            this.soundPlayBegin = egret.getTimer();
//            egret.log("声音时间长度：" + this.sound.length + "声音调用时间：" + this.soundPlayBegin);
//        }
//    }
//
//    public static StopPlay()
//    {
//        this.channel.stop();
//    }
//
//    public static RemoveDelay(num:number)
//    {
//        var curPos:number = this.channel.position;
//        console.log("curPos: "+ curPos + "delay:" + num);
//        var realPos:number = curPos + num;
//        //this.sound.close();
//        this.channel.stop();
//        this.channel = this.sound.play(realPos,1);
//        console.log("realPos:" + realPos + ","+this.channel.position);
//    }
//
//}
//
