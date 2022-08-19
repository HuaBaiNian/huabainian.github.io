import pageMgr from "../PageManager.js";
import AppManager from "./AppManager.js";
import dataMgr from "../DataManager.js";
import stateMgr from "../StateManager.js";


class BlogShowcase extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
		pageMgr.SetCurrent("blog");
		pageMgr.FixPage();

        let hash = window.location.hash;
		let curPageNum = parseInt(window.location.hash.split("/").pop());
		stateMgr._currentBlogPage = curPageNum;
		
		let blogPage = this._mgrPage;
		let blogList = blogPage.querySelector(".blog-list");
		blogList.innerHTML = "";
		
		let curSpan = blogPage.querySelector(".current-page-num");
		let totalSpan = blogPage.querySelector(".total-page-num");
		
		let bc = dataMgr.GetData("blogContents");
		let blogContents = await bc;
		let blogLength = blogContents.length;
		
		let itemShowNum = stateMgr._blogShowNum;
		
		let totalPageNum = (blogLength % itemShowNum) == 0 ? 
			(blogLength / itemShowNum) :
			(Math.floor(blogLength / itemShowNum) + 1);
			
		stateMgr._totalBlogPage = totalPageNum;

			
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
			blogList.appendChild(li);
		}
    }

}

let blogShowcase = new BlogShowcase(pageMgr.GetPage("blogShowcase"));

export default blogShowcase;