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
class User {
    constructor() {
        this.id = null;
        this.IsNewUser = true;
        this._username = null;
        this._record = 0;
        let name = localStorage.getItem("userName");
        if (name != undefined && name != "") {
            this.userName = name;
        }
        let record = localStorage.getItem("record");
        if (record != undefined && record != "") {
            this.record = parseInt(record);
        }
    }
    static AbortRequest() {
        var _a;
        (_a = User.abortedController) === null || _a === void 0 ? void 0 : _a.abort();
        User.abortedController = new AbortController();
    }
    set userName(username) {
        this._username = username;
    }
    get userName() {
        return this._username;
    }
    set record(Result) {
        if (this._record < Result) {
            this._record = Result;
            this.UpdateUserAtServer();
        }
    }
    get record() {
        return this._record;
    }
    CheckUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userName != null && this.userName != "") {
                let formData = new FormData();
                formData.append("userName", this.userName);
                formData.append("record", this._record.toString());
                let myFetch = yield fetch("/CheckUser", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: formData
                });
                let response = yield myFetch.json();
                if (myFetch.ok) {
                    Program.Message("User is valide!");
                    this.Sync(response);
                    return true;
                }
                Program.Message(response);
            }
            return false;
        });
    }
    SaveUserAtServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userName != null && this.userName != "") {
                let formData = new FormData();
                formData.append("userName", this.userName);
                formData.append("record", this._record.toString());
                let myFetch = yield fetch("/SaveUser", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json"
                    },
                    body: formData,
                    signal: User.abortedController.signal,
                    keepalive: true
                });
                let response = yield myFetch.json();
                if (myFetch.ok) {
                    Program.Message("Save user!");
                    this.Sync(response);
                    return true;
                }
                else {
                    Program.Message(response);
                    return false;
                }
            }
        });
    }
    UpdateUserAtServer() {
        return __awaiter(this, void 0, void 0, function* () {
            let formData = new FormData();
            formData.append("userName", this.userName);
            formData.append("record", this._record.toString());
            let myFetch = yield fetch("/UpdateUser", {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData,
                signal: User.abortedController.signal,
                keepalive: true
            });
            let response = yield myFetch.json();
            if (myFetch.ok) {
                Program.Message("Update user!");
                this.Sync(response);
                return true;
            }
            else {
                Program.Message(response);
                return false;
            }
        });
    }
    Sync(user) {
        var _a;
        localStorage.setItem("userName", user.userName);
        this.userName = user.userName;
        localStorage.setItem("record", (_a = user.record) === null || _a === void 0 ? void 0 : _a.toString());
        this.record = user.record;
        Program.Message(`Synchronization user(id: ${user.id})!`);
    }
}
User.abortedController = new AbortController();
export default User;
//# sourceMappingURL=User.js.map