import pageMgr from "./PageManager.js";

class MediaQueryManager {
	
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
			pageMgr.GetPage(".h-nav-list").addEventListener("wheel", this.OnNavListWheel); // 不用箭头函数，使this指向事件触发的元素。
			pageMgr.GetPage(".h-navbar").classList.remove("h-nav-hidden"); // 窄屏保持导航栏存在
		} else {
			pageMgr.GetPage(".h-nav-list").addEventListener("wheel", this.OnNavListWheel);
		}
	}
	
	OnNavListWheel(e) {
		e.preventDefault();
		this.scrollLeft += e.deltaY;
	}
}

let mqMgr = new MediaQueryManager();

export default mqMgr;