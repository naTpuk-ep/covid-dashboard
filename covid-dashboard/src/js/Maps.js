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
    const wrapper = document.querySelector(
      '.main__section_map .main__content',
    );
    wrapper.innerHTML = '<div id="map"></div>';
    this.initMap();
    this.bindContext();
    this.initGeoData();
    this.initDataLayer();
    this.createPopup();
  }

  createPopup() {
    this.info = L.control();
    // eslint-disable-next-line no-unused-vars
    this.info.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
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
    const currentCountriesCases = this._getCurrentCountriesCases();
    console.log(this.geoData);
    this.geoData.features.forEach((feature) => {
      feature.getDataforView = () => {
        return (
          Math.round(
            currentCountriesCases[feature.properties.iso_a2],
          ) || 0
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

  _getCurrentCountriesCases() {
    const sampleVol = 100000;
    const currentCountriesCases = {};
    this.data.countries.forEach((country) => {
      let population = country.population;
      let confirmed = this.state.today
        ? country.today.confirmed
        : country.latest_data.confirmed;
      let cases = this.state.sample
        ? (sampleVol * confirmed) / population
        : confirmed;
      currentCountriesCases[country.code] = cases || 0;
    });
    this.maxCasesValue = Math.max(
      ...Object.values(currentCountriesCases),
    );
    return currentCountriesCases;
  }

  updateMap(state) {
    this.state = state;
    console.log(this.state);
    if (this.geojson) this.geojson.remove();
    console.log('updated');
  }

  getColor(cases) {
    const casesVisualize = Math.sqrt(
      1 - (cases / this.maxCasesValue - 1) ** 2,
    );
    return `rgb(255 165 0 / ${casesVisualize})`;
  }

  style(feature) {
    return {
      fillColor: this.getColor(feature.getDataforView()),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 1,
    };
  }

  highlightHandler(e) {
    let layer = e.target;
    layer.setStyle({
      weight: 3,
      color: 'white',
      dashArray: '',
      fillOpacity: 1,
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
      this.data.countries.find(country => 
        country.code === e.target.feature.properties.iso_a2
      ).name
    );
  }

  bindContext() {
    this.style = this.style.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.highlightHandler = this.highlightHandler.bind(this);
    this.resetHighlightHandler = this.resetHighlightHandler.bind(
      this,
    );
    this.reset = this.reset.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }
}
