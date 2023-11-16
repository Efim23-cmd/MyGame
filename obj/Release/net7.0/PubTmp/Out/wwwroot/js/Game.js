import Program from "./Main.js";
export var Game;
(function (Game) {
    class Movement {
        static Start() {
            Movement.Clear();
            Movement.IsRun = true;
            Game.Scene.Open();
            Program.sound_Main.Play();
            Program.timer.Start();
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
            Movement.IsRun = false;
            Object.ClearObjects();
            Program.timer.Clear();
            Scene.RestoreHp();
            Program.player.SetInDefault();
        }
        static Update() {
            Scene.UpdateFloorScale();
            let ratio = 100;
            Movement.idAnimate = requestAnimationFrame(function update() {
                Movement.counterForUpdate++;
                if (Movement.counterForUpdate % ratio == 0) {
                    Program.Random(() => new Fruit(), () => new Fruit(), () => new Fruit(), () => new Fruit(), () => new Fruit(), () => new Fruit(), () => new RottenFruit(), () => new RottenFruit(), () => new HolyFruit())();
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
    Movement.counterForUpdate = 0;
    Movement.IsRun = false;
    Game.Movement = Movement;
    class Scene {
        static Open() {
            Scene.Scene.classList.remove("stop");
        }
        static Close() {
            Scene.Scene.classList.add("stop");
        }
        static UpdatePlayerScale() {
            Scene.PlayerScale = Scene.Player.getBoundingClientRect();
        }
        static UpdateFloorScale() {
            Scene.FloorScale = Scene.Floor.getBoundingClientRect();
        }
        static CureHp(id) {
            Scene.ListHeart[--id].classList.remove("injure");
        }
        static InjureHp(id) {
            Scene.ListHeart[--id].classList.add("injure");
        }
        static RestoreHp() {
            for (let heart of Scene.ListHeart) {
                heart.classList.remove("injure");
            }
        }
    }
    Scene.ContainerOfObject = document.getElementById("ceil");
    Scene.Player = document.getElementById("basket");
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
                Player.SetDeath();
            }
            else if (value >= Scene.ListHeart.length) {
                this._Hp = Scene.ListHeart.length;
            }
            else {
                this._Hp = value;
            }
        }
        static SetDeath() {
            Movement.Stop();
            Program.replayMenu.Open();
            Program.replayMenu.UpdateTime(Program.timer.Time);
            Program.replayMenu.UpdateScore(Program.player.Score.toString());
            Program.MainUser.record = Program.player.Score;
            Program.mainMenu.UpdateRecord(Program.MainUser.record.toString());
            Game.Scene.Close();
            Program.sound_GameOver.Play();
        }
        get Score() {
            return this._Score;
        }
        set Score(value) {
            this._Score = value;
        }
        constructor(playgroundName, elementName) {
            this._Hp = Scene.ListHeart.length;
            this._Score = 0;
            this.playground = document.querySelector(playgroundName);
            this.element = document.querySelector(elementName);
        }
        TakeCoint() {
            this.Score++;
        }
        TakeHp() {
            ++this.Hp;
            Scene.CureHp(this.Hp);
        }
        TakeDamage() {
            Scene.InjureHp(this.Hp);
            --this.Hp;
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
    }
    Game.Player = Player;
    class Object {
        constructor(...values) {
            this.Route = 0;
            this.speedFall = 1;
            this.speedRotate = 0;
            this.rotateDeg = 0;
            this.element = document.createElement("div");
            this.element.className = (Program.Random(...values));
            this.element.style.left = `${Program.RandomBetween(1, 95)}%`;
            this.speedRotate = Program.RandomBetween(-10, 10);
            Scene.ContainerOfObject.insertAdjacentElement("afterbegin", this.element);
            Object.ListOfObjects.add(this);
        }
        Update() {
            this.rotateDeg += this.speedRotate;
            this.element.style.rotate = `${this.rotateDeg}deg`;
            this.Route += this.speedFall;
            this.element.style.top = `${this.Route}%`;
        }
        Remove() {
            this.element.remove();
        }
        static ClearObjects() {
            Scene.ContainerOfObject.innerHTML = "";
            Object.ListOfObjects.clear();
        }
    }
    Object.ListOfObjects = new Set();
    Game.Object = Object;
    class Fruit extends Object {
        constructor() {
            super('fruit1', 'fruit2', 'fruit3', 'fruit4', 'fruit5', 'fruit6', 'fruit7', 'fruit8', 'fruit9', 'fruit10');
        }
        Take() {
            Program.player.TakeCoint();
            Program.sound_Coint.Play();
        }
        Miss() {
            Program.player.TakeDamage();
            Program.sound_Death.Play();
        }
    }
    class RottenFruit extends Object {
        constructor() {
            super('fruit1 rotten', 'fruit2 rotten', 'fruit3 rotten', 'fruit4 rotten', 'fruit5 rotten', 'fruit6 rotten', 'fruit7 rotten', 'fruit8 rotten', 'fruit9 rotten', 'fruit10 rotten');
        }
        Take() {
            Program.player.TakeDamage();
            Program.sound_Death.Play();
        }
        Miss() {
            Program.sound_Death.Play();
        }
    }
    class HolyFruit extends Object {
        constructor() {
            super('fruit1 holy', 'fruit2 holy', 'fruit3 holy', 'fruit4 holy', 'fruit5 holy', 'fruit6 holy', 'fruit7 holy', 'fruit8 holy', 'fruit9 holy', 'fruit10 holy');
        }
        Take() {
            Program.player.TakeHp();
            Program.sound_Health.Play();
        }
        Miss() {
            Program.sound_Death.Play();
        }
    }
})(Game || (Game = {}));
//# sourceMappingURL=Game.js.map