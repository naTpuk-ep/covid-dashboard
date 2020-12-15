// import '../autoCloser.js';
import getData from './js/getData.js';
import APIUrls from './js/APIUrls.js';

async function render() {
	getData(APIUrls)
		.then(res => {
			console.log(res);						// ->  pull the data
		})
		.catch(e => {
			console.error(e);
		});
}

render();