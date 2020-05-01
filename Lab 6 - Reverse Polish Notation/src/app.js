import './app.css';
import { evalExpression } from './util/rpn';
const Chart = require('chart.js');

// Create chart
let ctx = document.getElementById('myChart').getContext('2d');

let chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                label: '-',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
            },
        ],
    },

    // Configuration options go here
    options: {
        scales: {
            xAxes: [
                {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'x',
                    },
                },
            ],
            yAxes: [
                {
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'y',
                    },
                },
            ],
        },
    },
});

// Draw initial graph
window.addEventListener('load', drawGraph);

// Add control handlers
const form = document.getElementById('controls-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    drawGraph();
});

function drawGraph() {
    let a = Number(getFieldValue(form.a.value, form.a.placeholder));
    let b = Number(getFieldValue(form.b.value, form.b.placeholder));
    let h = Number(getFieldValue(form.h.value, form.h.placeholder));
    let expression = getFieldValue(
        form.expression.value,
        form.expression.placeholder.match(/Expression\ \(\ (.*)\ \)/)[1]
    );
    let data = [];
    let labels = [];
    try {
        validateValues(a, b, h, expression);
    } catch (err) {
        alert(err.message);
    }
    for (let x = a; x < b; ++x) {
        data.push({
            x,
            y: evalExpression(expression, x),
        });
        labels.push(x);
    }

    console.log('evaluation result: ');
    console.table(data);

    chart.data.datasets[0].data = data;
    chart.data.labels = labels;
    chart.update();
}

function validateValues(a, b, h, expression) {
    if (isNaN(a) || isNaN(b) || isNaN(h)) {
        throw new Error('one of number fields is NaN. How did you do it?');
    }
    if (a >= b) {
        throw new Error('Right boundary should be heigher than the left one');
    }
    // I dont check for h validity, screw it
}

function getFieldValue(value, alternativeValue) {
    return value !== '' ? value : alternativeValue;
}
