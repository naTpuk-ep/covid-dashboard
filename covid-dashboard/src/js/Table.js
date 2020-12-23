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
  table.classList.add('table', 'table-dark', 'table-hover');

  tableSection.innerHTML = '';
  table.append(createTableHead(), createTableBody(country));
  tableContent.append(table);
  tableSection.append(createBtnsBlock(country), tableContent);
}

function createTableHead() {
  const tHead = document.createElement('thead');
  const tr = document.createElement('tr');

  attributes.forEach((el) => {
    let th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.innerHTML = el;
    tr.append(th);
  });

  tHead.append(tr);
  return tHead;
}

function createTableBody() {
  const tBody = document.createElement('tbody');
  let tr = document.createElement('tr');

  values.forEach((el) => {
    let td = document.createElement('td');
    td.innerHTML = !el || isNaN(el) ? 'no data' : el;
    tr.append(td);
  });

  tBody.append(tr);
  return tBody;
}

function createBtnsBlock(country) {
  const tableBtnsBlock = document.createElement('div');
  tableBtnsBlock.classList.add('main__buttons-block_table');

  const lastDayBtn = document.createElement('button');
  const per100kBtn = document.createElement('button');

  lastDayBtn.innerHTML = 'Last day';
  per100kBtn.innerHTML = 'per 100K';

  lastDayBtn.addEventListener('click', () => {
    pastDay = !pastDay;
    updateTable(country);
  });

  per100kBtn.addEventListener('click', () => {
    per100k = !per100k;
    updateTable(country);
  });

  tableBtnsBlock.append(per100kBtn, lastDayBtn);

  return tableBtnsBlock;
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

// const switcher = document.createElement('div');
// const switcherButton = document.createElement('button');
// switcher.classList.add('header__swicher');
// switcher.id = 'switch';
// const playText = document.createElement('span');
// const trainText = document.createElement('span');
// playText.classList.add('swicher-play');
// playText.innerHTML = 'play';
// trainText.classList.add('swicher-train');
// trainText.innerHTML = 'train';
// switcher.append(switcherButton, trainText, playText);

// const switcher = document.getElementById('switch');
// switcher.addEventListener('click', () => {
//   switcher.classList.toggle('header__swicher-active');
//   play = !play;
//   renderNewElements(currentPage, currentPageId);
// });

export { updateTable, initTable, attributes, worldPop };
