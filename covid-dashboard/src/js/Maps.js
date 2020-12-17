/* eslint-disable no-undef */
const GeoJSON = require('geojson');
import countries from './countries';
const L_Token = 'pk.eyJ1IjoibmF0cHVrLWVwIiwiYSI6ImNraXJxZHZyNzBwejEydGwzcTg3NXpidG4ifQ.GL9jfvvsWibQh0y7c-Ycdw';
// const geoData = require('../assets/countries.json');
const geoData = GeoJSON.parse(countries, {Polygon: 'borders'});
// geoData.type = "FeatureCollection";
// geoData.features = [];
// countries.forEach((country, i) => {
// 	geoData.features[i] = {};
// 	geoData.features[i].geometry = {};
// 	geoData.features[i].geometry.coordinates = country.borders;
// 	// geoData.features[i].geometry.type = "Polygon";
// 	geoData.features[i].code = country.code;
// });

// const geoData = countries;

export default class Maps {
	constructor(data) {
		this.data = data;
		const wrapper = document.querySelector('.main__section_map .main__section-content');
		wrapper.innerHTML = '<div id="map"></div>';


		//-----------------
		var map = L.map('map', {
			worldCopyJump: true,
			center: [30, 0],
			zoom: 1.5
		});
		L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox/dark-v10',
			tileSize: 512,
			zoomOffset: -1,
			accessToken: L_Token
		}).addTo(map);
		// this.getColor = this.getColor.bind(this);
		//------------------
		this.geoData = geoData;
		console.log(this.geoData);
		this.geoData.features.forEach(feature => {
			feature.getCasesPerMillion = function(data) {
				let res;
				data.countries.forEach(country => {
					if (country.code === feature.properties.code) {
						res = country.latest_data.calculated.cases_per_million_population;
						console.log(feature.properties.code, res);
					}
				});
				return res ? res : 0;
			};
		});
		this.style = this.style.bind(this);
		this.getColor = this.getColor.bind(this);
		L.geoJSON(geoData, {style: this.style}).addTo(map);
		// this.getColor();
	}

	

	getColor(cases) {
		const casesPerMillion = [];
		this.data.countries.forEach(country => {
			casesPerMillion.push(country.latest_data.calculated.cases_per_million_population);
		});
		const max = Math.max(...casesPerMillion);
		// console.log(cases/max);
		return `rgb(255 165 0 / ${cases*10/max})`;

	}

	style(feature) {
    return {
        fillColor: this.getColor(feature.getCasesPerMillion(this.data)),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
	}
}
 
