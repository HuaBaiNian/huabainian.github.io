import AppManager from "./AppManager.js"
import pageMgr from "../PageManager.js";
import dataMgr from "../DataManager.js";

class Home extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
        pageMgr.SetCurrent("home");
        pageMgr.FixPage();

        let welcome = this._mgrPage.querySelector(".welcome");
		let homeData = dataMgr.GetData("homeData");
		let ix = Math.floor(Math.random() * homeData.length);
		welcome.innerHTML = homeData[ix];
    }
}

let home = new Home(pageMgr.GetPage("home"));

export default home;
