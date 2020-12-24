let APIUrls;

async function getData(urls) {
	APIUrls = urls;
	if (_checkStorageData(Date.now(), APIUrls.updateFreqSec)) {
		return getStorageData();
	}
	return await getNewData();
}

const _checkStorageData = (date, updateFreqSec) => {
	if (localStorage['covid-data']) {
		if (date) {
			return ((date - Date.parse(JSON.parse(localStorage['covid-data']).updated_at)) < (updateFreqSec * 1000));
		}
		return JSON.parse(localStorage['covid-data']).updated_at;
	}
};

function getStorageData(key, res) {
	if (res) {
		console.error(res.reason, `Currently used data for ${_checkStorageData()}`);
		return JSON.parse(localStorage['covid-data'])[key];
	}
	return JSON.parse(localStorage['covid-data']);
}

async function getNewData () {
	const newData = {},
		promises = [];
	Object.keys(APIUrls).forEach(prop => {
		promises.push(new Promise(((resolve, reject) => {
			getDataByUrl(APIUrls[prop])
				.then(res => resolve(res))
				.catch(err => reject(err));
		})));
	});
	return await Promise.allSettled(promises)
		.then(res => resolveAllSettled(res, newData));
}

async function getDataByUrl(url) {
	const res = await fetch(url);
	return res.ok ? res.json() : Promise.reject(`Not "ok" response from ${res.url}. Status: ${res.status}.`);
}

function resolveAllSettled(res, newData) {
	let reject;
	let i = 0;
	for (let key in APIUrls) {
		if (res[i].value) {
			newData[key] = res[i].value.data;
		} else if (_checkStorageData()) {
			newData[key] = getStorageData(key, res[i]);
			return newData;
		} else {
			reject = res[i].reason;
		}
		i++;
	}
	if (reject) {
		return Promise.reject(reject);
	}
	newData.updated_at = new Date().toISOString();
	localStorage.setItem('covid-data', JSON.stringify(newData));
	return newData;
}


export default getData;