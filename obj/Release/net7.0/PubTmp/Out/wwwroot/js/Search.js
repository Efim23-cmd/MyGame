var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Program from "./Main.js";
class Search {
    static AbortRequest() {
        var _a;
        (_a = Search.abortedController) === null || _a === void 0 ? void 0 : _a.abort();
        Search.abortedController = new AbortController();
    }
    static GetListTopTen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let myFetch = yield fetch("/GetListTopTen", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    }
                });
                let response = yield myFetch.json();
                if (myFetch.ok) {
                    localStorage.setItem("topTen", JSON.stringify(response));
                    return true;
                }
                else {
                    Program.Message(response);
                    return false;
                }
            }
            catch (_a) {
                return false;
            }
        });
    }
    static GetListOnRequest(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let formData = new FormData();
            formData.append("input", input.toString());
            try {
                Program.leaderMenu.AddLoadBlock();
                let myFetch = yield fetch("/GetListOnRequest", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: formData,
                    signal: Search.abortedController.signal
                });
                let response = yield myFetch.json();
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
            catch (_a) {
                return false;
            }
        });
    }
    static Search(input, users) {
        let inputText = input.trim().split(" ");
        let entryText;
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
    static ReplaceAllStick(entry) {
        return entry.replaceAll("┌", "<span>").replaceAll("┘", "</span>");
    }
}
Search.abortedController = new AbortController();
export default Search;
//# sourceMappingURL=Search.js.map