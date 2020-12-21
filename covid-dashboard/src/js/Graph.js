const { getTimeline, getCountries } = require('./API');

async function logTimeline() {
  await getTimeline().then((result) =>
    console.log(result.map((el, index) => el)),
  );
}

async function logCountries() {
  await getCountries().then((result) =>
    console.log(result.map((el, index) => el)),
  );
}

console.log(logTimeline());
console.log(logCountries());
