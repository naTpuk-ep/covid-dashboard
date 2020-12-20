/* eslint-disable no-undef */

// localStorage.clear();

const GeoJSON = require('geojson');
import countries from './countries';
const L_Token = 'pk.eyJ1IjoibmF0cHVrLWVwIiwiYSI6ImNraXJxZHZyNzBwejEydGwzcTg3NXpidG4ifQ.GL9jfvvsWibQh0y7c-Ycdw';
// const geoData = require('../assets/countries.json');
const geoData = GeoJSON.parse(countries, {Polygon: 'borders'});

export default class Maps {
	constructor(data) {
		this.data = data;
		this.state = {
			today: false,
			sample: false,
		};
		const wrapper = document.querySelector('.main__section_map .main__section-content');
		wrapper.innerHTML = '<div id="map"></div>';
		this.initMap();
		this.initGeoData(geoData);
		this.style = this.style.bind(this);
		this.onEachFeature = this.onEachFeature.bind(this);
		this.highlightHandler = this.highlightHandler.bind(this);
		this.resetHighlightHandler = this.resetHighlightHandler.bind(this);
		this.reset = this.reset.bind(this);
		this.update = this.update.bind(this);
		this.initDataLayer();
	}

	initMap() {
		this.map = L.map('map', {
			worldCopyJump: true,
			center: [30, 0],
			zoom: 1.5
		});
		L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
			// attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox/dark-v10',
			tileSize: 512,
			zoomOffset: -1,
			accessToken: L_Token
		}).addTo(this.map);
	}

	initGeoData(geoData) {
		this.geoData = geoData;
		console.log(this.geoData);
		const currentCountriesCases = this._getCurrentCountriesCases();
		this.geoData.features.forEach(feature => {
			feature.getDataforView = () => {
				return currentCountriesCases[feature.properties.code] || 0;
			};
		});
	}

	initDataLayer() {
		this.geojson = L.geoJson(this.geoData, {
			style: this.style,
			onEachFeature: this.onEachFeature
		}).addTo(this.map);
		document.querySelector('.main__section_map .main__section-title').addEventListener('click', () => {
			this.update({
				today: true,
				sample: true
			});
		});
	}

	_getCurrentCountriesCases() {
		const sampleVol = 100000;
		const currentCountriesCases = {};
		this.data.countries.forEach(country => {
			let population = country.population;
			let confirmed = this.state.today ? country.today.confirmed : country.latest_data.confirmed;
			let cases = this.state.sample ? sampleVol * confirmed / population : confirmed;
			currentCountriesCases[country.code] = cases;
		});
		this.maxCasesValue = Math.max(...Object.values(currentCountriesCases));
		console.log(currentCountriesCases);
		return currentCountriesCases;
	}

	update(state) {
		this.state = state;
		console.log(this.state);
		this.geojson.remove();
		console.log(this.geojson);
		this.initDataLayer();
	}

	getColor(cases) {
		const casesVisualize = Math.sqrt(1 - ((cases / this.maxCasesValue) - 1) ** 2);
		return `rgb(255 165 0 / ${casesVisualize})`;
	}

	style(feature) {
		console.log('style');
    return {
        fillColor: this.getColor(feature.getDataforView()),
        weight: 1,
        opacity: 1,
        color: 'white',
        // dashArray: '3',
        fillOpacity: 0.7
    };
	}

	highlightHandler(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 3,
        color: 'white',
        dashArray: '',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
	}

	resetHighlightHandler(e) {
    this.geojson.resetStyle(e.target);
	}

	zoomHandler(e) {
    this.map.fitBounds(e.target.getBounds());
	}

	reset(e) {
		this.geojson.resetStyle(e.target);
	}

	onEachFeature(feature, layer) {
    layer.on({
        mouseover: this.highlightHandler,
        mouseout: this.resetHighlightHandler,
        // click: /*this.zoomHandler*/ this.reset,
    });
	}
}
 
