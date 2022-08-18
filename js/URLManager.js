import NovelManager from "./NovelManager.js";
import pageMgr from "./PageManager.js";
import home from "./App/Home.js";
import blogShowcase from "./App/BlogShowcase.js";
import blogArticle from "./App/BlogAritcle.js";
import novelShowcase from "./App/NovelShowcase.js";
import novelArticle from "./App/NovelArticle.js";
import musicShowcase from "./App/MusicShowcase.js";
import tools from "./App/Tools.js";
import thanks from "./App/Thanks.js";

class URLManager {
	_viewer;
	_urls = [];
	
	constructor(viewer) {
		this._viewer = viewer;
	}
	
	Init() {
		this.SetURL(/^$/, pageMgr.GetPage("home"), home.Render.bind(home));
		this.SetURL(/^#\/blog\/page\/\d+$/, pageMgr.GetPage("blogShowcase"), blogShowcase.Render.bind(blogShowcase));
		this.SetURL(/^#\/blog\/article\/\d$/, pageMgr.GetPage("blogArticle"), blogArticle.Render.bind(blogArticle));
		this.SetURL(/^#\/novel\/page/, pageMgr.GetPage("novelShowcase"), novelShowcase.Render.bind(novelShowcase));
		this.SetURL(/^#\/novel\/article/, pageMgr.GetPage("novelArticle"), novelArticle.Render.bind(novelArticle));
		this.SetURL(/^#\/music$/, pageMgr.GetPage("musicShowcase"), musicShowcase.Render.bind(musicShowcase));
		this.SetURL(/^#\/tools$/, pageMgr.GetPage("tools"), tools.Render.bind(tools));
		this.SetURL(/^#\/thanks$/, pageMgr.GetPage("thanks"), thanks.Render.bind(thanks));
	}
	
	SetURL(url, page, asyncfuc) {
		let obj = {"url": url, "page": page, "asyncfuc": asyncfuc};
		this._urls.push(obj);
	}
	
	async OnURLChange() {
		for(let item of this._urls) {
			if(item["url"].test(window.location.hash)) {
				await (item["asyncfuc"])();
				pageMgr.RemoveSonPage(this._viewer);
				pageMgr.AddPage(this._viewer, item["page"]);
				pageMgr.GetPage(".h-content").scrollTop = 0;
			}
		}
	}
	
	async Listen() {
		if(window.location.hash == "") {
			window.location.replace("#");
		}
		await this.OnURLChange();
		window.addEventListener("hashchange", () => this.OnURLChange()); // 箭头函数，防止 this 错误
	}

	async OnMusic() {
		pageMgr.SetCurrent("music");
	}
	
	async OnThanks() {
		pageMgr.SetCurrent("thanks");
	}
}

let urlMgr = new URLManager(pageMgr.GetPage(".h-viewer"));

export default urlMgr;