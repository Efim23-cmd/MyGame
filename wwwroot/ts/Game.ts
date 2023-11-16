import Program from "./Main.js";
import Sound from "./Sound.js";
export namespace Game {
    export class Movement{
        public static idAnimate;
        private static counterForUpdate: number = 0;
        public static IsRun: boolean = false;

        public static Start() {
            Movement.Clear();
            Movement.IsRun = true;
            Game.Scene.Open();
            Program.sound_Main.Play();
            Program.timer.Start();
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

        public static Clear() {
            Movement.IsRun = false;
            Object.ClearObjects();
            Program.timer.Clear();
            Scene.RestoreHp();
            Program.player.SetInDefault();
        }

        public static Update() {
            Scene.UpdateFloorScale();
            let ratio = 100;
            
            Movement.idAnimate = requestAnimationFrame(function update() {
                Movement.counterForUpdate++;
                if (Movement.counterForUpdate % ratio == 0) {
                    Program.Random(
                        () => new Fruit(),
                        () => new Fruit(),
                        () => new Fruit(),
                        () => new Fruit(),
                        () => new Fruit(),
                        () => new Fruit(),
                        () => new RottenFruit(),
                        () => new RottenFruit(),
                        () => new HolyFruit()
                    )();
                }
                if (Movement.counterForUpdate % 600 == 0) {
                    ratio -= 5;
                }
                Scene.UpdatePlayerScale();
                for (let object of Object.ListOfObjects) {
                    Scene.ObjectScale = object.element.getBoundingClientRect();
                    if (Scene.ObjectScale.top >= Scene.PlayerScale.top && Scene.ObjectScale.left >= Scene.PlayerScale.left && Scene.ObjectScale.right <= Scene.PlayerScale.right) {
                        object.Take();
                        object.Remove();
                    }
                    else if (Scene.ObjectScale.bottom >= Scene.FloorScale.top) {
                        object.Miss();
                        object.Remove();
                    }
                    else {
                        object.Update();
                    }
                }
                if (Movement.IsRun) {
                    requestAnimationFrame(update);
                }
            });
        }
    }

    export class Scene {
        public static ContainerOfObject = document.getElementById("ceil");
        public static Player = document.getElementById("basket");
        public static PlayerScale: DOMRect;

        public static Floor = document.getElementById("floor");
        public static FloorScale: DOMRect;

        public static ObjectScale: DOMRect;

        public static ListHeart = Array.from(document.getElementsByClassName("heart"));

        private static Scene = document.getElementById("scene");

        public static Open() {
            Scene.Scene.classList.remove("stop");
        }
        public static Close() {
            Scene.Scene.classList.add("stop");
        }

        public static UpdatePlayerScale() {
            Scene.PlayerScale =  Scene.Player.getBoundingClientRect();
        }

        public static UpdateFloorScale() {
            Scene.FloorScale = Scene.Floor.getBoundingClientRect();
        }

        public static CureHp(id) {
            Scene.ListHeart[--id].classList.remove("injure");
        }

        public static InjureHp(id) {
            Scene.ListHeart[--id].classList.add("injure");
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
                Player.SetDeath();
            }
            else if (value >= Scene.ListHeart.length) {
                this._Hp = Scene.ListHeart.length;
            }
            else {
                this._Hp = value;
            }
        }

        private static SetDeath() {
            Movement.Stop();
            Program.replayMenu.Open();
            Program.replayMenu.UpdateTime(Program.timer.Time);
            Program.replayMenu.UpdateScore(Program.player.Score.toString());
            Program.MainUser.record = Program.player.Score;
            Program.mainMenu.UpdateRecord(Program.MainUser.record.toString());
            Game.Scene.Close();
            Program.sound_GameOver.Play();
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

        public TakeHp() {
            ++this.Hp;
            Scene.CureHp(this.Hp);
        }

        public TakeDamage() {
            Scene.InjureHp(this.Hp);
            --this.Hp;
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
    }

    export abstract class Object {
        public element: HTMLElement;
        public static ListOfObjects: Set<Object> = new Set<Object>();

        private Route: number = 0;
        private speedFall: number = 1; 

        private speedRotate: number = 0; 
        private rotateDeg: number = 0;
     
        constructor(...values) {
            this.element = document.createElement("div");
            this.element.className = (Program.Random(...values));
            this.element.style.left = `${Program.RandomBetween(1, 95)}%`;
            this.speedRotate = Program.RandomBetween(-10, 10);
            Scene.ContainerOfObject.insertAdjacentElement("afterbegin", this.element);
            Object.ListOfObjects.add(this);
        }

        public Update() {
            this.rotateDeg += this.speedRotate;
            this.element.style.rotate = `${this.rotateDeg}deg`;
            this.Route += this.speedFall;
            this.element.style.top = `${this.Route}%`;
        }

        public Remove() {
            this.element.remove();
        }

        public static ClearObjects() {
            Scene.ContainerOfObject.innerHTML = "";
            Object.ListOfObjects.clear();
        }

        public abstract Take();
        public abstract Miss();
    }

    class Fruit extends Object {
        constructor() {
            super('fruit1', 'fruit2', 'fruit3', 'fruit4', 'fruit5', 'fruit6', 'fruit7', 'fruit8', 'fruit9', 'fruit10');
        }
        public Take() {
            Program.player.TakeCoint();
            Program.sound_Coint.Play();
        }
        public Miss() {
            Program.player.TakeDamage();
            Program.sound_Death.Play();
        }
    }

    class RottenFruit extends Object {
        constructor() {
            super('fruit1 rotten', 'fruit2 rotten', 'fruit3 rotten', 'fruit4 rotten', 'fruit5 rotten', 'fruit6 rotten', 'fruit7 rotten', 'fruit8 rotten', 'fruit9 rotten', 'fruit10 rotten');
        }
        public Take() {
            Program.player.TakeDamage();
            Program.sound_Death.Play();
        }
        public Miss() {
            Program.sound_Death.Play();
        }
    }

    class HolyFruit extends Object {
        constructor() {
            super('fruit1 holy', 'fruit2 holy', 'fruit3 holy', 'fruit4 holy', 'fruit5 holy', 'fruit6 holy', 'fruit7 holy', 'fruit8 holy', 'fruit9 holy', 'fruit10 holy');
        }
        public Take() {
            Program.player.TakeHp();
            Program.sound_Health.Play();
        }
        public Miss() {
            Program.sound_Death.Play();
        }
    }
}
