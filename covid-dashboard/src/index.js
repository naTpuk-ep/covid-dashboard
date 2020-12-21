/* eslint-disable no-unused-vars */
import './index.scss';
import getData from './js/getData.js';
import APIUrls from './js/APIUrls.js';
import Main from './js/Main';
import Table from './js/Table';
import List from './js/List';
import Maps from './js/Maps';
import Graph from './js/Graph';

async function render() {
  getData(APIUrls)
    .then((res) => {
      console.log(res); // ->  pull the data
      const maps = new Maps(res);
    })
    .catch((e) => {
      console.error(e);
    });
}

render();