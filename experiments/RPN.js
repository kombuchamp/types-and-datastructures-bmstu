const operations = {
    add: '+',
    sub: '-',
    mul: '*',
    div: '/',
    sin: '@',
    cos: '$',
    openBracket: '(',
    closeBracket: ')',
};
Object.setPrototypeOf(operations, {
    opSigns: null,
    getOperationSigns() {
        return this.opSigns || (opSigns = Object.values(this));
    },
});

const precedence = {
    [operations.sin]: 3,
    [operations.cos]: 3,
    [operations.mul]: 2,
    [operations.div]: 2,
    [operations.add]: 1,
    [operations.sub]: 1,
    // '(' always jumps on top of stack
    // other operators act like its precedence is lower than the bracket's
    [operations.openBracket]: 0,
};

let expression = '2+2';

let input = tokenize(expression);
let rpn = [];
let ops = [];

console.log('TOKENS', input);

// Convert input string to reverse polish notation:
let curOp;
input.forEach((token) => {
    if (!isNaN(token) || token === 'x') {
        // Token is a number
        rpn.push(token);
    } else if (operations.getOperationSigns().includes(token)) {
        // Token is an operator
        if (token === ')') {
            while ((curOp = ops.pop()) !== '(') {
                rpn.push(curOp);
            }
        } else if (!ops.length || token === '(' || precedence[token] >= precedence[ops[ops.length - 1]]) {
            ops.push(token);
        } /* precedence is lower */ else {
            do {
                rpn.push(ops.pop());
            } while (precedence[token] <= precedence[ops[ops.length - 1]]);
            ops.push(token);
        }
    }
});
if (ops.length) rpn = [...rpn, ...ops.slice().reverse()];

console.log('RPN', rpn);

// Evaluate RPN
let operands = [];
let x = 5; // Just assume x is known
rpn.forEach((token) => {
    if (!isNaN(token)) {
        operands.push(Number(token));
    } else if (token === 'x') {
        operands.push(x);
    } else {
        if (token === operations.sin || token === operations.cos) {
            operands.push(evaluate(token, operands.pop()));
        } else {
            operands.push(evaluate(token, operands.pop(), operands.pop()));
        }
    }
});

console.log('RESULT', operands);

/**
 * Splits math expression into tokens
 * Throws if expression has invalid tokens or brackets are in wrong order.
 *
 * I tried to figure out if its possible to parse a math expression using just one regexp
 * but I failed and it ended up here. I wonder how normal people do it.
 */
function tokenize(str) {
    let tokens = str
        .replace(/\s/g, '') // remove spaces
        .replace(/sin/g, operations.sin)
        .replace(/cos/g, operations.cos) // use special symbols for sin/cos operations
        .split(
            new RegExp(
                `(?=[${operations
                    .getOperationSigns()
                    .map((op) => '\\' + op)
                    .join('')}])`
            )
        )
        .flatMap((group, i, self) => {
            if (group.length > 1) {
                let ops = operations.getOperationSigns();
                if (ops.includes(group[0])) {
                    // group starts with operation symbol
                    if (i === 0 || self[i - 1].endsWith('(')) {
                        // Unary + or -
                        // TODO: it might be some other opetator! need to check and thorw
                        return group;
                    }
                    return [group.slice(0, 1), group.slice(1)];
                } else if (ops.includes(group[group.length - 1]))
                    // group ends with op symbol
                    // TODO: not sure if thes situation is possible
                    return [group.slice(0, -1), group.slice(-1)];
            }
            return group;
        });
    // Check if all tokens are valid:
    let bracketBalance = 0;
    tokens.forEach((token) => {
        if (
            !operations.getOperationSigns().includes(token) && // token is not an op symbok
            isNaN(token) && // token is not a valid number
            token !== 'x' // token is not a variable
        ) {
            throw new Error(`Invalid token: ${token}`);
        }
        // Check bracket validity
        if (token === '(') bracketBalance++;
        else if (token == ')') bracketBalance--;
    });
    if (bracketBalance !== 0) throw new Error('Brackets are invalid');

    return tokens;
}

/**
 * Evaluates math operation
 *
 * i.e. a long switch-case
 */
function evaluate(operator, ...args) {
    switch (operator) {
        case operations.sin:
            return Math.sin(args[0]);
        case operations.cos:
            return Math.cos(args[0]);
        case operations.add:
        case operations.sub:
        case operations.div:
        case operations.mul:
            return eval(args[0] + operator + args[1]);
    }
}
