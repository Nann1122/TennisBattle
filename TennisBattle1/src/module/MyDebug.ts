/**
 * Created by WangChong on 16/3/4.
 */
module MyDebug {

    export  var text : string = "";
    var count : number = 1;

    /**
     * 设置密道
     */
    export function GetPoint (_x : number, _y : number)
    {
        console.warn(_x + "  " + _y);

        if (count > 6)
        {
            return;
        }

        switch (count)
        {
            case 1:
                if (_x < 320 && _y < 480)
                {
                    count++;
                }
                break;
            case 2:
                if (_x < 320 && _y < 480)
                {
                    count++;
                }
                break;
            case 3:
                if (_x > 320 && _y < 480)
                {
                    count++;
                }
                break;
            case 4:
                if (_x < 320 && _y > 480)
                {
                    count++;
                }
                break;
            case 5:
                if (_x < 320 && _y > 480)
                {
                    count++;
                }
                break;
            case 6:
                if (_x > 320 && _y > 480)
                {
                    count++;
                    Show();
                }
                break;
        }
    }

    function Show ()
    {

    }

    export function MyLog (_log)
    {
        console.log(_log);
        //if (DialogManager.hint == null)
        //{
        //    text += _log;
        //    text += '\n';
        //}

    }
}