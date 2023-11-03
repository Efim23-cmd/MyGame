
export default class Interactive {

    public static Start() {
        Interactive.LoadPage();
    }

    private static LoadPage() {
        let loadPage = document.getElementById("loadPage");
        document.addEventListener("DOMContentLoaded", () => {
            loadPage?.classList.add("inactive");
        });
    }
}