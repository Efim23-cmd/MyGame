import Events from "./Events.js";
import Sound from "./Sound.js";
import User from "./User.js";
import { Game } from "./Game.js";
import { MainMenu, EnterMenu, LeaderMenu, PlayMenu, ReplayMenu } from "./Menu.js";


export default class Program
{
    /*Common*/
    public static MainUser = new User();
    public static sound_Click = new Sound("./css/Data/Music/click.mp3");
    public static sound_Main = new Sound("./css/Data/Music/pixel.mp3", 0.2, true);
    public static sound_Fall = new Sound("./css/Data/Music/fall.mp3");
    public static sound_Death = new Sound("./css/Data/Music/death.mp3");
    public static sound_GameOver = new Sound("./css/Data/Music/gameover.mp3");
    public static blockMessage = document.getElementById("blockMessage");
    public static btns = Array.from(document.querySelectorAll(".btn"));
    public static timer = new Game.Timer("#scene_timer")
    public static player = new Game.Player("#scene", "#basket");

    /*Main Menu*/
    public static mainMenu = new MainMenu("mainMenu", "main_btn_start", "main_btn_leader", "main_achievements_user", "main_achievements_record");

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

