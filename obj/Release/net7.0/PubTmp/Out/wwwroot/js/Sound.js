class Sound {
    constructor(path, volume = 1, isLoop = false) {
        this.audio = new Audio(path);
        this.audio.loop = isLoop;
        this.audio.volume = volume;
        this.SetEvents();
        Sound.ListOfSound.add(this);
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
    static ClearAll() {
        for (let sound of Sound.ListOfSound) {
            sound.Clear();
        }
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
Sound.ListOfSound = new Set();
export default Sound;
//# sourceMappingURL=Sound.js.map