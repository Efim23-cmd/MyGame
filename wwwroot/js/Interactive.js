export default class Interactive {
    static Start() {
        Interactive.LoadPage();
    }
    static LoadPage() {
        let loadPage = document.getElementById("loadPage");
        document.addEventListener("DOMContentLoaded", () => {
            loadPage.classList.add("inactive");
        });
    }
}
