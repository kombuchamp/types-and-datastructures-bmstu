const {
    multiplyMatrices,
    multiplyMatricesWinograd,
    profileMatrixMultiplication,
} = require('./index.js');

const A = [
    [1, 2],
    [3, 4],
    [5, 6],
];
const B = [
    [5, 7, 0],
    [6, 4, 1],
];
const C = [
    [17, 15, 2],
    [39, 37, 4],
    [61, 59, 6],
];

test('multiplyMatrices should multiply matrices', () => {
    expect(multiplyMatrices(A, B)).toEqual(C);
});

test('multiplyMatricesWinograd should multiply matrices', () => {
    expect(multiplyMatricesWinograd(A, B)).toEqual(C);
});

test('multiplyMatrices and multiplyMatricesWinograd should multiply matrices and return the same result', () => {
    expect(multiplyMatricesWinograd(A, B)).toEqual(multiplyMatrices(A, B));
});
