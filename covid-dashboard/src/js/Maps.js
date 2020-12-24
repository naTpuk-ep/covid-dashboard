/* eslint-disable no-undef */
import { updateTable } from './Table';

import geoData from '../assets/countries.geo.json';
const L_Token =
  'pk.eyJ1IjoibmF0cHVrLWVwIiwiYSI6ImNraXJxZHZyNzBwejEydGwzcTg3NXpidG4ifQ.GL9jfvvsWibQh0y7c-Ycdw';

export default class Maps {
  constructor(data) {
    this.data = data;
    this.geoData = geoData;
    this.state = {
      today: false,
      sample: false,
    };
    this.wrapper = document.querySelector('.main__section_map .main__content');
    this.wrapper.innerHTML = '<div id="map"></div>';
    this.initMap();
    this.bindContext();
    this.switchersElemsInit();
    this.bindSwitchers();
    this.initGeoData();
    this.initDataLayer();
    this.createPopup();
    this.addLegend();
  }

  addLegend() {
    this.legend = L.control({ position: 'bottomright' });
    // let max = this.maxCasesValue;
    // let checked = this.checked;
    this.legend.onAdd = () => {
      let div = L.DomUtil.create('div', 'info legend');
      div.innerHTML =
        this.checked === 'confirmed'
          ? `<div>0</div><div class="legend-gradient legend-gradient__yellow"></div><div>${this.maxCasesValue}</div>`
          : this.checked === 'deaths'
          ? `<div>0</div><div class="legend-gradient legend-gradient__red"></div><div>${this.maxCasesValue}</div>`
          : `<div>0</div><div class="legend-gradient legend-gradient__green"></div><div>${this.maxCasesValue}</div>`;
      return div;
    };

    this.legend.onRemove = () => {
      this.addLegend();
    };

    this.legend.addTo(this.map);
  }

  switchersElemsInit() {
    const switchWrapper = document.createElement('div');
    switchWrapper.classList.add('switch-wrapper');
    switchWrapper.innerHTML = `
      <span><input value='confirmed' type="radio" name="maps-cases" checked>confirmed</span>
      <span><input value='deaths' type="radio" name="maps-cases">deaths</span>
      <span><input value='recovered' type="radio" name="maps-cases">recovered</span>
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

  bindSwitchers() {
    this.sampleBtn.addEventListener('click', () => {
      this.sampleHandler();
    });
    this.todayBtn.addEventListener('click', () => {
      this.todayHandler();
    });
    [...this.swithchers].forEach((radio) => {
      radio.addEventListener('change', () => {
        this.updateMap();
      });
    });
  }
  sampleHandler() {
    if (this.state.sample) {
      this.sampleBtn.textContent = 'Per 100K';
      this.state.sample = false;
    } else {
      this.sampleBtn.textContent = 'All cases';
      this.state.sample = true;
    }
    this.updateMap();
  }

  todayHandler() {
    if (this.state.today) {
      this.todayBtn.textContent = 'Last Day';
      this.state.today = false;
    } else {
      this.todayBtn.textContent = 'All time';
      this.state.today = true;
    }
    this.updateMap();
  }

  createPopup() {
    this.info = L.control();
    this.info.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };
    this.info.update = function (feature) {
      if (feature) {
        this._div.style.display = '';

        this._div.innerHTML = `<h4>${
          feature.properties.name
        }</h4><b>${feature.getDataforView()}</b>`;
      } else {
        this._div.style.display = 'none';
      }
    };
    this.info.addTo(this.map);
  }

  initMap() {
    this.map = L.map('map', {
      worldCopyJump: true,
      center: [30, 0],
      zoom: 1.5,
      minZoom: 1,
      maxBounds: [
        [90, -180],
        [-90, 180],
      ],
      maxBoundsViscosity: 1,
    });
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`,
      {
        // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: L_Token,
      },
    ).addTo(this.map);

    L.control
      .scale({
        imperial: false,
        updateWhenIdle: true,
      })
      .addTo(this.map);
  }

  initGeoData() {
    const currentCountriesCases = this.getCurrentCountriesCases();
    this.geoData.features.forEach((feature) => {
      feature.getDataforView = () => {
        return (
          Math.round(currentCountriesCases[feature.properties.iso_a2] * 10) / 10 || 0
        );
      };
    });
  }

  initDataLayer() {
    this.geojson = L.geoJson(this.geoData, {
      style: this.style,
      onEachFeature: this.onEachFeature,
    })
      .on({
        remove: () => {
          this.initGeoData();
          this.initDataLayer();
        },
      })
      .addTo(this.map);
    //--example
    // document.querySelector('.main__section_map .main__section-title').addEventListener('click', () => {
    // 	this.updateMap({
    // 		today: false,
    // 		sample: true
    // 	});
    // });
    //--
  }

  getCurrentCountriesCases() {
    const sampleVol = 100000;
    const currentCountriesCases = {};
    [...this.swithchers].forEach((radio) => {
      if (radio.checked) {
        this.checked = radio.value;
      }
    });
    this.data.countries.forEach((country) => {
      let population = country.population;
      let confirmed = this.state.today
        ? country.today[this.checked]
        : country.latest_data[this.checked];
      let cases = this.state.sample ? (sampleVol * confirmed) / population : confirmed;
      currentCountriesCases[country.code] = cases || 0;
    });
    this.maxCasesValue =
      Math.round(Math.max(...Object.values(currentCountriesCases)) * 10) / 10;
    return currentCountriesCases;
  }

  updateMap() {
    if (this.geojson) this.geojson.remove();
    if (this.legend) this.legend.remove();
  }

  getColor(cases) {
    const casesVisualize = Math.sqrt(1 - (cases / this.maxCasesValue - 1) ** 2);
    this.color =
      this.checked === 'confirmed'
        ? `rgb(255 255 ${(1 - casesVisualize) * 255})`
        : this.checked === 'deaths'
        ? `rgb(255 ${(1 - casesVisualize) * 255} ${(1 - casesVisualize) * 255})`
        : `rgb(${(1 - casesVisualize) * 255} 255 ${(1 - casesVisualize) * 255})`;
    return this.color;
  }

  style(feature) {
    return {
      fillColor: this.getColor(feature.getDataforView()),
      weight: 1,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.6,
    };
  }

  highlightHandler(e) {
    let layer = e.target;
    layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 0.6,
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
    this.info.update(layer.feature);
  }

  resetHighlightHandler(e) {
    this.geojson.resetStyle(e.target);
    this.info.update();
  }

  reset(e) {
    this.geojson.resetStyle(e.target);
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightHandler,
      mouseout: this.resetHighlightHandler,
      click: this.clickHandler,
    });
  }

  clickHandler(e) {
    updateTable(
      this.data.countries.find(
        (country) => country.code === e.target.feature.properties.iso_a2,
      ).name,
    );
  }

  bindContext() {
    this.style = this.style.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.highlightHandler = this.highlightHandler.bind(this);
    this.resetHighlightHandler = this.resetHighlightHandler.bind(this);
    this.reset = this.reset.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
}
