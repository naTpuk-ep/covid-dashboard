const timelineUrl = 'https://corona-api.com/timeline';
const countriesUrl = 'https://corona-api.com/countries';

async function getTimeline() {
  let response = await fetch(`${timelineUrl}`);
  let timeline = await response
    .json()
    .then((promise) => promise.data);
  return timeline;
}

async function getCountries() {
  let response = await fetch(`${countriesUrl}`);
  let countries = await response
    .json()
    .then((promise) => promise.data);
  return countries;
}

export { getTimeline, getCountries };
