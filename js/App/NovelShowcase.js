import AppManager from "./AppManager.js";
import pageMgr from "../PageManager.js";
import dataMgr from "../DataManager.js";
import NovelManager from "../NovelManager.js";
import stateMgr from "../StateManager.js";

class NovelShowcase extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
		pageMgr.SetCurrent("novel");
        pageMgr.FixPage();
		
        let ul = this._mgrPage.querySelector(".novel-list");
        ul.innerHTML = "";
        
        let data = dataMgr.GetData("novel");
        let ui8 = new Uint8Array(data);
        let db = new stateMgr._sql.Database(ui8);

        let novels = [];

        const searchNovel = "SELECT name, author, description FROM novel";
        let stmt = db.prepare(searchNovel);
        while(stmt.step()) {
            let arr = stmt.get();
            let novel = {};
            novel.name = arr[0];
            novel.author = arr[1];
            novel.des = arr[2];
            novels.push(novel);
        }

        for(let i=0; i < novels.length; i++) {
            let li = document.createElement("li");
            let title = document.createElement("h2");
            title.innerHTML = novels[i].name;
            let author = document.createElement("h3");
            author.innerHTML = novels[i].author;
            let des = document.createElement("div");
            des.innerHTML = novels[i].des;
            li.appendChild(title);
            li.appendChild(author);
            li.appendChild(des);
            ul.appendChild(li);
        }
    }
}

let novelShowcase = new NovelShowcase(pageMgr.GetPage("novelShowcase"));

export default novelShowcase;