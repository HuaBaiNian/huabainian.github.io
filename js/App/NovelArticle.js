/*
 * @Description: 
 */
import AppManager from "./AppManager.js";
import pageMgr from "../PageManager.js";
import dataMgr from "../DataManager.js";
import stateMgr from "../StateManager.js";

class NovelArticle extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
        pageMgr.SetCurrent("novel");
        pageMgr.FixPage();

        let viewer = this._mgrPage.querySelector(".novel-viewer");
        viewer.innerHTML = "";

        let hash = decodeURI(window.location.hash);
        let temp = hash.split("article/")[1]; // 危险操作
        let t = temp.split("/");
        if(t.length == 1) {
            window.location.hash = hash + "/1"; // 为了浏览器能正确后退，该代码已作废。
            return; // 重要
        }
        let novelName = t[0];
        let chapterIx = t[1];
		
		stateMgr._currentNovelName = novelName;
		stateMgr._currentNovelPage = parseInt(chapterIx);

        let nl = dataMgr.GetData("novel");
		let nl_temp = await nl;
		let ui8 = new Uint8Array(nl_temp);
		let db = new stateMgr._sql.Database(ui8);

        const getChapter = "SELECT name, content FROM chapter\
            WHERE novelid = (SELECT id FROM novel WHERE name = :nname) AND chapterix = :ix";
        let stmt = db.prepare(getChapter);
        stmt.bind({
            ":nname": novelName,
            ":ix": chapterIx
        });
        let arr;
        while(stmt.step()) {
            arr = stmt.get();
        }
        
        let title = document.createElement("h2");
        title.innerHTML = arr[0];
        title.classList.add("novel-title")
        let content = document.createElement("div");
        let contentArr = arr[1].split("\r\n");
        if(contentArr.length == 1) {
            contentArr = arr[1].split("\n");
        }

        for(let c of contentArr) {
            let p = document.createElement("p");
            p.innerHTML = c;
            content.appendChild(p);
        }

        viewer.appendChild(title);
        viewer.appendChild(content);

        
    }
}

let novelArticle = new NovelArticle(pageMgr.GetPage("novelArticle"));

export default novelArticle;