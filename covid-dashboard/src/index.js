/* eslint-disable no-unused-vars */
import './index.scss';
import getData from './js/getData.js';
import APIUrls from './js/APIUrls.js';
import Main from './js/Main';
import List from './js/List';
import Maps from './js/Maps';
import { initGraph } from './js/Graph';
import { initTable } from './js/Table';

async function render() {
  getData(APIUrls)
    .then((data) => {
      console.log(data);
      new Maps(data);
      new List(data);
      initTable(data);
      initGraph(data);
    })
    .catch((e) => {
      console.error(e);
    });
}

render();
