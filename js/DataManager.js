import { TextCharsetDet } from "./UtilsManager.js";

export default class DataManager {
	_data;
	_dataObj = {};
	
	async PreLoad(url, type) {
		await fetch(url).then((res) => {
			switch(type) {
				case "json": {
					return res.json();
				}
				case "text": {
					return res.text();
				}
				case "whattext": {
					return res.arrayBuffer();
				}
			}
		}).then((data) => {
			if(type == "whattext") {
				let arr = new Uint8Array(data);
				
				let det = new TextCharsetDet();
				let charset = det.DetCharset(arr);
				
				let decoder = new TextDecoder(charset);
				let str = decoder.decode(arr);
				
				this._data = str;
			} else {
				this._data = data;
			}
		});
	}
	
	SaveData(dataKey) {
		this._dataObj[dataKey] = this._data;
	}
	
	GetData(dataKey) {
		return this._dataObj[dataKey];
	}
}