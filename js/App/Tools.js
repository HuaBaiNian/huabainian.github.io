/*
 * @Description: 
 */
import AppManager from "./AppManager.js";
import pageMgr from "../PageManager.js";
import stateMgr from "../StateManager.js";
import { DetCharset, NovelParse } from "../UtilsManager.js";

class Tools extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
        pageMgr.SetCurrent("tools");
        pageMgr.FixPage();

        let upNovel = this._mgrPage.querySelector(".upnovel");
        let newDB = this._mgrPage.querySelector(".newdb");
        let updateDB = this._mgrPage.querySelector(".updatedb");
        let downDB = this._mgrPage.querySelector(".downdb");

        let novel = {};

        upNovel.addEventListener("change", async (e) => {
            let file = e.target.files[0];
            
            if(!file) {
                console.log("请选择文件");
                return ;
            }

            let data = await (new Response(file)).arrayBuffer();

            let ui8 = new Uint8Array(data);
            let charset = DetCharset(ui8);
            
            let textde = new TextDecoder(charset);
            let novelStr = textde.decode(ui8);
            
            let novel = NovelParse(novelStr);
            let author = file.name.split("《")[0];
            if(author) {
                novel.nov.author = author;
            } else {
                novel.nov.author = null;
            }
            let name = file.name.split("《")[1].split("》")[0];
            novel.nov.name = name;

            console.log(novel)

            let db;

            newDB.addEventListener("click", async () => {
                updateDB.setAttribute("disabled", "");
                db = await this.CreateDatabase();
                db = await this.UpdataDatabase(db, novel);
                alert("数据库已新建，请下载。");
                newDB.setAttribute("disabled", "");
                downDB.removeAttribute("disabled");
            });

            updateDB.addEventListener("click", async () => {
                let opt = {
                    types: [{
                        description: "dataset file",
                        accept: {"application/octet-stream": [".db3"]}
                    }]
                }

                newDB.setAttribute("disabled", "");

                let [fileHandle] = await window.showOpenFilePicker(opt);
                const file = await fileHandle.getFile();
                let fileBuffer = await (new Response(file)).arrayBuffer();
                let ui8 = new Uint8Array(fileBuffer);
                db = new stateMgr._sql.Database(ui8);
                db = await this.UpdataDatabase(db, novel);
                alert("数据库已更新，请下载。");
                updateDB.setAttribute("disabled", "");
                downDB.removeAttribute("disabled");
            });

            downDB.addEventListener("click", async () => {
                let opt = {
                    suggestedName: "novel",
                    types: [{
                        description: "dataset file",
                        accept: {"application/octet-stream": [".db3"]}
                    }]
                };

                let saveHandle = await window.showSaveFilePicker(opt);
                let writable = await saveHandle.createWritable();
                await writable.write(db.export());
                await writable.close();

                downDB.setAttribute("disabled", "");
            });

            newDB.removeAttribute("disabled");
            updateDB.removeAttribute("disabled");
        })

    }

    async CreateDatabase() {
        let db = new stateMgr._sql.Database();

        const createNovel = "CREATE TABLE novel(\
            id INTEGER PRIMARY KEY,\
            name TEXT,\
            author TEXT,\
            description TEXT\
        )";

        const createVolume = "CREATE TABLE volume(\
            id INTEGER PRIMARY KEY,\
            novelid INTEGER,\
            volumeix INTEGER,\
            name TEXT,\
            description TEXT,\
            FOREIGN KEY(novelid) REFERENCES novel(id)\
        )";

        const createChapter = "CREATE TABLE chapter(\
            id INTEGER PRIMARY KEY,\
            novelid INTEGER,\
            volumeid INTEGER,\
            chapterix INTEGER,\
            name TEXT,\
            content TEXT,\
            FOREIGN KEY(novelid) REFERENCES novel(id),\
            FOREIGN KEY(volumeid) REFERENCES volume(id)\
        )";

        db.run(createNovel);
        db.run(createVolume);
        db.run(createChapter);

        return db
    }
        
    async UpdataDatabase(db, novel) {

        const insertNovel = "INSERT INTO novel VALUES(\
            null, :name, :author, :des\
        )";

        const insertVolume = "INSERT INTO volume VALUES(\
            null, (SELECT id FROM novel WHERE novel.name = :novelname),\
            :volumeix, :volumename, :des\
        )";

        const insertChapter = "INSERT INTO chapter VALUES(\
            null, (SELECT id FROM novel WHERE novel.name = :novelname),\
            (SELECT id FROM volume WHERE volume.name = :volumename),\
            :chapterix, :name, :content\
        )";

        let stmt1 = db.prepare(insertNovel);
        let stmt2 = db.prepare(insertVolume);
        let stmt3 = db.prepare(insertChapter);



        stmt1.bind({
            ":name": novel.nov.name,
            ":author": novel.nov.author,
            ":des": novel.nov.description
        });
        stmt1.step();
        stmt1.reset();

        if(novel.vol != []) {
            for(let v of novel.vol) {
                stmt2.bind({
                    ":novelname": novel.nov.name,
                    ":volumeix": v.volId,
                    ":volumename": v.name,
                    ":des": v.description
                });
                stmt2.step();
                stmt2.reset();
            }
        }

        for(let c of novel.chapt) {
            stmt3.bind({
                ":novelname": novel.nov.name,
                ":volumename": c.volname,
                ":chapterix": c.chaptId,
                ":name": c.name,
                ":content": c.content
            });
            stmt3.step();
            stmt3.reset();
        }

        return db;
    }
} 

let tools = new Tools(pageMgr.GetPage("tools"));

export default tools;