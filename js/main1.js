let viewer = document.querySelector(".h-viewer");
let pages = document.querySelector(".h-pages");
let home_content = document.querySelector(".h-content-home");
let blog_content = document.querySelector(".h-content-blog");
let blog_article = document.querySelector(".h-blog-article");
let md_body = document.querySelector(".markdown-body");

// 节点调用 remove 后，会从文档树删除，但依旧存在，从而可以后续添加回来。
// 注意与 css 的 display: none 不同，那个还存在于文档树中。
// 此外，remove 会删除该节点及其子节点。
// 此外，该节点及其子节点上添加的事件监听，在节点被删除且重新添加回来后，好像不会消失。
pages.remove();
//viewer.appendChild(home_content);

function OnCodeWheel(e) {
	e.preventDefault();
	e.stopPropagation();
	this.scrollLeft += e.deltaY;
}

function OnCode() {
	let pres = document.querySelectorAll("pre"); // 实际滚动条在 code 父元素 pre 身上。
	for(let el of pres) {
		el.addEventListener("wheel", OnCodeWheel)
	}
}

function OnHome() {
	fetch("data/home.json")
		.then((res) => {
			return res.json()
		}).then((data) => {
			let ix = Math.floor(Math.random() * data.length);
			home_content.innerHTML = data[ix];
		});
}

function ShowBlog(blog_url) {
	fetch(blog_url)
		.then((res) => {
			return res.text();
		}).then((data) => {
			md_body.innerHTML = marked.parse(data); // marked.parse 解析得到一个节点树的字符串
			OnCode();
		});
}

function OnBlog() {
	fetch("data/blog/contents.json")
		.then((res) => {
			return res.json();
		}).then((data) => {
			for(let blog_url of data) {
				ShowBlog(blog_url);
			}
		});
}


function OnNodeChange(mutationList, oberver) {
	for(let item of mutationList) {
		if(item.type === "childList") {
			if(item.addedNodes.length > 0) {
				let node = item.addedNodes[0];
				if(node.classList.contains("h-content-home")) {
					OnHome();
				} else if(node.classList.contains("h-blog-article")) {
					OnBlog(); // 内部使用了 fetch 和 then，注意程序执行顺序。
					// console.log("test..." // 该代码将比 OnBlog 内部的 then 先执行。
				}
			}
		}
	}
}

let observerConfig = {
	childList: true
};

let node_observer = new MutationObserver(OnNodeChange);

node_observer.observe(viewer, observerConfig);

function OnUrlChange(e) {
	let viewer_child = viewer.firstChild;
	if (viewer_child) {
		viewer.removeChild(viewer_child);		
	}
	switch(window.location.hash) {
		case "" :
		case "#": {
			viewer.appendChild(home_content);
			return;
		}
		case "#/blog/article": {
			viewer.appendChild(blog_article);
			return;
		}
	}
}

OnUrlChange();

window.addEventListener("hashchange", OnUrlChange);

let nav_logo = document.querySelector(".h-nav-logo");
nav_logo.addEventListener("click", (e) => {
	window.location.href = "#"
});

/* 配置项 */
let nav_width = "150px";
let nav_magrin = "0 80px 0 100px";
let nav_magrin2 = "0 0 0 100px";

function OnNavListWheel(e) {
	e.preventDefault();
	navlist.scrollLeft += e.deltaY;
}


let navlist = document.querySelector(".h-nav-list");
let navswitch = document.querySelector(".h-nav-switch");
let navbar = document.querySelector(".h-navbar");
let navshow = true;
navswitch.addEventListener("click", (e) => {
	if(navshow) {
		navbar.classList.add("h-nav-hidden");
	} else {
		navbar.classList.remove("h-nav-hidden");
	}
	navshow = !navshow;
});

// 创建查询列表
const mediaQueryList = window.matchMedia("(max-width: 768px)");

// 定义回调函数
function handleOrientationChange(mql) {
	
	if(mql.matches) {
		navlist.addEventListener("wheel", OnNavListWheel);
		navbar.classList.remove("h-nav-hidden");
		navshow = true;
	} else {
		navlist.removeEventListener("wheel", OnNavListWheel);
	}
}

// 先运行一次回调函数
handleOrientationChange(mediaQueryList);

// 为查询列表注册监听器，同时将回调函数传给监听器
mediaQueryList.addListener(handleOrientationChange);





