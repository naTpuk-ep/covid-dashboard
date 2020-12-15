import getData from './js/getData.js';
// import '../autoCloser.js';

const APIUrls = {
	global: 'https://corona-api.com/timeline', 
	countries: 'https://corona-api.com/countries',			// <-  push here Api url
};


Object.defineProperty(APIUrls, 'updateFreqSec', { //update Frequency property (in seconds)
	value: 10,																		//
	writable: true,
  enumerable: false,
  configurable: true,
});

async function render() {
	getData(APIUrls)
		.then(res => {
			console.log(res);						// ->  pull the data
		})
		.catch(e => {
			console.error(e);
		});
}

// localStorage.clear();

render();

