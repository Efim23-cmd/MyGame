var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Program from "./Main.js";
import Sound from "./Sound.js";
import User from "./User.js";
import Search from "./Search.js";
import { Menu } from "./Menu.js";
import { Game } from "./Game.js";
export default class Events {
    static SetEvents() {
        /*Common*/
        let loadPage = document.getElementById("loadPage");
        let animateBlock = document.querySelector("#loadPage>div");
        let randomVar;
        let idTimer = setInterval(() => {
            randomVar = Math.random();
            if (randomVar >= 0 && randomVar < 0.3) {
                animateBlock.className = "happy";
            }
            else if (randomVar >= 0.3 && randomVar < 0.6) {
                animateBlock.className = "angry";
            }
            else {
                animateBlock.className = "sad";
            }
        }, 3000);
        window.addEventListener("load", () => __awaiter(this, void 0, void 0, function* () {
            Menu.CloseMenuWithRandomPos(Program.mainMenu, Program.visualizerMenu, Program.leaderMenu, Program.playMenu, Program.replayMenu, Program.replayMenu, Program.enterMenu);
            if (yield Program.MainUser.CheckUser()) {
                Program.mainMenu.UpdateName(Program.MainUser.userName);
                Program.mainMenu.UpdateRecord(Program.MainUser.record.toString());
                Program.mainMenu.Open();
                Program.MainUser.IsNewUser = false;
            }
            yield Search.GetListTopTen();
            Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
            Program.player.SetInDefault();
            clearInterval(idTimer);
            loadPage === null || loadPage === void 0 ? void 0 : loadPage.classList.add("inactive");
            Program.MainUser.IsNewUser ? Program.enterMenu.Open() : Program.mainMenu.Open();
        }));
        window.addEventListener("storage", (event) => {
            localStorage.setItem(event.key, event.oldValue);
            Program.Message("Is he the smartest?");
        });
        Program.btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                Sound.ClearAll();
                Program.sound_Click.Play();
            });
        });
        /*Enter Menu*/
        Program.enterMenu.AddEventInput("keyup", () => {
            if (Program.enterMenu.IsEmpty()) {
                Program.enterMenu.SetDisabled();
            }
            else {
                Program.enterMenu.SetEnabled();
            }
        });
        Program.enterMenu.AddEventInput("paste", () => {
            if (Program.enterMenu.IsEmpty()) {
                Program.enterMenu.SetDisabled();
            }
            else {
                Program.enterMenu.SetEnabled();
            }
        });
        Program.enterMenu.AddEventStart("click", () => __awaiter(this, void 0, void 0, function* () {
            User.AbortRequest();
            if (!Game.Movement.IsRun && !Menu.IsRun) {
                Program.MainUser.userName = Program.enterMenu.Input.value;
                if (yield Program.MainUser.SaveUserAtServer()) {
                    Program.visualizerMenu.Open();
                    Menu.CloseMenuWithRandomPos(Program.enterMenu);
                    Program.MainUser.IsNewUser = false;
                }
            }
        }));
        Program.enterMenu.AddEventLeader("click", () => __awaiter(this, void 0, void 0, function* () {
            User.AbortRequest();
            if (!Game.Movement.IsRun && !Menu.IsRun) {
                Menu.CloseMenuWithRandomPos(Program.enterMenu);
                Program.leaderMenu.Open();
                if (!Program.leaderMenu.IsEmpty()) {
                    yield Search.GetListOnRequest(Program.leaderMenu.Input.value);
                }
                else {
                    Program.leaderMenu.RemoveAllFromList();
                    Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
                }
            }
        }));
        /*Main Menu*/
        Program.mainMenu.AddEventStart("click", () => __awaiter(this, void 0, void 0, function* () {
            if (!Program.MainUser.IsNewUser) {
                if (!Game.Movement.IsRun && !Menu.IsRun) {
                    Program.visualizerMenu.Open();
                    Menu.CloseMenuWithRandomPos(Program.mainMenu);
                }
            }
            else {
                Program.Message("Is he the smartest?");
            }
        }));
        Program.mainMenu.AddEventLeader("click", () => __awaiter(this, void 0, void 0, function* () {
            if (!Game.Movement.IsRun && !Menu.IsRun) {
                Menu.CloseMenuWithRandomPos(Program.mainMenu);
                Program.leaderMenu.Open();
                if (!Program.leaderMenu.IsEmpty()) {
                    yield Search.GetListOnRequest(Program.leaderMenu.Input.value);
                }
                else {
                    Program.leaderMenu.RemoveAllFromList();
                    Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
                }
            }
        }));
        /*Visualizer Menu*/
        Program.visualizerMenu.AddEventStart("click", () => __awaiter(this, void 0, void 0, function* () {
            if (!Program.MainUser.IsNewUser) {
                if (!Game.Movement.IsRun && !Menu.IsRun) {
                    Game.Movement.Start();
                    Menu.CloseMenuWithRandomPos(Program.visualizerMenu);
                }
            }
            else {
                Program.Message("Is he the smartest?");
            }
        }));
        /*Leader Menu*/
        Program.leaderMenu.AddEventBack("click", () => {
            Search.AbortRequest();
            if (!Game.Movement.IsRun && !Menu.IsRun) {
                Menu.CloseMenuWithRandomPos(Program.leaderMenu);
                if (Program.MainUser.IsNewUser) {
                    Program.enterMenu.Open();
                }
                else {
                    Program.mainMenu.Open();
                }
            }
        });
        Program.leaderMenu.AddEventInput("input", () => __awaiter(this, void 0, void 0, function* () {
            Search.AbortRequest();
            if (!Program.leaderMenu.IsEmpty()) {
                yield Search.GetListOnRequest(Program.leaderMenu.Input.value);
            }
            else {
                Program.leaderMenu.RemoveAllFromList();
                Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
                Program.leaderMenu.RemoveLoadBlock();
            }
        }));
        Program.leaderMenu.AddEventInput("paste", () => __awaiter(this, void 0, void 0, function* () {
            Search.AbortRequest();
            if (!Program.leaderMenu.IsEmpty()) {
                yield Search.GetListOnRequest(Program.leaderMenu.Input.value);
            }
            else {
                Program.leaderMenu.RemoveAllFromList();
                Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
                Program.leaderMenu.RemoveLoadBlock();
            }
        }));
        /*Play Menu*/
        Program.playMenu.AddEventContinue("click", () => {
            if (!Program.MainUser.IsNewUser) {
                if (!Game.Movement.IsRun && !Menu.IsRun) {
                    Game.Movement.Continue();
                    Menu.CloseMenuWithRandomPos(Program.playMenu);
                    Game.Scene.Open();
                }
            }
            else {
                Program.Message("Is he the smartest?");
            }
        });
        Program.playMenu.AddEventBack("click", () => {
            if (!Game.Movement.IsRun && !Menu.IsRun) {
                Game.Movement.Clear();
                Menu.CloseMenuWithRandomPos(Program.playMenu);
                Program.mainMenu.Open();
            }
        });
        /*Replay Menu*/
        Program.replayMenu.AddEventReplay("click", () => {
            if (!Program.MainUser.IsNewUser) {
                if (!Game.Movement.IsRun && !Menu.IsRun) {
                    Game.Movement.Start();
                    Menu.CloseMenuWithRandomPos(Program.replayMenu);
                }
            }
            else {
                Program.Message("Is he the smartest?");
            }
        });
        Program.replayMenu.AddEventBack("click", () => {
            if (!Game.Movement.IsRun && !Menu.IsRun) {
                Game.Movement.Clear();
                Menu.CloseMenuWithRandomPos(Program.replayMenu);
                Program.mainMenu.Open();
            }
        });
        /*Scene*/
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 27) {
                if (!Menu.IsActive && Game.Movement.IsRun && !Menu.IsRun) {
                    Game.Movement.Stop();
                    Program.playMenu.UpdateScore(Program.player.Score.toString());
                    Program.playMenu.UpdateTime(Program.player.Time);
                    Program.playMenu.Open();
                    Sound.ClearAll();
                    Program.sound_Click.Play();
                }
            }
        });
        Program.scene_btn_stop.addEventListener("click", () => {
            if (Game.Movement.IsRun) {
                Game.Movement.Stop();
                Program.playMenu.UpdateScore(Program.player.Score.toString());
                Program.playMenu.UpdateTime(Program.player.Time);
                Program.playMenu.Open();
            }
        });
        /*Player*/
        let IsFlag;
        let startPosX;
        Program.player.element.addEventListener("mousedown", (event) => {
            Program.player.element.classList.add("grabbing");
            startPosX = event.pageX - Program.player.element.offsetLeft;
            IsFlag = true;
        });
        window.addEventListener("mousemove", (event) => {
            if (IsFlag) {
                Program.player.element.style.left = `${event.pageX - startPosX}px`;
            }
        });
        window.addEventListener("mouseup", () => {
            if (IsFlag) {
                Program.player.SetInOrder();
                Program.player.element.classList.remove("grabbing");
                IsFlag = false;
            }
        });
        Program.player.element.addEventListener("touchstart", (event) => {
            startPosX = event.touches[0].pageX - Program.player.element.offsetLeft;
            IsFlag = true;
        });
        window.addEventListener("touchmove", (event) => {
            if (IsFlag) {
                Program.player.element.style.left = `${event.touches[0].pageX - startPosX}px`;
            }
        });
        window.addEventListener("touchend", () => {
            if (IsFlag) {
                Program.player.SetInOrder();
                IsFlag = false;
            }
        });
        window.addEventListener("resize", () => {
            Game.Scene.UpdateFloorScale();
            Program.player.SetInOrder();
        });
    }
}
//# sourceMappingURL=Events.js.map