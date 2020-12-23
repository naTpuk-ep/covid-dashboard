let timeLine;
let countries;
let values = [];
let pastDay = false;
let per100k = false;

const attributes = ['Cases', 'Deaths', 'Recovered'];
const worldPop = 7827000000;

function initTable(data, country = undefined) {
  const tableSection = document.querySelector('.main__section_table');
  const tableContent = document.createElement('div');
  const table = document.createElement('table');
  const lastDayBtn = document.createElement('button');
  const per100kBtn = document.createElement('button');

  values.splice(0, values.length);
  timeLine = data.global;
  countries = data.countries;
  let globalData = timeLine.find((el, index) => index === 0);
  let countryData = countries.find((el) => el.name === country);

  let createValue = (a, b) => {
    values.push(!per100k ? a : ((a / b) * 100000).toFixed(1));
  };

  if (!country) {
    if (!pastDay) {
      createValue(globalData.confirmed, worldPop);
      createValue(globalData.deaths, worldPop);
      createValue(globalData.recovered, worldPop);
    } else {
      createValue(globalData.new_confirmed, worldPop);
      createValue(globalData.new_deaths, worldPop);
      createValue(globalData.new_recovered, worldPop);
    }
  } else {
    if (!pastDay) {
      createValue(countryData.latest_data.confirmed, countryData.population);
      createValue(countryData.latest_data.deaths, countryData.population);
      createValue(countryData.latest_data.recovered, countryData.population);
    } else {
      createValue(countryData.today.confirmed, countryData.population);
      createValue(countryData.today.deaths, countryData.population);
      createValue(countryData.today.recovered, countryData.population);
    }
  }

  tableContent.classList.add('main__content', 'main__content_table');
  table.classList.add('table', 'table-dark', 'table-striped');

  lastDayBtn.innerHTML = 'Last day';
  per100kBtn.innerHTML = 'per 100K';

  tableSection.innerHTML = '';
  table.append(createTableHead());
  table.append(createTableBody(country));
  tableContent.append(table);
  tableSection.append(per100kBtn, lastDayBtn, tableContent);

  lastDayBtn.addEventListener('click', () => {
    pastDay = !pastDay;
    updateTable(country);
  });

  per100kBtn.addEventListener('click', () => {
    per100k = !per100k;
    updateTable(country);
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

function createTableBody() {
  let tr = document.createElement('tr');
  tr.classList.add('body_tr');

  values.forEach((el) => {
    let td = document.createElement('td');
    td.innerHTML = !el || isNaN(el) ? 'no data' : el;
    tr.append(td);
  });
  return tr;
}

function updateTable(country) {
  initTable(
    {
      global: timeLine,
      countries,
    },
    country,
  );
}

export { updateTable, initTable, attributes, values, worldPop };
