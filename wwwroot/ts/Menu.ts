import Program from "./Main.js";
import User from "./User.js";

export class Menu {
    public static IsActive: boolean = false;
    public static IsRun: boolean = false;
    protected menu: HTMLElement;
    protected _isOpen: boolean;

    public get IsOpen() {
        return this._isOpen;
    }

    private set IsOpen(value) {
        this._isOpen = value;
    }

    constructor(Idmenu: string) {
        this.menu = document.getElementById(Idmenu);
        this.SetEvents();
    }

    public Open() {
        this.menu.style.transform = "translate(0, 0)";
        Menu.IsActive = true;
    }

    private SetEvents() {
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

    public static CloseMenuWithRandomPos(...elements: Menu[]) {
        elements.forEach((element) => {
            element.menu.classList.remove("active");
            element.menu.style.transform = Program.Random("translate(0, 100vh)", "translate(0, -100vh)", " translate(-100vw, 0px)", "translate(100vw, 0)");
        });
        Menu.IsActive = false;
    }
}

export class MainMenu extends Menu {

    private Btn_Start: HTMLElement;
    private Btn_Leader: HTMLElement;
    private UserName: HTMLElement;
    private Record: HTMLElement;

    public constructor(IdMenu, btn_startId: string, btn_leaderId: string, label_UserId: string, label_RecordId: string) {
        super(IdMenu);
        this.Btn_Start = document.getElementById(btn_startId);
        this.Btn_Leader = document.getElementById(btn_leaderId);
        this.UserName = document.getElementById(label_UserId);
        this.Record = document.getElementById(label_RecordId);
    }

    public UpdateName(value: string) {
        this.UserName.innerHTML = `User: ${value}`;
    }

    public UpdateRecord(value: string) {
        this.Record.innerHTML = `Record: ${value}`;
    }

    public AddEventStart(event: string, func: (e: Event) => void) {
        this.Btn_Start.addEventListener(event, func);
    }

    public AddEventLeader(event: string, func: (e: Event) => void) {
        this.Btn_Leader.addEventListener(event, func);
    }
}

export class VisualizerMenu extends Menu {

    private Btn_Start: HTMLElement;
    public Input: HTMLInputElement;

    public constructor(IdMenu, btn_startId: string, inputId: string) {
        super(IdMenu);
        this.Btn_Start = document.getElementById(btn_startId);
        this.Input = <HTMLInputElement>document.getElementById(inputId);
    }

    public AddEventStart(event: string, func: (e: Event) => void) {
        this.Btn_Start.addEventListener(event, func);
    }
}

export class EnterMenu extends Menu {

    public Input: HTMLInputElement;
    private Btn_Start: HTMLElement;
    private Btn_Leader: HTMLElement;

    public constructor(IdMenu, inputId: string, btn_startId: string, btn_leaderId: string) {
        super(IdMenu);
        this.Input = <HTMLInputElement>document.getElementById(inputId);
        this.Btn_Start = document.getElementById(btn_startId);
        this.Btn_Leader = document.getElementById(btn_leaderId);
    }

    public IsEmpty() {
        if (this.Input.value.trim() == "") {
            return true;
        }
        return false;
    }

    public SetDisabled() {
        this.Btn_Start.classList.add("disabled");
    }
    public SetEnabled() {
        this.Btn_Start.classList.remove("disabled");
    }

    public AddEventInput(event: string, func: (e: Event) => void) {
        this.Input.addEventListener(event, func);
    }

    public AddEventStart(event: string, func: (e: Event) => void) {
        this.Btn_Start.addEventListener(event, func);
    }

    public AddEventLeader(event: string, func: (e: Event) => void) {
        this.Btn_Leader.addEventListener(event, func);
    }
}

export class ReplayMenu extends Menu {

    private Btn_Replay: HTMLElement;
    private Btn_Back: HTMLElement;
    private IsWin: HTMLElement;
    private Time: HTMLElement;
    private Score: HTMLElement;

    public constructor(IdMenu, btn_replayId: string, btn_backId: string, label_winId: string, label_timeId: string, label_scoreId: string) {
        super(IdMenu);
        this.Btn_Replay = document.getElementById(btn_replayId);
        this.Btn_Back = document.getElementById(btn_backId);
        this.IsWin = document.getElementById(label_winId);
        this.Time = document.getElementById(label_timeId);
        this.Score = document.getElementById(label_scoreId);
    }

    public UpdateTime(value: string) {
        this.Time.innerHTML = `Time: ${value}`;
    }

    public UpdateScore(value: string) {
        this.Score.innerHTML = `Score: ${value}`;
    }

    public AddEventReplay(event: string, func: (e: Event) => void) {
        this.Btn_Replay.addEventListener(event, func);
    }

    public AddEventBack(event: string, func: (e: Event) => void) {
        this.Btn_Back.addEventListener(event, func);
    }
}

export class LeaderMenu extends Menu {

    public Input: HTMLInputElement;
    private Btn_Back: HTMLElement;
    private List: HTMLElement;
    private LoadBlock: HTMLElement;

    public constructor(IdMenu, inputId: string, btn_backId: string, listId: string, loadId: string) {
        super(IdMenu);
        this.Input = <HTMLInputElement>document.getElementById(inputId);
        this.Btn_Back = document.getElementById(btn_backId);
        this.List = document.getElementById(listId);
        this.LoadBlock = document.getElementById(loadId);
    }

    public IsEmpty() {
        if (this.Input.value.trim() == "") {
            return true;
        }
        return false;
    }

    public AddEventInput(event: string, func: (e: Event) => void) {
        this.Input.addEventListener(event, func);
    }

    public AddEventBack(event: string, func: (e: Event) => void) {
        this.Btn_Back.addEventListener(event, func);
    }

    public AddInList(element: Element) {
        this.List.appendChild(element);
    }

    public RemoveAllFromList() {
        this.List.innerHTML = "";
    }

    public SetEntries(users: User[]) {
        Program.leaderMenu.RemoveAllFromList();
        users.sort((a, b) => b.record - a.record);
        users.forEach((user) => {
            let element = document.createElement("div");
            element.className = "entry";
            element.innerHTML = (`<div>${user.userName}</div><div>${user.record}</div>`);
            Program.leaderMenu.AddInList(element);
        });
    } 

    public AddLoadBlock() {
        this.LoadBlock.classList.add("active");
    }

    public RemoveLoadBlock() {
        this.LoadBlock.classList.remove("active");
    }
}

export class PlayMenu extends Menu {

    private Btn_Continue: HTMLElement;
    private Btn_Back: HTMLElement
    private Time: HTMLElement;
    private Score: HTMLElement;

    public constructor(IdMenu, btn_continueId: string, btn_backId: string, label_timeId: string, label_scoreId: string) {
        super(IdMenu);
        this.Btn_Continue = document.getElementById(btn_continueId);
        this.Btn_Back = document.getElementById(btn_backId);
        this.Time = document.getElementById(label_timeId);
        this.Score = document.getElementById(label_scoreId);
    }

    public UpdateTime(value: string) {
        this.Time.innerHTML = `Time: ${value}`;
    }

    public UpdateScore(value: string) {
        this.Score.innerHTML = `Score: ${value}`;
    }

    public AddEventContinue(event: string, func: (e: Event) => void) {
        this.Btn_Continue.addEventListener(event, func);
    }

    public AddEventBack(event: string, func: (e: Event) => void) {
        this.Btn_Back.addEventListener(event, func);
    }
}