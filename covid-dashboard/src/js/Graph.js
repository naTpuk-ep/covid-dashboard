import { attributes, worldPop } from './Table';

const { getTimeline } = require('./API');
const Chart = require('chart.js');
const colors = [
  'yellow',
  'red',
  'green',
  'orange',
  'tomato',
  'lightgreen',
];
let index = 0;

function initGraphMarkup() {
  const graphSection = document.querySelector('.main__section_graph');
  const graphContent = document.createElement('div');
  const graph = document.createElement('canvas');
  const buttonsBlock = document.createElement('div');
  const buttonNext = document.createElement('button');
  const buttonPrev = document.createElement('button');

  buttonNext.classList.add('btn-next');
  buttonPrev.classList.add('btn-prev');
  graph.classList.add('graph');
  buttonsBlock.classList.add('buttons_block');
  graphContent.classList.add('main__content', 'main__content_graph');

  buttonNext.innerHTML = '>';
  buttonPrev.innerHTML = '<';

  buttonsBlock.append(buttonPrev, buttonNext);
  graphContent.append(graph, buttonsBlock);
  graphSection.append(graphContent);
}

async function initGraph() {
  const globalDataTimeline = await getTimeline().then((result) =>
    result
      .map((el) => el.date)
      .reverse()
      .filter((e, i) => i % 10 === 0),
  );
  const chartConfig = {
    type: 'line',
    data: {
      labels: globalDataTimeline,
      datasets: [],
    },
    options: {
      title: {
        display: true,
        text: 'Comparison of results',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  };
  const ctx = document.querySelector('.graph').getContext('2d');
  const chart = new Chart(ctx, chartConfig);
  const buttonPrev = document.querySelector('.btn-prev');
  const buttonNext = document.querySelector('.btn-next');

  async function addUserToChart(config) {
    let mainData = await getTimeline().then((result) =>
      result
        .map((el) => {
          switch (index) {
            case 0:
              return el.confirmed;
              break;
            case 1:
              return el.deaths;
              break;
            case 2:
              return el.recovered;
              break;
            case 3:
              return ((el.confirmed / worldPop) * 100000).toFixed(1);
              break;
            case 4:
              return ((el.deaths / worldPop) * 100000).toFixed(1);
              break;
            case 5:
              return ((el.recovered / worldPop) * 100000).toFixed(1);
              break;
            default:
              return el.confirmed;
              break;
          }
        })
        .reverse()
        .filter((e, i) => i % 10 === 0),
    );

    const newUser = {
      label: attributes[index],
      data: mainData,
      backgroundColor: colors[index],
      borderColor: colors[index],
      borderWidth: 2,
      fill: false,
    };

    config.data.datasets.pop();
    config.data.datasets.push(newUser);
    chart.update();
  }

  addUserToChart(chartConfig);

  buttonPrev.addEventListener('click', () => {
    index === 0 ? (index = colors.length - 1) : index--;
    addUserToChart(chartConfig, 'confirmed');
  });

  buttonNext.addEventListener('click', () => {
    index === colors.length - 1 ? (index = 0) : index++;
    addUserToChart(chartConfig, 'confirmed');
  });
}

initGraphMarkup();
initGraph();
