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
		let previousBtn = blogShowcase.querySelectorAll("button").item(0); //item是方法，用圆括号。危险写法，下标可能越界。
		let nextBtn = blogShowcase.querySelectorAll("button").item(1);
		
		// 此处会重复添加事件监听，可以想个办法放出去。
		previousBtn.addEventListener("click", () => {
			let curPageNum = parseInt(blogShowcase.dataset.pageNum);
			if((curPageNum - 1) > 0) {
				window.location.hash = "#/blog/page/" + (curPageNum - 1);
			}
		});
		
		nextBtn.addEventListener("click", () => {
			let curPageNum = parseInt(blogShowcase.dataset.pageNum);
			if((curPageNum + 1) <= this._stateMgr._blogPageNum) {
				window.location.hash = "#/blog/page/" + (curPageNum + 1);
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