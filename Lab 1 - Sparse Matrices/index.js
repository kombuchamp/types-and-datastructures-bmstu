/**
 * Sparce matrix in compressed row format
 */
class CRS {
    constructor(matrix) {
        /**
         * Non-zero values
         * @type {Array<number>}
         */
        this.values;
        /**
         * Column of the corresponding value
         * @type {Array<number>}
         */
        this.columnIndex;
        /**
         * Index of the first value (of this.values) in the row
         * @type {Array<number>}
         */
        this.rowIndex;

        this.rows = 0;
        this.columns = 0;

        if (matrix) {
            this.consumeMatrix(matrix);
        }
    }

    /**
     * Transforms matrix into compressed row format and saves it in this instance
     * @param {number[][]} mat
     */
    consumeMatrix(mat) {
        this.values = [];
        this.columnIndex = [];
        this.rowIndex = [];

        this.rows = mat.length;
        this.columns = mat[0].length;

        let currentFirstValue = -1;
        let currentRow = 0;
        mat.forEach((row, i) => {
            row.forEach((val, j) => {
                // assume we have integers
                if (val !== 0) {
                    this.values.push(val);
                    this.columnIndex.push(j);
                    if (currentFirstValue < 0) {
                        currentFirstValue = this.values.length - 1;
                    }
                }
            });
            if (~currentFirstValue) {
                while (currentRow <= i) {
                    this.rowIndex.push(currentFirstValue);
                    ++currentRow;
                }
            }
            currentFirstValue = -1;
        });
        this.rowIndex.push(this.values.length);
    }

    toDenseMatrix() {
        let result = [...Array(this.rows)].map(() => Array(this.columns).fill(0));
        for (let i = 0; i < this.rows; ++i) {
            let start = this.rowIndex[i];
            let end = this.rowIndex[i + 1];
            for (let idx = start; idx < end; ++idx) {
                result[i][this.columnIndex[idx]] = this.values[idx];
            }
        }
        return result;
    }
}

// console.log(
//     '----\n',
//     new CRS([
//         [0, 0, 0, 0],
//         [5, 8, 0, 0],
//         [0, 0, 3, 0],
//         [0, 6, 0, 0],
//     ])
// );

console.log(
    '----\n',
    new CRS([
        [0, 0, 1, 3, 0, 0, 0, 5, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 7, 0, 1, 0, 0],
    ])
);

// console.log(
//     '----\n',
//     new CRS([
//         [1, 0, 0, 0, 2, 0],
//         [0, 0, 3, 4, 0, 0],
//         [0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 8, 0, 5],
//         [0, 0, 0, 0, 0, 0],
//         [0, 7, 1, 0, 0, 6],
//     ])
// );
