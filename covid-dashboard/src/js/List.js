import { updateTable } from './Table';

export default class List {
  constructor(data) {
    this.state = {
      today: false,
      sample: false,
    };
    this.data = data;
    this.wrapper = document.querySelector('.main__section_list .main__content');
    this.addButtons();
    this.initSearch();
    this.initList();
    this.bindTriggers();
  }

  sampleHandler() {
    if (this.state.sample) {
      this.sampleBtn.textContent = 'Per 100K';
      this.state.sample = false;
    } else {
      this.sampleBtn.textContent = 'All cases';
      this.state.sample = true;
    }
    this.initList(this.input.value);
  }

  todayHandler() {
    if (this.state.today) {
      this.todayBtn.textContent = 'Last Day';
      this.state.today = false;
    } else {
      this.todayBtn.textContent = 'All time';
      this.state.today = true;
    }
    this.initList(this.input.value);
  }

  initSearch() {
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Search';

    this.wrapper.before(this.input);
  }

  bindTriggers() {
    this.sampleBtn.addEventListener('click', () => {
      this.sampleHandler();
    });
    this.todayBtn.addEventListener('click', () => {
      this.todayHandler();
    });
    [...this.swithchers].forEach((radio) => {
      radio.addEventListener('change', () => {
        this.initList(this.input.value);
      });
    });
    this.input.addEventListener('input', (e) => {
      this.initList(e.target.value);
    });
  }

  //   addButtons() {
  //     const switchWrapper = document.createElement('div');
  //     switchWrapper.classList.add('switch-wrapper');
  //     switchWrapper.innerHTML = `
  //       <span><input value='confirmed' type="radio" name="list-cases" checked>confirmed</span>
  //       <span><input value='deaths' type="radio" name="list-cases">deaths</span>
  //       <span><input value='recovered' type="radio" name="list-cases">recovered</span>
  // 		`;
  //     this.wrapper.after(switchWrapper);
  // 	this.swithchers = switchWrapper.querySelectorAll('input[type="radio"]');
  //     this.sampleBtn = document.createElement('button');
  //     this.sampleBtn.textContent = 'per 100K';
  //     this.wrapper.before(this.sampleBtn);
  //     this.todayBtn = document.createElement('button');
  //     this.todayBtn.textContent = 'Last Day';
  //     this.wrapper.before(this.todayBtn);
  //   }

  addButtons() {
    const switchWrapper = document.createElement('div');
    switchWrapper.classList.add('switch-wrapper');
    switchWrapper.innerHTML = `
      <span><input value='confirmed' type="radio" name="list-cases" checked>confirmed</span>
      <span><input value='deaths' type="radio" name="list-cases">deaths</span>
      <span><input value='recovered' type="radio" name="list-cases">recovered</span>
		`;
    this.swithchers = switchWrapper.querySelectorAll('input[type="radio"]');

    this.listBtnsBlock = document.createElement('div');
    this.listBtnsBlock.classList.add('main__buttons-block', 'btn-group');
    this.sampleBtn = document.createElement('button');
    this.sampleBtn.classList.add('btn', 'btn-outline-dark');
    this.sampleBtn.textContent = 'per 100K';
    this.todayBtn = document.createElement('button');
    this.todayBtn.classList.add('btn', 'btn-outline-dark');
    this.todayBtn.textContent = 'Last Day';
    this.listBtnsBlock.append(this.sampleBtn, this.todayBtn);
    this.wrapper.before(this.listBtnsBlock);
    this.wrapper.before(switchWrapper);
  }

  // initList(input) {
  //   if (this.listElem) this.listElem.remove();
  //   this.listElem = document.createElement('ul');
  //   this.wrapper.appendChild(this.listElem);
  //   this.currentDataList = this.getCurrentCountriesCases();
  //   this.currentDataList.forEach((country) => {
  //     let elem = document.createElement('li');
  //     elem.setAttribute('data-name', country.name);
  //     elem.innerHTML = `
  //   		<img src="https://www.countryflags.io/${country.code}/flat/32.png">
  //   		${country.name} ${country.cases}`;
  //     if (input) {
  //       if (new RegExp(`^${input}`, 'ig').test(country.name))
  //         this.listElem.appendChild(elem);
  //     } else this.listElem.appendChild(elem);
  //     elem.addEventListener('click', (e) => {
  //       updateTable(e.target.getAttribute('data-name'));
  //     });
  //   });
  // }

  initList(input) {
    if (this.tableElem) this.tableElem.remove();
    this.tableElem = document.createElement('table');
    this.tableBody = document.createElement('tbody');
    this.tableElem.classList.add('table', 'table-dark', 'table-hover');
    this.tableElem.appendChild(this.tableBody);
    this.wrapper.appendChild(this.tableElem);
    this.currentDataList = this.getCurrentCountriesCases();
    this.currentDataList.forEach((country) => {
      let elem = document.createElement('tr');
      for (const key in country) {
        if (Object.hasOwnProperty.call(country, key)) {
          const element = country[key];
          let td = document.createElement('td');
          if (key === 'code') {
            td.innerHTML = `<img src="https://www.countryflags.io/${country.code}/flat/32.png">`;
          } else {
            td.innerHTML = element;
          }
          td.setAttribute('data-name', country.name);
          elem.append(td);
        }
      }
      elem.setAttribute('data-name', country.name);
      if (input) {
        if (new RegExp(`^${input}`, 'ig').test(country.name))
          this.tableBody.appendChild(elem);
      } else this.tableBody.appendChild(elem);
      elem.addEventListener('click', (e) => {
        updateTable(e.target.getAttribute('data-name'));
      });
    });
  }

  getCurrentCountriesCases() {
    const sampleVol = 100000;
    const currentCountriesCases = [];
    let checked;
    [...this.swithchers].forEach((radio) => {
      if (radio.checked) {
        checked = radio.value;
      }
    });
    this.data.countries.forEach((country) => {
      let population = country.population;
      let currentData = this.state.today
        ? country.today[checked]
        : country.latest_data[checked];
      let cases = this.state.sample
        ? (sampleVol * currentData) / population
        : currentData;
      const countryCases = {};
      countryCases.name = country.name;
      countryCases.code = country.code;
      countryCases.cases = Math.round(cases * 10) / 10 || 0;
      if (this.state.today && country.today[checked] === undefined)
        countryCases.cases = 'no data';
      currentCountriesCases.push(countryCases);
    });
    return currentCountriesCases.sort((a, b) => b.cases - a.cases);
  }
}
