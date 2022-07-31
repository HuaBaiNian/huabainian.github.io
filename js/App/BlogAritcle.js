import AppManager from "./AppManager.js";
import pageMgr from "../PageManager.js";
import dataMgr from "../DataManager.js";

class BlogArticle extends AppManager {
    constructor(mgrPage) {
        super();
        this._mgrPage = mgrPage;
    }

    async Render() {
		pageMgr.SetCurrent("blog");
		pageMgr.FixPage();

        let id = window.location.hash.split("/").at(-1);

		let blogContents = dataMgr.GetData("blogContents");
        let md = this._mgrPage.querySelector(".markdown-body");
		for(let item of blogContents) {
			if(item["id"] == id) {
				fetch(item["url"]).then((res) => {
					return res.text();
				}).then((data) => {
					md.innerHTML = window.marked.parse(data, {
						renderer: new marked.Renderer(),
						gfm: true,
						breaks: false,
						table: true,
						smartLists: true,
						highlight: function(code) {
							return hljs.highlightAuto(code).value;
						}
					});
					md.style.padding = "20px 20px"; // 该样式若写在css里，查看时可能不太美观。
						for(let pre of pageMgr.GetPages("pre")) {
							if(pre.scrollWidth > pre.clientWidth) {
								pre.addEventListener("wheel", this.OnCodeWheel);
							}
						}
				});
			}
		}
    }

    OnCodeWheel(e) {
		e.preventDefault();
		e.stopPropagation();
		this.scrollLeft += e.deltaY;
	}
}

let blogArticle = new BlogArticle(pageMgr.GetPage("blogArticle"));

export default blogArticle;