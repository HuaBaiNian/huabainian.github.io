/*
 * @Description: 
 */
class DataManager {
	_data = {};
	
	async PreLoad(url, type) {
		let data;
		let res = await fetch(url);
		switch(type) {
			case "json": {
				data = await res.json();
				break;
			}
			case "text": {
				data = await res.text();
				break;
			}
			default: {
				data = await res.arrayBuffer();
				break;
			}
		}

		return data;
	}
	
	SaveData(name, data) {
		this._data[name] = data;
	}
	
	GetData(name) {
		return this._data[name];
	}
}

let dataMgr = new DataManager();

export default dataMgr;