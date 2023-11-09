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
            Menu.CloseMenuWithRandomPos(Program.mainMenu, Program.leaderMenu, Program.playMenu, Program.replayMenu, Program.replayMenu, Program.enterMenu);
            Game.Fruit.ClearFruits();
            Game.Scene.RestoreHp();
            if (yield Program.MainUser.CheckUser()) {
                Program.mainMenu.UpdateName(Program.MainUser.userName);
                Program.mainMenu.UpdateRecord(Program.MainUser.record.toString());
                Program.mainMenu.Open();
                Program.MainUser.IsNewUser = false;
            }
            yield Search.GetListTopTen();
            Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
            Program.player.SetInDefault();
            setTimeout(() => {
                clearInterval(idTimer);
                loadPage === null || loadPage === void 0 ? void 0 : loadPage.classList.add("inactive");
                Program.MainUser.IsNewUser ? Program.enterMenu.Open() : Program.mainMenu.Open();
            }, 3000);
        }));
        /*window.addEventListener("storage", (event) => {
            localStorage.setItem(event.key, event.oldValue);
            Program.Message("Is he the smartest?");
        });
*/
        Program.btns.forEach((btn) => {
            btn.addEventListener("click", () => {
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
            Program.MainUser.userName = Program.enterMenu.Input.value;
            if (yield Program.MainUser.SaveUserAtServer()) {
                Game.Movement.Start();
                Menu.CloseMenuWithRandomPos(Program.enterMenu);
                Program.MainUser.IsNewUser = false;
            }
        }));
        Program.enterMenu.AddEventLeader("click", () => __awaiter(this, void 0, void 0, function* () {
            User.AbortRequest();
            Menu.CloseMenuWithRandomPos(Program.enterMenu);
            Program.leaderMenu.Open();
            if (!Program.leaderMenu.IsEmpty()) {
                yield Search.GetListOnRequest(Program.leaderMenu.Input.value);
            }
            else {
                Program.leaderMenu.RemoveAllFromList();
                Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
            }
        }));
        /*Main Menu*/
        Program.mainMenu.AddEventStart("click", () => __awaiter(this, void 0, void 0, function* () {
            if (!Program.MainUser.IsNewUser) {
                if (!Game.Movement.IsRun) {
                    Game.Movement.Start();
                    Menu.CloseMenuWithRandomPos(Program.mainMenu);
                }
            }
            else {
                Program.Message("Is he the smartest?");
            }
        }));
        Program.mainMenu.AddEventLeader("click", () => __awaiter(this, void 0, void 0, function* () {
            Menu.CloseMenuWithRandomPos(Program.mainMenu);
            Program.leaderMenu.Open();
            if (!Program.leaderMenu.IsEmpty()) {
                yield Search.GetListOnRequest(Program.leaderMenu.Input.value);
            }
            else {
                Program.leaderMenu.RemoveAllFromList();
                Program.leaderMenu.SetEntries(JSON.parse(localStorage.getItem("topTen")));
            }
        }));
        /*Leader Menu*/
        Program.leaderMenu.AddEventBack("click", () => {
            Search.AbortRequest();
            Menu.CloseMenuWithRandomPos(Program.leaderMenu);
            if (Program.MainUser.IsNewUser) {
                Program.enterMenu.Open();
            }
            else {
                Program.mainMenu.Open();
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
                if (!Game.Movement.IsRun) {
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
            if (!Game.Movement.IsRun) {
                Game.Movement.Clear();
                Menu.CloseMenuWithRandomPos(Program.playMenu);
                Program.mainMenu.Open();
            }
        });
        /*Replay Menu*/
        Program.replayMenu.AddEventReplay("click", () => {
            if (!Program.MainUser.IsNewUser) {
                if (!Game.Movement.IsRun) {
                    Game.Movement.Start();
                    Menu.CloseMenuWithRandomPos(Program.replayMenu);
                }
            }
            else {
                Program.Message("Is he the smartest?");
            }
        });
        Program.replayMenu.AddEventBack("click", () => {
            if (!Game.Movement.IsRun) {
                Game.Movement.Clear();
                Menu.CloseMenuWithRandomPos(Program.replayMenu);
                Program.mainMenu.Open();
            }
        });
        /*Scene*/
        window.addEventListener("keydown", (e) => {
            if (e.keyCode == 27) {
                if (Game.Movement.IsRun) {
                    Game.Movement.Stop();
                    Program.playMenu.UpdateScore(Program.player.Score.toString());
                    Program.playMenu.UpdateTime(Program.player.Time);
                    Program.playMenu.Open();
                }
                else {
                    Game.Movement.Continue();
                    Menu.CloseMenuWithRandomPos(Program.playMenu);
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
        window.addEventListener("resize", () => {
            Program.player.SetInOrder();
        });
        window.addEventListener("keydown", (e) => {
            if (Game.Movement.IsRun) {
                if (e.key == "ArrowRight") {
                    Program.player.element.style.left = `${Program.player.element.offsetLeft + Program.player.step}px`;
                }
                else if (e.key == "ArrowLeft") {
                    Program.player.element.style.left = `${Program.player.element.offsetLeft - Program.player.step}px`;
                }
                Program.player.SetInOtherSide();
            }
        });
    }
}
//# sourceMappingURL=Events.js.map