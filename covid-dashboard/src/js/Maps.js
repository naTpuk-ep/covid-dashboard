/* eslint-disable no-undef */
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

		//-----------------
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
		//------------------

		
		this.geoData = geoData;
		console.log(this.geoData);

		this.geoData.features.forEach(feature => {
			feature.getInfoForView = (data) => {
				let res = 0;
				data.countries.forEach(country => {
					if (country.code === feature.properties.code) {
						res = this.getNeededData(country);
						// console.log(res);
					}
				});
				return res;
			};
		});
		
		this.style = this.style.bind(this);
		this.onEachFeature = this.onEachFeature.bind(this);
		this.highlightHandler = this.highlightHandler.bind(this);
		this.resetHighlightHandler = this.resetHighlightHandler.bind(this);
		this.reset = this.reset.bind(this);
		this.geojson = L.geoJson(this.geoData, {
			style: this.style,
			onEachFeature: this.onEachFeature
		}).addTo(this.map);
		this.geojson.addTo(this.map);
		console.log(wrapper);
		document.querySelector('.main__section_map .main__section-title').addEventListener('click', () => {
			this.update({
				today: true,
				sample: true
			});
		});
		// console.log();
	}

	getNeededData(country) {
		const sampleVol = 100000;
		const population = country.population;
		console.log(this.state.today);
		const confirmed = this.state.today ? country.today.confirmed : country.latest_data.confirmed;
		console.log(country.code, confirmed);
		return this.state.sample ? sampleVol * confirmed / population : confirmed;
	}

	update({today, sample}) {
		console.log(1);
		// console.log(today, sample);
		this.state = {
			today,
			sample,
		};
		console.log(this.state);
		Object.values(this.geojson._layers).forEach(layer => {
			this.geojson.resetStyle(layer);

		});
	}

	getColor(cases) {
		const allCountriesCases = [];
		this.data.countries.forEach(country => {
			allCountriesCases.push(this.getNeededData(country));
		});
		const max = Math.max(...allCountriesCases);
		const casesVisualFunction = Math.sqrt(1 - ((cases / max) - 1) ** 2);
		return `rgb(255 165 0 / ${casesVisualFunction})`;
	}

	style(feature) {
    return {
        fillColor: this.getColor(feature.getInfoForView(this.data)),
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
		// console.log(e.target);
		// console.log(this.geojson);
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
 
