import Program from "./Main.js";
import Sound from "./Sound.js";
export namespace Game {
    export class Movement{
        public static idAnimate;
        public static counterForTimer = 0;
        public static IsRun: boolean = false;

        public static Start() {
            Movement.IsRun = true;
            Game.Scene.Open();
            Program.sound_Main.Play();
            Program.timer.Start();
            Program.player.SetInDefault();
            Movement.Update();
        }

        public static Continue() {
            Movement.IsRun = true;
            Program.sound_Main.Play();
            Game.Scene.Open();
            Program.timer.Continue();
            Movement.Update();
        }

        public static Stop() {
            Movement.IsRun = false;
            cancelAnimationFrame(Movement.idAnimate);
            Program.sound_Main.Pause();
            Game.Scene.Close();
            Program.timer.Stop();
        }

        public static async Clear() {
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
        }

        public static Update() {
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
                        fruit.element.style.rotate = `${fruit.roteteDeg}deg`
                        fruit.element.style.top = `${fruit.element.offsetTop + fruit.speedFall}px`
                    }
                }
                if (Movement.IsRun) {
                    requestAnimationFrame(update);
                }
            });
        }
    }

    export class Scene {
        public static ContainerOfFruit = document.getElementById("ceil");
        public static Floor = document.getElementById("floor");
        public static ListHeart = Array.from(document.getElementsByClassName("heart"));

        private static Scene = document.getElementById("scene");

        public static Open() {
            Scene.Scene.classList.remove("stop");
        }
        public static Close() {
            Scene.Scene.classList.add("stop");
        }
        public static InjureHp(id) {
            Scene.ListHeart[id].classList.add("injure");
        }
        public static RestoreHp() {
            for (let heart of Scene.ListHeart) {
                heart.classList.remove("injure");
            }
        }
    }

    export class Timer {
        private element: HTMLElement;
        private idInterval: number;
        private startTime: number;
        private stopTime: number;
        public _Time: string = "00:00";

        public get Time() {
            return this._Time;
        }

        private set Time(value) {
            this._Time = value;
        }

        constructor(elementName: string) {
            this.element = document.querySelector(elementName);
        }

        public Start() {
            this.startTime = Math.round(Date.now());
            this.UpdateTime();
        }

        public Continue() {
            this.startTime += (Date.now() - this.stopTime);
            this.UpdateTime();
        }

        public Stop() {
            this.stopTime = Math.round(Date.now());
            clearInterval(this.idInterval);
        }

        public Clear() {
            this.Time = "00:00"
            this.SetTime();
            clearInterval(this.idInterval);
        }

        private SetTime() {
            this.element.textContent = this.Time;
        }

        public UpdateTime() {
            this.idInterval = setInterval(() => {
                this.Time = this.ConvertTime(Date.now() - this.startTime);
                this.SetTime();
            }, 500);
        }

        private ConvertTime(milliseconds) {
            let second: number = Math.floor(milliseconds / 1000);
            let secondBefore: number = Math.floor(second % 60);
            let minutes: number = Math.floor(second / 60);
            return `${Math.floor(minutes / 10)}${minutes % 10}:${Math.floor(secondBefore / 10)}${secondBefore % 10}`;
        }
    }

    export class Player {
        public readonly playground: HTMLElement;
        public readonly element: HTMLElement;
        public readonly step: number = 100;

        public _Hp: number = Scene.ListHeart.length;
        public _Score: number = 0;

        public get Time() {
            return Program.timer.Time;
        }

        public get Hp() {
            return this._Hp;
        }

        private set Hp(value) {
            if (value <= 0) {
                Movement.Clear();
                Program.sound_GameOver.Play();
                Program.replayMenu.Open();
            }
            this._Hp = value;
        }

        public get Score() {
            return this._Score;
        }

        private set Score(value) {
            this._Score = value;
        }

        constructor(playgroundName: string, elementName: string) {
            this.playground = document.querySelector(playgroundName);
            this.element = document.querySelector(elementName);
        }

        public TakeCoint() {
            this.Score++;
        }

        public Injure() {
            Scene.InjureHp(this.Hp - 1);
            this.Hp--;
        }

        public SetInDefault() {
            this.Score = 0;
            this.Hp = Scene.ListHeart.length;
            this.element.style.left = `${this.playground.offsetWidth / 2 - this.element.offsetWidth / 2}px`;
        }

        public SetInOrder() {
            if (this.element.offsetLeft < this.playground.offsetLeft) {
                this.element.style.left = `${this.playground.offsetLeft}px`;
            }
            else if (this.element.offsetLeft + this.element.offsetWidth > this.playground.offsetLeft + this.playground.offsetWidth) {
                this.element.style.left = `${this.playground.offsetLeft + this.playground.offsetWidth - this.element.offsetWidth}px`;
            }
        }

        public SetInOtherSide() {
            if (this.element.offsetLeft + (this.element.offsetWidth) < this.playground.offsetLeft) {
                this.element.style.left = `${this.playground.offsetLeft + this.playground.offsetWidth - this.element.offsetWidth}px`;
            }
            else if (this.element.offsetLeft + this.element.offsetWidth - (this.element.offsetWidth) > this.playground.offsetLeft + this.playground.offsetWidth) {
                this.element.style.left = `${this.playground.offsetLeft}px`;
            }
        }

    }

    export class Fruit {
        public element: HTMLElement;
        public static ListOfFruits: Set<Fruit> = new Set<Fruit>();
        public speedFall: number; 
        public roteteDeg: number = 0;
        public speedRotate: number; 
     
        constructor() {
            this.element = document.createElement("div");
            this.element.classList.add(Fruit.Random('fruit1', 'fruit2', 'fruit3', 'fruit4', 'fruit5', 'fruit6', 'fruit7', 'fruit8', 'fruit9', 'fruit10'));
            this.element.style.left = `${Fruit.RandomBetween(100, Program.player.playground.offsetLeft + Program.player.playground.offsetWidth - 100)}px`;
            this.speedFall = Fruit.RandomBetween(5, 10);
            this.speedRotate = Fruit.RandomBetween(-10, 10);
            Scene.ContainerOfFruit.insertAdjacentElement("afterbegin", this.element);
            Fruit.ListOfFruits.add(this);
        }

        public static UpdatePos() {
            for (let fruit of Fruit.ListOfFruits) {
                fruit.roteteDeg += fruit.speedRotate;
                fruit.element.style.rotate = `${fruit.roteteDeg}deg`
                fruit.element.style.top = `${fruit.element.offsetTop + fruit.speedFall}px`
            }
        }

        public static ClearFruits() {
            Scene.ContainerOfFruit.innerHTML = "";
            Fruit.ListOfFruits.clear();
        }

        public static Random(...values) {
            let step = 1 / values.length;
            let varRandom = Math.random();
            for (let index = 0; index < values.length; index++) {
                if (index * step >= varRandom && varRandom < (index + 1) * step) {
                    return values[index];
                }
            }
        }

        public static RandomBetween(from: number, to: number) {
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
}
