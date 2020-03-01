class SparseMatrix {
    constructor(matrix) {
        this.matrix = {
            AN: [],
            NR: [],
            NC: [],
            JR: [],
            JC: [],
        };
        if (matrix) {
            this.pack(matrix);
        }
    }

    pack(matrix) {
        const { AN, NR, NC, JR, JC } = this.matrix;
        const rows = matrix.length;
        const cols = matrix[0].length;
        matrix.forEach((row, i) => {
            let jr = undefined;
            let nr = [];
            row.forEach((item, j) => {
                if (item === 0) return;
                const idx = i * cols + j;
                AN.push(item);
                nr.push(AN.length - 1);
                if (jr == null) jr = AN.length - 1;
            });
            JR.push(jr == null ? JR[JR.length - 1] | 0 : jr);
            if (nr.length) nr.push(nr.shift());
            NR.push(...nr);
        });
    }

    toString() {
        return Object.entries(this.matrix)
            .map(([key, arr]) => `${key}: [${arr}]`)
            .join('\n\r');
    }
}

const mat = new SparseMatrix([
    [1, 0, 2],
    [0, 0, 0],
    [0, 4, 2],
]);

console.log(mat.toString());
