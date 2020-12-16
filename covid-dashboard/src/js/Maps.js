/* eslint-disable no-undef */

const L_Token = 'pk.eyJ1IjoibmF0cHVrLWVwIiwiYSI6ImNraXJxZHZyNzBwejEydGwzcTg3NXpidG4ifQ.GL9jfvvsWibQh0y7c-Ycdw';
const geoData = require('../assets/countries.json');

export default class Maps {
	constructor() {

		const wrapper = document.querySelector('.main__section_map .main__section-content');
		wrapper.innerHTML = '<div id="map"></div>';

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

		L.geoJSON(geoData).addTo(map);
	}
}
 
