export function DetCharset(data) {
	// txt编码检测工具
	// 基本只能检测 utf8 和 gbk。注：gbk 兼容 gb2312。
	// 代码来源：https://blog.csdn.net/panchang199266/article/details/85637981

	let charset = "gbk";

	// data 需要是 Uint8Array 类型。
	if (data) {
		// 保证 data 不为 null。
		if (data.constructor == Uint8Array) {
			let length = data.length;
			if (length >= 2) {
				if (data[0] == 0xff && data[1] == 0xfe) {
					charset = "utf-16le";
					return charset;
				}
				if (data[0] == 0xfe && data[1] == 0xff) {
					charset = "utf-16be";
					return charset;
				}
				if (
					length >= 3 &&
					data[0] == 0xef &&
					data[1] == 0xbb &&
					data[2] == 0xbf
				) {
					charset = "utf-8";
					return charset;
				}
			}
			let ix = 0;
			while (ix < length) {
				if (data[ix] >= 0xf0) {
					break;
				}
				if (0x80 <= data[ix] && data[ix] <= 0xbf) {
					break;
				}
				if (0xc0 <= data[ix] && data[ix] <= 0xdf) {
					ix += 1;
					if (ix < length) {
						if (0x80 <= data[ix] && data[ix] <= 0xbf) {
							ix += 1;
							continue;
						} else {
							break;
						}
					}
				} else if (0xe0 <= data[ix] && data[ix] <= 0xef) {
					ix += 1;
					if (ix < length) {
						if (0x80 <= data[ix] && data[ix] <= 0xbf) {
							ix += 1;
							if (ix < length) {
								if (0x80 <= data[ix] && data[ix] <= 0xbf) {
									charset = "utf-8";
									return charset;
								} else {
									break;
								}
							} else {
								break;
							}
						} else {
							break;
						}
					} else {
						break;
					}
				}

				ix += 1;
			}

			return charset;
		} else {
			console.log("不是Uint8Array类型。");
		}
	} else {
		console.log("请传入数据。");
	}
}

export function NovelParse(novelStr) {
	let novelObj = {
		chapters: []
	};

	let chaRe = /^\x20*(第(?:\d+|[一二三四五六七八九十百千万]+)章.*)[\r\n]{1,2}/gm;
	let volRe = /^\x20*(第(?:\d+|[一二三四五六七八九十百千万]+)卷.*)[\r\n]{1,2}/gm;

	let hasVol = false; // 该小说是否分卷
	let gChaptId = 0;

	let novDesEnd = novelStr.length; // 小说描述终点索引

	let rs;
	if(rs = volRe.exec(novelStr)) {
		novDesEnd = rs.index;
		hasVol = true;
	} else if(rs = chaRe.exec(novelStr)){
		novDesEnd = rs.index;
	}

	let novDesStr = NovelFormat(novelStr.slice(0, novDesEnd));

	let novStr;
	if(novDesEnd != novelStr.length) {
		novStr = novelStr.slice(novDesEnd, novelStr.length);
	}

	volRe.lastIndex = 0; // 重置正则游标
	chaRe.lastIndex = 0;

	let volList = [];
	let chaptList = [];

	if(hasVol) {
		let vols = [];
		let pi = 0; // 前指针
		let ci = 0; // 当前指针
		while(rs = volRe.exec(novStr)) {
			ci = rs.index;
			vols.push(novStr.slice(pi, ci));
			pi = ci;
		}
		ci = novStr.length;
		vols.push(novStr.slice(pi, ci));
		vols.shift();

		for(let i=0; i < vols.length; i++) {
			let v = {};
			v.volId = i+1;

			let db; // 卷描述起点
			let de; // 卷描述终点

			let r;
			volRe.lastIndex = 0;
			if(r = volRe.exec(vols[i])) {
				v.name = r[1].trim();
				db = volRe.lastIndex;
			}

			chaRe.lastIndex = 0;
			if(r = chaRe.exec(vols[i])) {
				de = r.index;
			}

			v.description = NovelFormat(vols[i].slice(db, de));
			volList.push(v);

			chaptList = chaptList.concat(ParseChapter(vols[i], v.name));
		}
	} else {
		chaptList = ParseChapter(novStr, null);
	}

	let novObj = {};
	novObj.nov = {};
	novObj.nov.description = novDesStr;
	novObj.vol = volList;
	novObj.chapt = chaptList;
	return novObj;

	function ParseChapter(str, volname) {
		chaRe.lastIndex = 0;
		let rs;
		let chaptList = [];
		let chapts = [];
		let pi = 0;
		let ci = 0;
		while(rs = chaRe.exec(str)) {
			ci = rs.index;
			let c = {};
			gChaptId += 1;
			c.chaptId = gChaptId;
			c.volname = volname;
			c.name = rs[1].trim();
			chaptList.push(c);

			chapts.push(NovelFormat(str.slice(pi, ci)));
			pi = chaRe.lastIndex;
		}
		ci = str.length;
		chapts.push(str.slice(pi, ci));
		chapts.shift();
		for(let i=0; i < chapts.length; i++) {
			chaptList[i].content = chapts[i];
		}
		
		return chaptList;
	}
}

export function NovelFormat(str) {
	let blankRe = /^\x20{4}|\t/gm;
	let newStr = str.replace(blankRe, "\u3000\u3000");
	return newStr;
}