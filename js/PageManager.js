class PageManager {
	_pages = {};
	_currentPage = "home"; // 标志当前页面类型，比如 blogShowcase 和 blogArticle 都属于 blog。
	
	/*********************
	/*
	/* 类 PageManager 与 index.html 紧密相连，对页面元素进行隐藏、缓存和显示。
	/*
	*********************/
	Init() {
		let hiddenPages = this.GetPage(".h-pages");
		
		let homePage = this.GetPage(".h-home-page");
		
		let blogShowcasePage = this.GetPage(".h-blog-showcase-page");
		
		let blogArticlePage = this.GetPage(".h-blog-article-page");

		let novelShowcasePage = this.GetPage(".h-novel-showcase-page");

		let novelArticlePage = this.GetPage(".h-novel-article-page");
		
		let musicShowcasePage = this.GetPage(".h-music-showcase-page");

		let toolsPage = this.GetPage(".h-tools-page");
		
		let thanksPage = this.GetPage(".h-thanks-page");
		
		this.SetPage("hidden", hiddenPages);
		this.SetPage("home", homePage);
		this.SetPage("blogShowcase", blogShowcasePage);
		this.SetPage("blogArticle", blogArticlePage);
		this.SetPage("novelShowcase", novelShowcasePage);
		this.SetPage("novelArticle", novelArticlePage);
		this.SetPage("musicShowcase", musicShowcasePage);
		this.SetPage("tools", toolsPage);
		this.SetPage("thanks", thanksPage);
		
		// remove 移除后的元素仍然存在，可以后续添加。只是不存在于文档树中，所以无法查询到，故要先行缓存，保留引用。
		// 由于父元素会维持文档结构，所以不必缓存子元素，可以通过 父元素.querySelector 查询得到。
		// 该方法主要用于页面大段元素隐藏，可能有人对该方法有顾虑，那么我想可以通过元素拷贝的方法实现隐藏效果。
		hiddenPages.remove();
		console.log(hiddenPages);
		console.log(123);
	}
	
	FixPage() {
		for(let el of this.GetPages(".h-nav-item")) {
			el.classList.remove("h-nav-item-active");
		}

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
		case "tools": {
			this.GetPage(".tools-item").classList.add("h-nav-item-active");
			break;
		}
		case "thanks": {
			this.GetPage(".thanks-item").classList.add("h-nav-item-active");
			break;
		}
	}
	}
	
	SetCurrent(pageName) {
		this._currentPage = pageName;
	}
	
	GetCurrent() {
		return this._currentPage;
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
	
	GetPages(pageName) {
		return document.querySelectorAll(pageName);
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

let pageMgr = new PageManager();
pageMgr.Init();

export default pageMgr;