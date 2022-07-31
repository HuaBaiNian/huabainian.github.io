import pageMgr from "../PageManager.js";
import AppManager from "./AppManager.js";

class MuiscShowcase extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
        pageMgr.SetCurrent("music");
        pageMgr.FixPage();
    }
}

let musicShowcase = new MuiscShowcase(pageMgr.GetPage("musicShowcase"));

export default musicShowcase;