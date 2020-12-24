const APIUrls = {
	global: 'https://corona-api.com/timeline', 
	countries: 'https://corona-api.com/countries',			// <-  push here Api url
};

Object.defineProperty(APIUrls, 'updateFreqSec', { //update Frequency property (in seconds)
	value: 3600,																		//
	writable: true,
  enumerable: false,
  configurable: true,
});

export default APIUrls;