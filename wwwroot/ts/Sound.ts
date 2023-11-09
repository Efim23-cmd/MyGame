
export default class Sound{

    public static IsRun: boolean;
    private audio: HTMLAudioElement;

    public constructor(path: string, volume: number = 1, isLoop: boolean = false) {
        this.audio = new Audio(path);
        this.audio.loop = isLoop;
        this.audio.volume = volume;
        this.SetEvents();
    }

    public Play(): void {
        this.audio.play();
    }

    public Clear() {
        this.audio.currentTime = 0;
        this.audio.pause();
    }

    public Pause(): void {
        this.audio.pause();
    }

    private SetEvents() {
        this.audio.addEventListener("playing", () => {
            Sound.IsRun = true;
        });
        this.audio.addEventListener("ended", () => {
            Sound.IsRun = false;
        });
    }
}
    