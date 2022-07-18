export default class MediaQueryManager {
	_pageMgr;
	_eveMgr;
	
	constructor(pageMgr, eveMgr) {
		this._pageMgr = pageMgr;
		this._eveMgr = eveMgr;
	}
	
	Init() {
		this.AddQuery("(max-width: 768px)", this.OnScreenChange.bind(this)); // 由于需要调用该回调，故使用bind绑定this，而不用箭头函数绑定。
	}
	
	AddQuery(queryStr, queryFunc) {
		const queryList = window.matchMedia(queryStr);
		queryFunc(queryList);
		queryList.addListener(queryFunc);
	}
	
	OnScreenChange(mql) {
		if(mql.matches) {
			this._eveMgr.AddEvent(this._pageMgr.GetPage(".h-nav-list"), "wheel", this.OnNavListWheel); // 不用箭头函数，使this指向事件触发的元素。
			this._pageMgr.GetPage(".h-navbar").classList.remove("h-nav-hidden"); // 窄屏保持导航栏存在
		} else {
			this._eveMgr.RemoveEvent(this._pageMgr.GetPage(".h-nav-list"), "wheel", this.OnNavListWheel);
		}
	}
	
	OnNavListWheel(eve) {
		eve.preventDefault();
		this.scrollLeft += eve.deltaY;
	}
}