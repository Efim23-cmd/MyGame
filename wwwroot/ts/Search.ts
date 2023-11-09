import Program from "./Main.js";
import User from "./User.js";

export default class Search {
    private static abortedController = new AbortController();

    public static AbortRequest() {
        Search.abortedController?.abort();
        Search.abortedController = new AbortController();
    }

    public static async GetListTopTen() {
        try {
            let myFetch = await fetch("/GetListTopTen", {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                }
            });
            let response = await myFetch.json();
            if (myFetch.ok) {
                localStorage.setItem("topTen", JSON.stringify(response))
                return true;
            }
            else {
                Program.Message(response);
                return false;
            }
        }
        catch {
            return false;
        }
    }

    public static async GetListOnRequest(input: string) {
        let formData = new FormData();
        formData.append("input", input.toString());
        try {
            Program.leaderMenu.AddLoadBlock();
            let myFetch = await fetch("/GetListOnRequest", {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData,
                signal: Search.abortedController.signal
            });
            let response = await myFetch.json();
            if (myFetch.ok) {
                Program.leaderMenu.RemoveLoadBlock();
                Program.leaderMenu.SetEntries(Search.Search(input, response));
                return true;
            }
            else {
                Program.leaderMenu.RemoveLoadBlock();
                Program.leaderMenu.RemoveAllFromList();
                Program.Message(response);
                return false;
            }
        }
        catch {
            return false;
        }
    }

    private static Search(input: string, users: User[]) {
        let inputText = input.trim().split(" ");
        let entryText: string;

        for (let user of users) {
            entryText = user.userName.trim();
            for (let inputWord of inputText) {
                if (entryText.indexOf(inputWord) >= 0) {
                    entryText = entryText.replaceAll(inputWord, `┌${inputWord}┘`);
                }
            }
            user.userName = Search.ReplaceAllStick(entryText);
        }
        return users; 
    }
    
    private static ReplaceAllStick(entry: string): string {
        return entry.replaceAll("┌", "<span>").replaceAll("┘", "</span>");
    }
}