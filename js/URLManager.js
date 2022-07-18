import NovelManager from "./NovelManager.js";

export default class URLManager {
	_pageMgr;
	_dataMgr;
	_eveMgr;
	_viewer;
	_urls = [];
	
	constructor(stateMgr, pageMgr, dataMgr, eveMgr, viewer) {
		this._stateMgr = stateMgr;
		this._pageMgr = pageMgr;
		this._dataMgr = dataMgr;
		this._eveMgr = eveMgr;
		this._viewer = viewer;
	}
	
	Init() {
		this.SetURL(/^$/, this._pageMgr.GetPage("home"), this.OnHome.bind(this));
		this.SetURL(/^#\/blog\/page\/\d+$/, this._pageMgr.GetPage("blog"), this.OnBlog.bind(this));
		this.SetURL(/^#\/blog\/article\/\d$/, this._pageMgr.GetPage("article"), this.OnArticle.bind(this));
		this.SetURL(/^#\/novel$/, this._pageMgr.GetPage("novel"), this.OnNovel.bind(this));
		this.SetURL(/^#\/music$/, this._pageMgr.GetPage("music"), this.OnMusic.bind(this));
		this.SetURL(/^#\/thanks$/, this._pageMgr.GetPage("thanks"), this.OnThanks.bind(this));
	}
	
	SetURL(url, page, asyncfuc) {
		let obj = {"url": url, "page": page, "asyncfuc": asyncfuc};
		this._urls.push(obj);
	}
	
	OnURLChange() {
		for(let item of this._urls) {
			if(item["url"].test(window.location.hash)) {
				(item["asyncfuc"])()
					.then(() => {
						this._pageMgr.RemoveSonPage(this._viewer);
						this._pageMgr.AddPage(this._viewer, item["page"]);
						this._pageMgr.GetPage(".h-content").scrollTop = 0;
					});
			}
		}
	}
	
	Listen() {
		if(window.location.hash == "") {
			window.location.replace("#");
		}
		this.OnURLChange();
		window.addEventListener("hashchange", () => this.OnURLChange()); // 箭头函数，防止 this 错误
	}
	
	// 通过 async 声明为异步函数后，调用函数会返回 Promise，后续可以使用 then。
	async OnHome() {
		this._pageMgr.SetCurrent("home");
		let homeData = this._dataMgr.GetData("homeData");
		let ix = Math.floor(Math.random() * homeData.length);
		this._pageMgr.GetPage("wc").innerHTML = homeData[ix];
	}

	async OnBlog() {
		let hash = window.location.hash;
		
		this._pageMgr.SetCurrent("blog");
		this._pageMgr.GetPage("blogList").innerHTML = "";
		
		let blogPage = this._pageMgr.GetPage("blog");
		
		let curSpan = blogPage.querySelector(".current-page-num");
		let totalSpan = blogPage.querySelector(".total-page-num");
		
		
		let blogContents = this._dataMgr.GetData("blogContents");
		let blogLength = blogContents.length;
		
		let itemShowNum = this._stateMgr._blogShowNum;
		
		let totalPageNum = (blogLength % itemShowNum) == 0 ? 
			(blogLength / itemShowNum) :
			(Math.floor(blogLength / itemShowNum) + 1);
			
		this._stateMgr._blogPageNum = totalPageNum;
		
		let curPageNum = parseInt(hash.split("\/").slice(-1)[0]); // String 类型转 Number。
		blogPage.dataset.pageNum = "" + curPageNum;

			
		// 虽然 curSpan 元素 是 blog 元素的后代元素，且 blog 元素已经缓存。
		// 但由于 blog 元素还未被渲染进页面文档树，所以无法通过 querySelector 查询得到。因此只能将其也缓存。（不知有更好的方法没？）
		// 顺便说一句，querySelector 不止 document 能用。应该任意的 Element 都能用，并查询该元素的后代。
		curSpan.innerHTML = "" + curPageNum; // html 中 data属性中的减号 -，会自动转化成驼峰形式。（已经不用 data 属性了）
		totalSpan.innerHTML = "" + totalPageNum;
		
		let startNum = (curPageNum - 1) * itemShowNum;
		for(let ix = startNum; ix < (startNum + itemShowNum); ix++) {
			if(ix >= blogLength) {
				break;
			}
			let li = document.createElement("li");
			let h2 = document.createElement("h2");
			let a = document.createElement("a");
			a.innerHTML = blogContents[ix]["title"]
			a.href = "#/blog/article/" + blogContents[ix]["id"];
			h2.appendChild(a);
			let p = document.createElement("p");
			p.innerHTML = blogContents[ix]["summary"];
			li.appendChild(h2);
			li.appendChild(p);
			this._pageMgr.GetPage("blogList").appendChild(li);
		}
	}

	async OnNovel() {
		this._pageMgr.SetCurrent("novel");
		
		let novelMgr = new NovelManager(this._pageMgr.GetPage("novel"));
		let novelStr = this._dataMgr.GetData("novel");
		let novel = novelMgr.parse(novelStr);
		novelMgr.render("novel-view", novel);
	}

	async OnMusic() {
		this._pageMgr.SetCurrent("music");
	}
	
	async OnThanks() {
		this._pageMgr.SetCurrent("thanks");
	}
	
	async OnArticle() {
		let id = window.location.hash.split("/").at(-1);
		let blogContents = this._dataMgr.GetData("blogContents");
		for(let item of blogContents) {
			if(item["id"] == id) {
				fetch(item["url"]).then((res) => {
					return res.text();
				}).then((data) => {
					this._pageMgr.GetPage("md").innerHTML = window.marked.parse(data);
						for(let pre of this._pageMgr.GetPages("pre")) {
							if(pre.scrollWidth > pre.clientWidth) {
								this._eveMgr.AddEvent(pre, "wheel", this.OnCodeWheel);
							}
						}
				});
			}
		}
	}
	
	OnCodeWheel(eve) {
		eve.preventDefault();
		eve.stopPropagation();
		this.scrollLeft += eve.deltaY;
	}
}