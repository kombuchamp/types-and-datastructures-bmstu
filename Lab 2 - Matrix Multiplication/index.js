/**
 * Standart multiplication method
 * @param {Array} A - [M x N] matrix
 * @param {Array} B - [N x Q] matrix
 * @returns {Array} C - [M x Q] matrix
 */
function multiplyMatrices(A, B) {
    // Find matrix dimensions
    const M = A.length;
    const N = A[0].length;
    const Q = B[0].length;
    if (B.length !== N) throw new TypeError('Wrong matrix dimensions');

    // Result matrix
    const C = Array.from(new Array(Q), () => []);

    for (let i = 0; i < M; ++i)
        for (let j = 0; j < Q; ++j)
            for (let k = 0; k < N; ++k) {
                C[i][j] = (C[i][j] | 0) + A[i][k] * B[k][j];
            }
    return C;
}

/**
 * Winograd multiplication method
 * @param {Array} A - [M x N] matrix
 * @param {Array} B - [N x Q] matrix
 * @returns {Array} C - [M x Q] matrix
 */
function multiplyMatricesWinograd(A, B) {
    // Find matrix dimensions
    const M = A.length;
    const N = A[0].length;
    const Q = B[0].length;
    if (B.length !== N) throw new TypeError('Wrong matrix dimensions');

    // Result matrix
    const C = Array.from(new Array(Q), () => []);
    // Reusable multiplication values
    const mulH = [];
    for (let i = 0; i < M; ++i)
        for (let k = 1; k < N; k += 2)
            mulH[i] = (mulH[i] | 0) + A[i][k - 1] * A[i][k];
    const mulV = [];
    for (let j = 0; j < Q; ++j)
        for (let k = 1; k < N; k += 2)
            mulV[j] = (mulV[j] | 0) + B[k - 1][j] * B[k][j];

    for (let i = 0; i < M; ++i)
        for (let j = 0; j < Q; ++j) {
            C[i][j] = -mulH[i] - mulV[j];
            for (let k = 1; k < N; k += 2) {
                C[i][j] += (A[i][k - 1] + B[k][j]) * (A[i][k] + B[k - 1][j]);
            }
        }
    return C;
}

const A = [
    [1, 2],
    [3, 4],
    [5, 6],
];
const B = [
    [5, 7, 0],
    [6, 4, 1],
];

console.log(multiplyMatricesWinograd(A, B));
