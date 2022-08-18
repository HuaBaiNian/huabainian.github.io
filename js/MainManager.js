import pageMgr from "./PageManager.js";
import stateMgr from "./StateManager.js";

class MainManager {
	
	async Init() {
		/**
		 * 初始化sqljs
		 */	
		stateMgr._sql = await window.initSqlJs({
			locateFile: file => `./libs/sqljs/${file}`
		});

		/*
		/* 添加监听
		*/
		pageMgr.GetPage(".h-nav-switch").addEventListener("click", this.OnSwitchNavClick.bind(this));
		pageMgr.GetPage(".h-nav-logo").addEventListener("click", this.OnLogoClick);
		
		let blogShowcase = pageMgr.GetPage("blogShowcase");
		let preBlogPage = blogShowcase.querySelector(".pre-blog-page"); //item是方法，用圆括号。危险写法，下标可能越界。
		let nextBlogPage = blogShowcase.querySelector(".next-blog-page");
		
		preBlogPage.addEventListener("click", () => {
			let curBlogPage = stateMgr._currentBlogPage;
			if((curBlogPage - 1) > 0) {
				window.location.hash = "#/blog/page/" + (curBlogPage - 1);
			}
		});
		
		nextBlogPage.addEventListener("click", () => {
			let curBlogPage = stateMgr._currentBlogPage;
			if((curBlogPage + 1) <= stateMgr._totalBlogPage) {
				window.location.hash = "#/blog/page/" + (curBlogPage + 1);
			}
		});	
		
		let novelArticle = pageMgr.GetPage("novelArticle");
		let preNovelPage = novelArticle.querySelector(".pre-novel-page");
		let nextNovelPage = novelArticle.querySelector(".next-novel-page");
		

		
		preNovelPage.addEventListener("click", () => {
			let curNovelPage = stateMgr._currentNovelPage;
			if((curNovelPage - 1) > 0) {
				window.location.hash = "#/novel/article/" + stateMgr._currentNovelName + "/" + (curNovelPage - 1);
			}
		});
		
		nextNovelPage.addEventListener("click", () => {
			let curNovelPage = stateMgr._currentNovelPage;
			if((curNovelPage + 1)) {
				window.location.hash = "#/novel/article/" + stateMgr._currentNovelName + "/" + (curNovelPage + 1);
			}
		});	
	}
	
	
	OnSwitchNavClick() {
		pageMgr.GetPage(".h-navbar").classList.toggle("h-nav-hidden");
	}
	
	OnLogoClick() {
		window.location.href = "#"; // 跳转到当前 html 文件的 # 处。对于单页面应用，一般相当于回到主页。
	}
	
}

let mainMgr = new MainManager();

export default mainMgr;