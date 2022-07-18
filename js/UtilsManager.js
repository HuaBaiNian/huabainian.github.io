export class TextCharsetDet {
	DetCharset(data) {
		// txt编码检测工具
		// 基本只能检测 utf8 和 gbk。注：gbk 兼容 gb2312。
		// 代码来源：https://blog.csdn.net/panchang199266/article/details/85637981
		
		let charset = "gbk";
		
		// data 需要是 Uint8Array 类型。
		if(data) { // 保证 data 不为 null。
			if(data.constructor == Uint8Array) {
				let length = data.length;
				if(length >= 2) {
					if(data[0] == 0xFF && data[1] == 0xFE) {
						charset = "utf-16le";
						return charset;
					}
					if(data[0] == 0xFE && data[1] == 0xFF) {
						charset = "utf-16be";
						return charset;
					}
					if(length >= 3 && data[0] == 0xEF && data[1] == 0xBB && data[2] == 0xBF) {
						charset = "utf-8";
						return charset;
					}
				}
				let ix = 0;
				while(ix < length) {
					if(data[ix] >= 0xF0) {
						break;
					}
					if(0x80 <= data[ix] && data[ix] <= 0xBF) {
						break;
					}
					if(0xC0 <= data[ix] && data[ix] <= 0xDF) {
						ix += 1;
						if(ix < length) {
							if(0x80 <= data[ix] && data[ix] <= 0xBF) {
								ix += 1;
								continue;
							} else {
								break;
							}
						}
					} else if(0xE0 <= data[ix] && data[ix] <= 0xEF) {
						ix += 1;
						if(ix < length) {
							if(0x80 <= data[ix] && data[ix] <= 0xBF) {
								ix += 1;
								if(ix < length) {
									if(0x80 <= data[ix] && data[ix] <= 0xBF) {
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
}

export class TextOutline {
	FindOutline(str) {
		let nstr = "[一二三四五六七八九十百千万]+";
		let restr = "第(?:\\d+|" + nstr + ")章.*";
		let re = new RegExp(restr, "g");
		
		let novelParag = [];
		
		let ct = 0;
		let preIx = 0;
		let result;
		while((result = re.exec(str)) != null) {
			let curIx = result.index;
			novelParag.push(str.slice(preIx, curIx));
			preIx = curIx;
			ct += 1;

			//console.log(ct)
			//console.log(result)
		}
		return novelParag;
		
	}
}