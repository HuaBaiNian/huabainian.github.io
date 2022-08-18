/*
 * @Description: 
 */
import mainMgr from "./MainManager.js";
import mqMgr from "./MediaQueryManager.js";
import urlMgr from "./URLManager.js";
import dataMgr from "./DataManager.js";
import stateMgr from "./StateManager.js";
import { Test } from "./Test.js";

Test();

await mainMgr.Init();

mqMgr.Init();

urlMgr.Init();

let bc = await dataMgr.PreLoad("data/blog/contents.json", "json");
dataMgr.SaveData("blogContents", bc);

let hd = await dataMgr.PreLoad("data/home.json", "json");
dataMgr.SaveData("homeData", hd);

let nl = dataMgr.PreLoad("data/novel/novel.db3");
dataMgr.SaveData("novel", nl); // 保存的是一个 promise


await urlMgr.Listen();

