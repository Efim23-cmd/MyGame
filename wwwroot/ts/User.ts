import Program from "./Main.js";

export default class User {
    public  id: string = null;
    public IsNewUser: boolean = true;

    private _username: string = null;
    private _record: number = 0;

    private static abortedController = new AbortController();

    constructor() {
        let name = localStorage.getItem("userName");
        if (name != undefined && name != "") {
            this.userName = name;
        }

        let record = localStorage.getItem("record");

        if (record != undefined && record != "") {
            this.record = parseInt(record);
        }
    }

    public static AbortRequest() {
        User.abortedController?.abort();
        User.abortedController = new AbortController();
    }

    public set userName(username: string) {
        this._username = username;
    }

    public get userName() {
        return this._username;
    }

    public set record(Result: number) {
        if (this._record < Result) {
            this._record = Result;
            this.UpdateUserAtServer();
        }
    }

    public get record() {
        return this._record;
    }

    public async CheckUser() {
        if (this.userName != null && this.userName != "") {
            let formData = new FormData();
            formData.append("userName", this.userName);
            formData.append("record", this._record.toString());
            let myFetch = await fetch("/CheckUser", {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData
            });
            let response = await myFetch.json();
            if (myFetch.ok) {
                Program.Message("User is valide!");
                this.Sync(response);
                return true;
            }
            Program.Message(response);
        }
        return false;
    }

    public async SaveUserAtServer() {
        if (this.userName != null && this.userName != "") {
            let formData = new FormData();
            formData.append("userName", this.userName);
            formData.append("record", this._record.toString());
            let myFetch = await fetch("/SaveUser", {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: formData,
                signal: User.abortedController.signal,
                keepalive: true
            });
            let response = await myFetch.json();
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
    }

    public async UpdateUserAtServer() {
        let formData = new FormData();
        formData.append("userName", this.userName);
        formData.append("record", this._record.toString());
        let myFetch = await fetch("/UpdateUser", {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: formData,
            signal: User.abortedController.signal,
            keepalive: true
        });
        let response = await myFetch.json();
        if (myFetch.ok) {
            Program.Message("Update user!");
            this.Sync(response);
            return true;
        }
        else {
            Program.Message(response);
            return false;
        }
    }

    private Sync(user: User) {
        localStorage.setItem("userName", user.userName);
        this.userName = user.userName;
        localStorage.setItem("record", user.record?.toString());
        this.record = user.record;
        Program.Message(`Synchronization user(id: ${user.id})!`);
    }
}

   