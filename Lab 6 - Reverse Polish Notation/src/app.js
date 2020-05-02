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
    try {
        drawGraph();
    } catch (err) {
        alert(err.message);
    }
});

function drawGraph() {
    let a = Number(getFieldValue(form.a.value, form.a.placeholder));
    let b = Number(getFieldValue(form.b.value, form.b.placeholder));
    let h = Number(getFieldValue(form.h.value, form.h.placeholder));
    let expression = getFieldValue(
        form.expression.value,
        form.expression.placeholder.match(/Expression\ \(\ (.*)\ \)/)[1]
    );
    validateValues(a, b, h, expression);

    let data = [];
    let labels = [];
    for (let x = a; x < b; x += h) {
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
    if (h <= 0) {
        throw new Error('Step should be positive integer');
    }
}

function getFieldValue(value, alternativeValue) {
    return value !== '' ? value : alternativeValue;
}
