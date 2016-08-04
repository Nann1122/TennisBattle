/**
 * Created by WangChong on 16/5/10.
 * 创建的第三方库项目
 * 编写MyAudio
 * 编写myaudio.d.ts
 * declare function SupportedAudio():boolean;
 * declare function LoadAudio():boolean;
 * declare function PlayAudio(num : number, volume : number, loop : boolean, isContinue :boolean);
 * declare function PlayAllAudio();
 * declare function StopAudio(num : number);
 * declare function StopAllAudio();
 * build myaudio
 * build xypu3 -e
 */

function SupportedAudio()
{
    return audio.AudioSupported();
}

function LoadAudio()
{
    console.log("isover"+audio.isover());
    return audio.isover();
}

//第几个音乐,音量(大于0),是否循环,是否继续播放
function PlayAudio (num, volume, isLoop, isContinue)
{
    audio.play(num, volume, isLoop, isContinue);
    //console.log("播放了" + num);
}

function PlayAllAudio()
{
    audio.playAll();
    //console.log("播放了所有声音");
}

function StopAudio (num)
{
    audio.stop(num)
    //console.log("停止了" + num);
}

function StopAllAudio()
{
    audio.stopAll();
    //console.log("停止了所有声音");
}