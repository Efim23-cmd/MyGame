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
export var Game;
(function (Game) {
    class Movement {
        static Start() {
            Movement.IsRun = true;
            Game.Scene.Open();
            Program.sound_Main.Play();
            Program.timer.Start();
            Program.player.SetInDefault();
            Movement.Update();
        }
        static Continue() {
            Movement.IsRun = true;
            Program.sound_Main.Play();
            Game.Scene.Open();
            Program.timer.Continue();
            Movement.Update();
        }
        static Stop() {
            Movement.IsRun = false;
            cancelAnimationFrame(Movement.idAnimate);
            Program.sound_Main.Pause();
            Game.Scene.Close();
            Program.timer.Stop();
        }
        static Clear() {
            return __awaiter(this, void 0, void 0, function* () {
                Movement.IsRun = false;
                cancelAnimationFrame(Movement.idAnimate);
                Program.replayMenu.UpdateTime(Program.timer.Time);
                Program.replayMenu.UpdateScore(Program.player.Score.toString());
                Program.MainUser.record = Program.player.Score;
                Program.mainMenu.UpdateName(Program.MainUser.userName);
                Program.mainMenu.UpdateRecord(Program.MainUser.record.toString());
                Program.MainUser.UpdateUserAtServer();
                Scene.RestoreHp();
                Program.sound_Main.Clear();
                Fruit.ClearFruits();
                Program.timer.Clear();
                Game.Scene.Close();
                if (Program.player.Score > 10) {
                    Program.replayMenu.UpdateIsWin("Win");
                }
                else {
                    Program.replayMenu.UpdateIsWin("Loose");
                }
                Program.player.SetInDefault();
            });
        }
        static Update() {
            Movement.idAnimate = requestAnimationFrame(function update() {
                Movement.counterForTimer++;
                if (Movement.counterForTimer % 60 === 0) {
                    new Fruit();
                }
                for (let fruit of Fruit.ListOfFruits) {
                    if (fruit.element.offsetTop >= Program.player.element.offsetTop && fruit.element.offsetLeft >= Program.player.element.offsetLeft - 30 && fruit.element.offsetLeft <= Program.player.element.offsetLeft + Program.player.element.offsetWidth) {
                        Scene.ContainerOfFruit.removeChild(fruit.element);
                        Program.player.TakeCoint();
                        Program.sound_Fall.Clear();
                        Program.sound_Fall.Play();
                    }
                    else if (fruit.element.offsetTop >= Scene.Floor.offsetTop - 50) {
                        Scene.ContainerOfFruit.removeChild(fruit.element);
                        Program.player.Injure();
                        Program.sound_Death.Clear();
                        Program.sound_Death.Play();
                    }
                    else {
                        fruit.roteteDeg += fruit.speedRotate;
                        fruit.element.style.rotate = `${fruit.roteteDeg}deg`;
                        fruit.element.style.top = `${fruit.element.offsetTop + fruit.speedFall}px`;
                    }
                }
                if (Movement.IsRun) {
                    requestAnimationFrame(update);
                }
            });
        }
    }
    Movement.counterForTimer = 0;
    Movement.IsRun = false;
    Game.Movement = Movement;
    class Scene {
        static Open() {
            Scene.Scene.classList.remove("stop");
        }
        static Close() {
            Scene.Scene.classList.add("stop");
        }
        static InjureHp(id) {
            Scene.ListHeart[id].classList.add("injure");
        }
        static RestoreHp() {
            for (let heart of Scene.ListHeart) {
                heart.classList.remove("injure");
            }
        }
    }
    Scene.ContainerOfFruit = document.getElementById("ceil");
    Scene.Floor = document.getElementById("floor");
    Scene.ListHeart = Array.from(document.getElementsByClassName("heart"));
    Scene.Scene = document.getElementById("scene");
    Game.Scene = Scene;
    class Timer {
        get Time() {
            return this._Time;
        }
        set Time(value) {
            this._Time = value;
        }
        constructor(elementName) {
            this._Time = "00:00";
            this.element = document.querySelector(elementName);
        }
        Start() {
            this.startTime = Math.round(Date.now());
            this.UpdateTime();
        }
        Continue() {
            this.startTime += (Date.now() - this.stopTime);
            this.UpdateTime();
        }
        Stop() {
            this.stopTime = Math.round(Date.now());
            clearInterval(this.idInterval);
        }
        Clear() {
            this.Time = "00:00";
            this.SetTime();
            clearInterval(this.idInterval);
        }
        SetTime() {
            this.element.textContent = this.Time;
        }
        UpdateTime() {
            this.idInterval = setInterval(() => {
                this.Time = this.ConvertTime(Date.now() - this.startTime);
                this.SetTime();
            }, 500);
        }
        ConvertTime(milliseconds) {
            let second = Math.floor(milliseconds / 1000);
            let secondBefore = Math.floor(second % 60);
            let minutes = Math.floor(second / 60);
            return `${Math.floor(minutes / 10)}${minutes % 10}:${Math.floor(secondBefore / 10)}${secondBefore % 10}`;
        }
    }
    Game.Timer = Timer;
    class Player {
        get Time() {
            return Program.timer.Time;
        }
        get Hp() {
            return this._Hp;
        }
        set Hp(value) {
            if (value <= 0) {
                Movement.Clear();
                Program.sound_GameOver.Play();
                Program.replayMenu.Open();
            }
            this._Hp = value;
        }
        get Score() {
            return this._Score;
        }
        set Score(value) {
            this._Score = value;
        }
        constructor(playgroundName, elementName) {
            this.step = 100;
            this._Hp = Scene.ListHeart.length;
            this._Score = 0;
            this.playground = document.querySelector(playgroundName);
            this.element = document.querySelector(elementName);
        }
        TakeCoint() {
            this.Score++;
        }
        Injure() {
            Scene.InjureHp(this.Hp - 1);
            this.Hp--;
        }
        SetInDefault() {
            this.Score = 0;
            this.Hp = Scene.ListHeart.length;
            this.element.style.left = `${this.playground.offsetWidth / 2 - this.element.offsetWidth / 2}px`;
        }
        SetInOrder() {
            if (this.element.offsetLeft < this.playground.offsetLeft) {
                this.element.style.left = `${this.playground.offsetLeft}px`;
            }
            else if (this.element.offsetLeft + this.element.offsetWidth > this.playground.offsetLeft + this.playground.offsetWidth) {
                this.element.style.left = `${this.playground.offsetLeft + this.playground.offsetWidth - this.element.offsetWidth}px`;
            }
        }
        SetInOtherSide() {
            if (this.element.offsetLeft + (this.element.offsetWidth) < this.playground.offsetLeft) {
                this.element.style.left = `${this.playground.offsetLeft + this.playground.offsetWidth - this.element.offsetWidth}px`;
            }
            else if (this.element.offsetLeft + this.element.offsetWidth - (this.element.offsetWidth) > this.playground.offsetLeft + this.playground.offsetWidth) {
                this.element.style.left = `${this.playground.offsetLeft}px`;
            }
        }
    }
    Game.Player = Player;
    class Fruit {
        constructor() {
            this.roteteDeg = 0;
            this.element = document.createElement("div");
            this.element.classList.add(Fruit.Random('fruit1', 'fruit2', 'fruit3', 'fruit4', 'fruit5', 'fruit6', 'fruit7', 'fruit8', 'fruit9', 'fruit10'));
            this.element.style.left = `${Fruit.RandomBetween(100, Program.player.playground.offsetLeft + Program.player.playground.offsetWidth - 100)}px`;
            this.speedFall = Fruit.RandomBetween(5, 10);
            this.speedRotate = Fruit.RandomBetween(-10, 10);
            Scene.ContainerOfFruit.insertAdjacentElement("afterbegin", this.element);
            Fruit.ListOfFruits.add(this);
        }
        static UpdatePos() {
            for (let fruit of Fruit.ListOfFruits) {
                fruit.roteteDeg += fruit.speedRotate;
                fruit.element.style.rotate = `${fruit.roteteDeg}deg`;
                fruit.element.style.top = `${fruit.element.offsetTop + fruit.speedFall}px`;
            }
        }
        static ClearFruits() {
            Scene.ContainerOfFruit.innerHTML = "";
            Fruit.ListOfFruits.clear();
        }
        static Random(...values) {
            let step = 1 / values.length;
            let varRandom = Math.random();
            for (let index = 0; index < values.length; index++) {
                if (index * step >= varRandom && varRandom < (index + 1) * step) {
                    return values[index];
                }
            }
        }
        static RandomBetween(from, to) {
            let varRandom = Math.random();
            if (from == to) {
                return from;
            }
            else if (from > to) {
                return to + (from - to) * varRandom;
            }
            return from + (to - from) * varRandom;
        }
    }
    Fruit.ListOfFruits = new Set();
    Game.Fruit = Fruit;
})(Game || (Game = {}));
//# sourceMappingURL=Game.js.map