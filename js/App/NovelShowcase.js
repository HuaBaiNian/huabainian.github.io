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
        
        let nl = dataMgr.GetData("novel");
		let nl_temp = await nl;
		let ui8 = new Uint8Array(nl_temp);
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
			li.classList.add("novel-item");
            let title = document.createElement("h3");
            let a = document.createElement("a");
            a.innerHTML = novels[i].name;
            a.href = `#/novel/article/${novels[i].name}/1`;
            title.appendChild(a);
            let author = document.createElement("h3");
            author.innerHTML = novels[i].author;
            let des = document.createElement("div");
			des.classList.add("novel-desc");
			
			let contentArr = novels[i].des.split("\r\n");
			if(contentArr.length == 1) {
				contentArr = novels[i].des.split("\n");
			}

			for(let c of contentArr) {
				let p = document.createElement("p");
				p.innerHTML = c;
				des.appendChild(p);
			}
			
            //des.innerHTML = novels[i].des;
            li.appendChild(title);
            li.appendChild(author);
            li.appendChild(des);
            ul.appendChild(li);
        }
    }
}

let novelShowcase = new NovelShowcase(pageMgr.GetPage("novelShowcase"));

export default novelShowcase;