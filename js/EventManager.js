export default class EventManager {
	_stateMgr;
	_pageMgr;
	
	constructor(stateMgr, pageMgr) {
		this._stateMgr = stateMgr;
		this._pageMgr = pageMgr;
	}
	
	Init() {
		this.AddEvent(this._pageMgr.GetPage(".h-nav-switch"), "click", this.OnSwitchNavClick.bind(this));
		this.AddEvent(this._pageMgr.GetPage(".h-nav-logo"), "click", this.OnLogoClick);
		for(let ele of this._pageMgr.GetPages(".h-nav-item a")) {
			this.AddEvent(ele, "click", (eve) => this.OnNavItemClick(eve));
		}
		
		let blogPage = this._pageMgr.GetPage("blog");
		let previousBtn = blogPage.querySelectorAll("button").item(0); //item是方法，用圆括号。危险写法，下标可能越界。
		let nextBtn = blogPage.querySelectorAll("button").item(1);
		
		// 事件管理类感觉反而麻烦，所以初始化之后，还是不要用了吧。
		// 此处会重复添加事件监听，可以想个办法放出去。
		previousBtn.addEventListener("click", () => {
			let curPageNum = parseInt(blogPage.dataset.pageNum);
			if((curPageNum - 1) > 0) {
				window.location.hash = "#/blog/page/" + (curPageNum - 1);
			}
		});
		
		nextBtn.addEventListener("click", () => {
			let curPageNum = parseInt(blogPage.dataset.pageNum);
			if((curPageNum + 1) <= this._stateMgr._blogPageNum) {
				window.location.hash = "#/blog/page/" + (curPageNum + 1);
			}
		});	
	}
	
	AddEvent(ele, eve, func) {
		ele.addEventListener(eve, func)
	}
	
	RemoveEvent(ele, eve, func) {
		ele.removeEventListener(eve, func);
	}
	
	OnSwitchNavClick() {
		this._pageMgr.GetPage(".h-navbar").classList.toggle("h-nav-hidden");
	}
	
	OnLogoClick() {
		window.location.href = "#"; // 跳转到当前 html 文件的 # 处。对于单页面应用，一般相当于回到主页。
	}
	
	OnNavItemClick(eve) {
		for(let ele of this._pageMgr.GetPages(".h-nav-item")) {
			ele.classList.remove("h-nav-item-active");
		}
		
		eve.currentTarget.parentElement.classList.add("h-nav-item-active");
	}
}