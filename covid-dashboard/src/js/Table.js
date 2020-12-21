const { getTimeline, getCountries } = require('./API');

const attributes = [
  'Total cases',
  'Total deaths',
  'Total recovered',
  'Cases per 100K',
  'Deaths per 100K',
  'Recovered per 100K',
];
const worldPop = 7827000000;
let values = [];
let pastDay = false;

async function initTable(country = undefined) {
  const tableSection = document.querySelector('.main__section_table');
  values.splice(0, values.length);
  tableSection.innerHTML = '';
  const tableContent = document.createElement('div');
  const table = document.createElement('table');
  const lastDayBtn = document.createElement('button');

  tableContent.classList.add('main__content', 'main__content_table');
  lastDayBtn.innerHTML = 'Data for Last day';

  table.append(createTableHead());
  table.append(await createTableBody(country));
  tableContent.append(table);
  tableSection.append(lastDayBtn, tableContent);

  lastDayBtn.addEventListener('click', async () => {
    pastDay = !pastDay;
    values.splice(0, values.length);
    table.innerHTML = '';
    table.append(createTableHead());
    table.append(await createTableBody(country));
  });
}

function createTableHead() {
  let tr = document.createElement('tr');
  tr.classList.add('header_tr');

  attributes.forEach((el) => {
    let td = document.createElement('td');
    td.innerHTML = el;
    tr.append(td);
  });

  return tr;
}

async function createTableBody(country) {
  let tr = document.createElement('tr');
  tr.classList.add('body_tr');

  let globalData = await getTimeline().then((result) =>
    result.find((el, index) => index === 0),
  );

  let countryData = await getCountries().then((result) =>
    result.find((el) => el.name === country),
  );

  console.log(countryData);

  if (!pastDay) {
    !country
      ? values.push(
          globalData.confirmed,
          globalData.deaths,
          globalData.recovered,
          ((globalData.confirmed / worldPop) * 100000).toFixed(1),
          ((globalData.deaths / worldPop) * 100000).toFixed(1),
          ((globalData.recovered / worldPop) * 100000).toFixed(1),
        )
      : values.push(
          countryData.latest_data.confirmed,
          countryData.latest_data.deaths,
          countryData.latest_data.recovered,
          (
            (countryData.latest_data.confirmed /
              countryData.population) *
            100000
          ).toFixed(1),
          (
            (countryData.latest_data.deaths /
              countryData.population) *
            100000
          ).toFixed(1),
          (
            (countryData.latest_data.recovered /
              countryData.population) *
            100000
          ).toFixed(1),
        );
  } else {
    !country
      ? values.push(
          globalData.new_confirmed,
          globalData.new_deaths,
          globalData.new_recovered,
          ((globalData.new_confirmed / worldPop) * 100000).toFixed(1),
          ((globalData.new_deaths / worldPop) * 100000).toFixed(1),
          ((globalData.new_recovered / worldPop) * 100000).toFixed(1),
        )
      : values.push(
          countryData.today.confirmed,
          countryData.today.deaths,
          countryData.today.recovered,
          (
            (countryData.today.confirmed / countryData.population) *
            100000
          ).toFixed(1),
          (
            (countryData.today.deaths / countryData.population) *
            100000
          ).toFixed(1),
          (
            (countryData.today.recovered / countryData.population) *
            100000
          ).toFixed(1),
        );
  }

  values.forEach((el) => {
    let td = document.createElement('td');
    td.innerHTML = !el || isNaN(el) ? 'no data' : el;
    tr.append(td);
  });
  return tr;
}

initTable();

export { initTable };
