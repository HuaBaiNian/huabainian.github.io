export default class NovelManager {
	_novel = {
		"preface": "",
		"chapters": []
	};
	_novelPage;
	
	constructor(novelPage) {
		this._novelPage = novelPage;
	}
	
	parse(novelStr) {
		let re = /第(\d+|[一二三四五六七八九十百千万]+)章.*[\r\n]{1,2}/g;
		let preIx = 0;
		let preEnd = 0;
		let curIx = 0;

		let result;
		
		result = re.exec(novelStr);

		curIx = result.index;
		let preStr = novelStr.slice(preIx, curIx);
		
		let re2 = /作者.*[\r\n]{1,2}/g
		let result2 = re2.exec(preStr);
		if(result2) {
			preIx = re2.lastIndex;
			this._novel["preface"] = preStr.slice(preIx, curIx);
		} else {
			let re3 = /《.*》.*[\r\n]{1,2}/g;
			let result3 = re3.exec(preStr);
			if(result3) {
				preIx = re3.lastIndex;
				this._novel["preface"] = preStr.slice(preIx, curIx);
			}
		}
		
		preIx = curIx;
		preEnd = re.lastIndex;
		
		let count = 0;
		while((result = re.exec(novelStr)) != null) {
			count += 1;
			curIx = result.index;
			
			let bodyTitle = novelStr.slice(preIx, preEnd);
			let title = bodyTitle.trim();
			let bodyContent = novelStr.slice(preEnd, curIx);
			
			let chapter = {};
			chapter["id"] = count;
			chapter["title"] = title;
			chapter["bodyTitle"] = bodyTitle;
			chapter["bodyContent"] = bodyContent;
			this._novel["chapters"].push(chapter);
			
			preIx = curIx;
			preEnd = re.lastIndex;
		}
		
		count += 1;
		curIx = novelStr.length;
		
		let bodyTitle = novelStr.slice(preIx, preEnd);
		let title = bodyTitle.trim();
		let bodyContent = novelStr.slice(preEnd, curIx);
		
		let chapter = {};
		chapter["id"] = count;
		chapter["title"] = title;
		chapter["bodyTitle"] = bodyTitle;
		chapter["bodyContent"] = bodyContent;
		this._novel["chapters"].push(chapter);
		
		return this._novel;
	}

	render(viewId, novel) {
		let view = this._novelPage.querySelector("#" + viewId);
		view.innerHTML = "";
		
		let preFaceStr = novel["preface"];
		if(preFaceStr) {
			let arr = preFaceStr.split(/\r?\n/)
			for(let item of arr) {
				let p = document.createElement("p");
				p.innerHTML = item;
				view.appendChild(p);
			}
		}
	}
}