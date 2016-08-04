var DialogManager;
(function (DialogManager) {
    DialogManager.dict1 = {};
    DialogManager.dict2 = {};
    DialogManager.dict3 = {};
    DialogManager.moment_dict0 = "";
    DialogManager.moment_dict1 = "";
    DialogManager.moment_dict2 = "";
    DialogManager.moment_dict3 = "";
    /**
     *
     * @param dialogClass 类名
     * @param dialogName  类名
     * @param num         组名
     */
    function open(dialogClass, dialogName, num) {
        if (num === void 0) { num = 1; }
        //小窗口
        if (num == 1) {
            if (this.moment_dict1 != "") {
                this.dict1[this.moment_dict1].hide();
            }
            if (this.dict1[dialogName] == null) {
                var dialog = new dialogClass();
                dialog.show();
                this.dict1[dialogName] = dialog;
            }
            else {
                if (!this.dict1[dialogName].showing)
                    this.dict1[dialogName].show();
            }
            this.moment_dict1 = dialogName; //记录当前正在打开
        }
        else if (num == 2) {
            if (this.moment_dict2 != "") {
                this.dict2[this.moment_dict2].hide();
            }
            if (this.dict2[dialogName] == null) {
                var dialog = new dialogClass();
                dialog.show();
                this.dict2[dialogName] = dialog;
            }
            else {
                if (!this.dict2[dialogName].showing)
                    this.dict2[dialogName].show();
            }
            this.moment_dict2 = dialogName; //记录当前正在打开
            console.log("当前打开", this.moment_dict2);
        }
        else if (num == 3) {
            if (this.moment_dict3 != "") {
                this.dict3[this.moment_dict3].hide();
            }
            if (this.dict3[dialogName] == null) {
                var dialog = new dialogClass();
                dialog.show();
                this.dict3[dialogName] = dialog;
            }
            else {
                if (!this.dict3[dialogName].showing)
                    this.dict3[dialogName].show();
            }
            this.moment_dict3 = dialogName; //记录当前正在打开
        }
        //0为HintView专用
        if (num == 0) {
            if (DialogManager.hint == null) {
                DialogManager.hint = new dialogClass();
                DialogManager.hint.show();
            }
        }
        else {
            if (DialogManager.hint != null) {
                DialogManager.hint.hide();
                DialogManager.hint.show();
            }
        }
    }
    DialogManager.open = open;
    /**
     *
     * @param dialogName 类名
     * @param num        组名
     * @param hideOnly   是否只隐藏
     */
    function remove(dialogName, num, hideOnly) {
        if (num === void 0) { num = 1; }
        if (hideOnly === void 0) { hideOnly = false; }
        if (num == 1) {
            if (this.dict1[dialogName] != null) {
                if (this.dict1[dialogName].parent) {
                    this.dict1[dialogName].hide();
                }
                if (hideOnly == false) {
                    this.dict1[dialogName] = null;
                }
            }
        }
        else if (num == 2) {
            if (this.dict2[dialogName] != null) {
                if (this.dict2[dialogName].parent) {
                    this.dict2[dialogName].hide();
                }
                if (hideOnly == false) {
                    this.dict2[dialogName] = null;
                }
            }
        }
        else if (num == 3) {
            if (this.dict3[dialogName] != null) {
                if (this.dict3[dialogName].parent) {
                    this.dict3[dialogName].hide();
                }
                if (hideOnly == false) {
                    this.dict3[dialogName] = null;
                }
            }
        }
    }
    DialogManager.remove = remove;
})(DialogManager || (DialogManager = {}));
