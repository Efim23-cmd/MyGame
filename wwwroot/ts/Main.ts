import Events from "./Events.js";
import Sound from "./Sound.js";
import User from "./User.js";
import { Game } from "./Game.js";
import { MainMenu, EnterMenu, LeaderMenu, PlayMenu, ReplayMenu, VisualizerMenu } from "./Menu.js";


export default class Program
{
    /*Common*/
    public static MainUser = new User();
    public static sound_Click = new Sound("./Data/Music/click.mp3", 0.5);
    public static sound_Main = new Sound("", 0.2, true);
    public static sound_Coint = new Sound("./Data/Music/fall.mp3", 0.2);
    public static sound_Death = new Sound("./Data/Music/death.mp3", 0.5);
    public static sound_Health = new Sound("./Data/Music/health.mp3", 0.3);
    public static sound_GameOver = new Sound("./Data/Music/gameover.mp3", 0.2);
    public static blockMessage = document.getElementById("blockMessage");
    public static btns = Array.from(document.querySelectorAll(".btn"));
    public static timer = new Game.Timer("#scene_timer")
    public static player = new Game.Player("#scene", "#basket");

    /*Main Menu*/
    public static mainMenu = new MainMenu("mainMenu", "main_btn_start", "main_btn_leader", "main_achievements_user", "main_achievements_record");

    /*VisualizerMenu*/
    public static visualizerMenu = new VisualizerMenu("visualizerMenu", "visualizer_btn_start", "visualizer_music");

    /*Enter Menu*/
    public static enterMenu = new EnterMenu("enterMenu", "enter_input_name", "enter_btn_start", "enter_btn_leader");

    /*Leader Menu*/
    public static leaderMenu = new LeaderMenu("leaderMenu", "leader_input_search", "leader_btn_back", "leader_listUser", "leader_loadBlockSearch");

    /*Replay Menu*/
    public static replayMenu = new ReplayMenu("replayMenu", "replay_btn_replay", "replay_btn_back", "replay_result_win", "replay_result_time", "replay_result_score");

    /*Play Menu*/
    public static playMenu = new PlayMenu("playMenu", "play_btn_continue", "play_btn_back", "play_result_time", "play_result_score");

    /*Scene*/
    public static scene_btn_stop = document.getElementById("scene_btn_stop");

    public static Message(message: string = "Error") {
        let error = document.createElement("div");
        error.textContent = message;
        Program.blockMessage.appendChild(error);
        setTimeout(() => {
            Program.blockMessage.removeChild(error);
        }, 3000);
    }

    public static Random(...values) {
        let step = 1 / values.length;
        let varRandom = Math.random();
        for (let index = 0; index < values.length; index++) {
            if (index * step <= varRandom && (index + 1) * step > varRandom) {
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

    public static Main(): void
    {
        try {
            Events.SetEvents();
        }
        catch (error) {
            Program.Message(error);
        }
    }
}
Program.Main();

