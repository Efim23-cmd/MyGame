import Program from "./Main.js";
export class Menu {
    get IsOpen() {
        return this._isOpen;
    }
    set IsOpen(value) {
        this._isOpen = value;
    }
    constructor(Idmenu) {
        this.menu = document.getElementById(Idmenu);
        this.SetEvents();
    }
    Open() {
        this.menu.style.transform = "translate(0, 0)";
        Menu.IsActive = true;
    }
    SetEvents() {
        this.menu.addEventListener("transitionstart", (e) => {
            if (e.propertyName == "transform") {
                Menu.IsRun = true;
            }
        });
        this.menu.addEventListener("transitioncancel", (e) => {
            if (e.propertyName == "transform") {
                Menu.IsRun = false;
            }
        });
        this.menu.addEventListener("transitionend", (e) => {
            if (e.propertyName == "transform") {
                Menu.IsRun = false;
            }
        });
    }
    static CloseMenuWithRandomPos(...elements) {
        elements.forEach((element) => {
            element.menu.classList.remove("active");
            element.menu.style.transform = Program.Random("translate(0, 100vh)", "translate(0, -100vh)", " translate(-100vw, 0px)", "translate(100vw, 0)");
        });
        Menu.IsActive = false;
    }
}
Menu.IsActive = false;
Menu.IsRun = false;
export class MainMenu extends Menu {
    constructor(IdMenu, btn_startId, btn_leaderId, label_UserId, label_RecordId) {
        super(IdMenu);
        this.Btn_Start = document.getElementById(btn_startId);
        this.Btn_Leader = document.getElementById(btn_leaderId);
        this.UserName = document.getElementById(label_UserId);
        this.Record = document.getElementById(label_RecordId);
    }
    UpdateName(value) {
        this.UserName.innerHTML = `User: ${value}`;
    }
    UpdateRecord(value) {
        this.Record.innerHTML = `Record: ${value}`;
    }
    AddEventStart(event, func) {
        this.Btn_Start.addEventListener(event, func);
    }
    AddEventLeader(event, func) {
        this.Btn_Leader.addEventListener(event, func);
    }
}
export class VisualizerMenu extends Menu {
    constructor(IdMenu, btn_startId, inputId) {
        super(IdMenu);
        this.Btn_Start = document.getElementById(btn_startId);
        this.Input = document.getElementById(inputId);
    }
    AddEventStart(event, func) {
        this.Btn_Start.addEventListener(event, func);
    }
}
export class EnterMenu extends Menu {
    constructor(IdMenu, inputId, btn_startId, btn_leaderId) {
        super(IdMenu);
        this.Input = document.getElementById(inputId);
        this.Btn_Start = document.getElementById(btn_startId);
        this.Btn_Leader = document.getElementById(btn_leaderId);
    }
    IsEmpty() {
        if (this.Input.value.trim() == "") {
            return true;
        }
        return false;
    }
    SetDisabled() {
        this.Btn_Start.classList.add("disabled");
    }
    SetEnabled() {
        this.Btn_Start.classList.remove("disabled");
    }
    AddEventInput(event, func) {
        this.Input.addEventListener(event, func);
    }
    AddEventStart(event, func) {
        this.Btn_Start.addEventListener(event, func);
    }
    AddEventLeader(event, func) {
        this.Btn_Leader.addEventListener(event, func);
    }
}
export class ReplayMenu extends Menu {
    constructor(IdMenu, btn_replayId, btn_backId, label_winId, label_timeId, label_scoreId) {
        super(IdMenu);
        this.Btn_Replay = document.getElementById(btn_replayId);
        this.Btn_Back = document.getElementById(btn_backId);
        this.IsWin = document.getElementById(label_winId);
        this.Time = document.getElementById(label_timeId);
        this.Score = document.getElementById(label_scoreId);
    }
    UpdateTime(value) {
        this.Time.innerHTML = `Time: ${value}`;
    }
    UpdateScore(value) {
        this.Score.innerHTML = `Score: ${value}`;
    }
    AddEventReplay(event, func) {
        this.Btn_Replay.addEventListener(event, func);
    }
    AddEventBack(event, func) {
        this.Btn_Back.addEventListener(event, func);
    }
}
export class LeaderMenu extends Menu {
    constructor(IdMenu, inputId, btn_backId, listId, loadId) {
        super(IdMenu);
        this.Input = document.getElementById(inputId);
        this.Btn_Back = document.getElementById(btn_backId);
        this.List = document.getElementById(listId);
        this.LoadBlock = document.getElementById(loadId);
    }
    IsEmpty() {
        if (this.Input.value.trim() == "") {
            return true;
        }
        return false;
    }
    AddEventInput(event, func) {
        this.Input.addEventListener(event, func);
    }
    AddEventBack(event, func) {
        this.Btn_Back.addEventListener(event, func);
    }
    AddInList(element) {
        this.List.appendChild(element);
    }
    RemoveAllFromList() {
        this.List.innerHTML = "";
    }
    SetEntries(users) {
        Program.leaderMenu.RemoveAllFromList();
        users.sort((a, b) => b.record - a.record);
        users.forEach((user) => {
            let element = document.createElement("div");
            element.className = "entry";
            element.innerHTML = (`<div>${user.userName}</div><div>${user.record}</div>`);
            Program.leaderMenu.AddInList(element);
        });
    }
    AddLoadBlock() {
        this.LoadBlock.classList.add("active");
    }
    RemoveLoadBlock() {
        this.LoadBlock.classList.remove("active");
    }
}
export class PlayMenu extends Menu {
    constructor(IdMenu, btn_continueId, btn_backId, label_timeId, label_scoreId) {
        super(IdMenu);
        this.Btn_Continue = document.getElementById(btn_continueId);
        this.Btn_Back = document.getElementById(btn_backId);
        this.Time = document.getElementById(label_timeId);
        this.Score = document.getElementById(label_scoreId);
    }
    UpdateTime(value) {
        this.Time.innerHTML = `Time: ${value}`;
    }
    UpdateScore(value) {
        this.Score.innerHTML = `Score: ${value}`;
    }
    AddEventContinue(event, func) {
        this.Btn_Continue.addEventListener(event, func);
    }
    AddEventBack(event, func) {
        this.Btn_Back.addEventListener(event, func);
    }
}
//# sourceMappingURL=Menu.js.map