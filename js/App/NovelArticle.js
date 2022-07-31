/*
 * @Description: 
 */
import AppManager from "./AppManager.js";
import pageMgr from "../PageManager.js";

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
        
        let title = document.createElement("h2");
        title.innerHTML = "这是title";
        title.classList.add("novel-title")
        let content = document.createElement("div");
        content.innerHTML = "这是内容ssdldf都市里的家乐福的打底裤收到了的塑料袋六十这是内容ssdldf都市里的家乐福的打底裤收到了的塑料袋六十这是内容ssdldf都市里的家乐福的打底裤收到了的塑料袋六十";
        viewer.appendChild(title);
        viewer.appendChild(content);
    }
}

let novelArticle = new NovelArticle(pageMgr.GetPage("novelArticle"));

export default novelArticle;