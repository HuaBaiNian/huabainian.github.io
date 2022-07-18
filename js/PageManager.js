export default class PageManager {
	_pages = {};
	_currentPageName = "home";
	
	/*********************
	/*
	/* 类 PageManager 与 index.html 紧密相连，对页面元素进行隐藏、缓存和显示。
	/*
	*********************/
	Init() {
		let hiddenPages = this.GetPage(".h-pages");
		
		let homePage = this.GetPage(".h-home-page");
		let wcPage = this.GetPage(".welcome-text");
		
		let blogPage = this.GetPage(".h-blog-list-page");
		let blogList = this.GetPage(".blog-list");
		
		let articlePage = this.GetPage(".h-blog-article-page");
		let mdPage = this.GetPage(".markdown-body");

		let novelPage = this.GetPage(".h-novel-page");
		
		let musicPage = this.GetPage(".h-music-page");
		
		let thanksPage = this.GetPage(".h-thanks-page");
		
		this.SetPage("hidden", hiddenPages);
		this.SetPage("home", homePage);
		this.SetPage("wc", wcPage);
		this.SetPage("blog", blogPage);
		this.SetPage("blogList", blogList);
		this.SetPage("article", articlePage);
		this.SetPage("md", mdPage);
		this.SetPage("novel", novelPage);
		this.SetPage("music", musicPage);
		this.SetPage("thanks", thanksPage);
		
		// remove 移除后的元素仍然存在，可以后续添加。只是不存在于文档树中，所以无法查询到，故要先行缓存，保留引用。
		// 由于父元素会维持文档结构，所以不必缓存子元素，可以通过 父元素.querySelector 查询得到。
		// 该方法主要用于页面大段元素隐藏，可能有人对该方法有顾虑，那么我想可以通过元素拷贝的方法实现隐藏效果。
		hiddenPages.remove();
	}
	
	FixPage() {
		switch(this.GetCurrent()) {
		case "home": {
			this.GetPage(".home-item").classList.add("h-nav-item-active");
			break;
		}
		case "blog": {
			this.GetPage(".blog-item").classList.add("h-nav-item-active");
			break;
		}
		case "novel": {
			this.GetPage(".novel-item").classList.add("h-nav-item-active");
			break;
		}
		case "music": {
			this.GetPage(".music-item").classList.add("h-nav-item-active");
			break;
		}
	}
	}
	
	SetCurrent(str) {
		this._currentPageName = str;
	}
	
	GetCurrent() {
		return this._currentPageName;
	}
	
	SetPage(pageName, pageEle) {
		this._pages[pageName] = pageEle; // 为避免出错，js对象取值、赋值用中括号方式，不要用点方式。
	}
	
	GetPage(pageName) {
		if(this._pages[pageName]) {
			return this._pages[pageName];
		} else {
			let ele = document.querySelector(pageName);
			if(ele) {
				return ele;
			} else {
				console.log("Error: Can not find the element by \""  + pageName + "\"." );
			}
		}
	}
	
	GetPages(str) {
		return document.querySelectorAll(str);
	}
	
	AddPage(parEle, sonEle) {
		parEle.appendChild(sonEle);
	}
	
	RemoveSonPage(parEle) {
		if(parEle.firstChild) {
			parEle.removeChild(parEle.firstChild);
		}
	}
}