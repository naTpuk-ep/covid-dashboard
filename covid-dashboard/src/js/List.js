
import { initTable } from './Table';

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
		this.wrapper.before(this.input);
	}

	bindTriggers() {
		this.sampleBtn.addEventListener('click', () => {
			this.sampleHandler();
		});
		this.todayBtn.addEventListener('click', () => {
			this.todayHandler();
		});
		// [...this.listElem.children].forEach(li => {

		// });
		this.input.addEventListener('input', (e) => {
			this.initList(e.target.value);
		});
	}

	addButtons() {
		this.sampleBtn = document.createElement('button');
		this.sampleBtn.textContent = 'per 100K';
		this.wrapper.before(this.sampleBtn);
		this.todayBtn = document.createElement('button');
		this.todayBtn.textContent = 'Last Day';
		this.wrapper.before(this.todayBtn);
	}

	initList(input) {
		if (this.listElem) this.listElem.remove();
		this.listElem = document.createElement('ul');
		this.wrapper.appendChild(this.listElem);
		this.currentDataList = this.getCurrentCountriesCases();
		this.currentDataList.forEach(country => {
			let elem = document.createElement('li');
			elem.setAttribute('data-name', country.name);
			elem.innerHTML = `
			<img src="https://www.countryflags.io/${country.code}/flat/32.png">
			${country.name} ${country.cases}`;
			if (input) {
				if (new RegExp(`^${input}`, 'ig').test(country.name)) this.listElem.appendChild(elem);
			} else this.listElem.appendChild(elem);
			elem.addEventListener('click', (e) => {
				initTable(e.target.getAttribute('data-name'));
			});
		});
	}

	getCurrentCountriesCases() {
		const sampleVol = 100000;
    const currentCountriesCases = [];
    this.data.countries.forEach((country) => {
      let population = country.population;
      let confirmed = this.state.today
        ? country.today.confirmed
        : country.latest_data.confirmed;
      let cases = this.state.sample
        ? (sampleVol * confirmed) / population
				: confirmed;
				const countryCases = {};
				countryCases.name = country.name;
				countryCases.code = country.code;
				countryCases.cases = Math.round(cases) || 0;
				currentCountriesCases.push(countryCases);
		});
		return currentCountriesCases.sort((a, b) => b.cases - a.cases);
	}



}