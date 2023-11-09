export default class Sound {
    constructor(path, volume = 1, isLoop = false) {
        this.audio = new Audio(path);
        this.audio.loop = isLoop;
        this.audio.volume = volume;
        this.SetEvents();
    }
    Play() {
        this.audio.play();
    }
    Clear() {
        this.audio.currentTime = 0;
        this.audio.pause();
    }
    Pause() {
        this.audio.pause();
    }
    SetEvents() {
        this.audio.addEventListener("playing", () => {
            Sound.IsRun = true;
        });
        this.audio.addEventListener("ended", () => {
            Sound.IsRun = false;
        });
    }
}
//# sourceMappingURL=Sound.js.map