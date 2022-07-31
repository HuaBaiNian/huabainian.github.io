import AppManager from "./AppManager.js";
import pageMgr from "../PageManager.js";

class Thanks extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
        pageMgr.SetCurrent("thanks");
        pageMgr.FixPage();
    }
}

let thanks = new Thanks(pageMgr.GetPage("thanks"));

export default thanks;