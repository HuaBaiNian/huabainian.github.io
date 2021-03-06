import StateManager from "./StateManager.js";
import PageManager from "./PageManager.js";
import EventManager from "./EventManager.js";
import MediaQueryManager from "./MediaQueryManager.js";
import URLManager from "./URLManager.js";
import DataManager from "./DataManager.js";
import NovelManager from "./NovelManager.js";

const stateMgr = new StateManager();

const dataMgr = new DataManager();

const pageMgr = new PageManager();
pageMgr.Init();

const eveMgr = new EventManager(stateMgr, pageMgr);
eveMgr.Init();

const mqMgr = new MediaQueryManager(pageMgr, eveMgr);
mqMgr.Init();

const viewer = document.querySelector(".h-viewer");
const urlMgr = new URLManager(stateMgr, pageMgr, dataMgr, eveMgr, viewer);
urlMgr.Init();

await dataMgr.PreLoad("data/blog/contents.json", "json");
dataMgr.SaveData("blogContents");

await dataMgr.PreLoad("data/home.json", "json");
dataMgr.SaveData("homeData");

await dataMgr.PreLoad("data/《大道纪》作者：裴屠狗.txt", "whattext");
dataMgr.SaveData("novel");


urlMgr.Listen();

// 根据 url 修理页面的一些样式，所以与初始化 Init 分开。
pageMgr.FixPage();

