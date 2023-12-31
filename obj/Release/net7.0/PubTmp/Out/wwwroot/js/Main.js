import Events from "./Events.js";
import Sound from "./Sound.js";
import User from "./User.js";
import { Game } from "./Game.js";
import { MainMenu, EnterMenu, LeaderMenu, PlayMenu, ReplayMenu, VisualizerMenu } from "./Menu.js";
class Program {
    static Message(message = "Error") {
        let error = document.createElement("div");
        error.textContent = message;
        Program.blockMessage.appendChild(error);
        setTimeout(() => {
            Program.blockMessage.removeChild(error);
        }, 3000);
    }
    static Random(...values) {
        let step = 1 / values.length;
        let varRandom = Math.random();
        for (let index = 0; index < values.length; index++) {
            if (index * step <= varRandom && (index + 1) * step > varRandom) {
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
    static Main() {
        try {
            Events.SetEvents();
        }
        catch (error) {
            Program.Message(error);
        }
    }
}
/*Common*/
Program.MainUser = new User();
Program.sound_Click = new Sound("./Data/Music/click.mp3", 0.5);
Program.sound_Main = new Sound("", 0.2, true);
Program.sound_Coint = new Sound("./Data/Music/fall.mp3", 0.2);
Program.sound_Death = new Sound("./Data/Music/death.mp3", 0.5);
Program.sound_Health = new Sound("./Data/Music/health.mp3", 0.3);
Program.sound_GameOver = new Sound("./Data/Music/gameover.mp3", 0.2);
Program.blockMessage = document.getElementById("blockMessage");
Program.btns = Array.from(document.querySelectorAll(".btn"));
Program.timer = new Game.Timer("#scene_timer");
Program.player = new Game.Player("#scene", "#basket");
/*Main Menu*/
Program.mainMenu = new MainMenu("mainMenu", "main_btn_start", "main_btn_leader", "main_achievements_user", "main_achievements_record");
/*VisualizerMenu*/
Program.visualizerMenu = new VisualizerMenu("visualizerMenu", "visualizer_btn_start", "visualizer_music");
/*Enter Menu*/
Program.enterMenu = new EnterMenu("enterMenu", "enter_input_name", "enter_btn_start", "enter_btn_leader");
/*Leader Menu*/
Program.leaderMenu = new LeaderMenu("leaderMenu", "leader_input_search", "leader_btn_back", "leader_listUser", "leader_loadBlockSearch");
/*Replay Menu*/
Program.replayMenu = new ReplayMenu("replayMenu", "replay_btn_replay", "replay_btn_back", "replay_result_win", "replay_result_time", "replay_result_score");
/*Play Menu*/
Program.playMenu = new PlayMenu("playMenu", "play_btn_continue", "play_btn_back", "play_result_time", "play_result_score");
/*Scene*/
Program.scene_btn_stop = document.getElementById("scene_btn_stop");
export default Program;
Program.Main();
//# sourceMappingURL=Main.js.map