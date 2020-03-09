import './index.css';
import Chart from 'chart.js';

const standardEven = document.getElementById('standardEven');
const standardUneven = document.getElementById('standardUneven');
const winogradEven = document.getElementById('winogradEven');
const winogradUneven = document.getElementById('winogradUneven');

const standardEvenChart = new Chart(standardEven);
const standardUnevenChart = new Chart(standardUneven);
const winogradEvenChart = new Chart(winogradEven);
const winogradUnevenChart = new Chart(winogradUneven);
