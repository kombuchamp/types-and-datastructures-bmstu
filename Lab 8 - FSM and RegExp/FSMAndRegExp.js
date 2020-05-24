const FSM = require('./fsm.js');

const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]\.{0,1})+$/;
const bmstuGroupRegExp = /[А-Я]{1,3}\d{1,2}-\d{2,3}[БМ]{0,1}(\(В\)){0,1}/;

let fsmEmailData = {
    states: {
        local: {
            check(letter) {
                if (/[a-zA-Z0-9_.-]/.test(letter)) {
                    return 'local';
                }
                if (letter === '@') {
                    return 'domain';
                }
                return false;
            },
        },
        domain: {
            check(letter) {
                if (/[a-zA-Z0-9-]/.test(letter)) {
                    return 'domain';
                }
                if (letter === '.') {
                    return 'awaitFinish';
                }
                if (letter === '') {
                    return true;
                }
                return false;
            },
        },
        awaitFinish: {
            check(letter) {
                if (/[a-zA-Z0-9-]/.test(letter)) {
                    return 'domain';
                }
                return false;
            },
        },
    },
    initialState: 'local',
};

let fsmBmstuGroupData = {
    states: getFsmBmstuGroupData(),
    initialState: 'faculty',
};

function getFsmBmstuGroupData() {
    // Woo, closures
    let facultyCounter = 0;
    let facultyNumberCounter = 1;
    let groupNumberCounter = 0;

    function reset() {
        facultyCounter = 0;
        facultyNumberCounter = 1;
        groupNumberCounter = 0;
    }

    return {
        faculty: {
            check(letter) {
                if (/[А-Я]/.test(letter) && facultyCounter++ < 3) {
                    return 'faculty';
                }
                if (/\d/.test(letter) && facultyCounter > 0) {
                    return 'awaitFacultyNumber';
                }
                reset();
                return false;
            },
        },
        awaitFacultyNumber: {
            check(letter) {
                if (/\d/.test(letter) && facultyNumberCounter++ < 2) {
                    return 'awaitFacultyNumber';
                }
                if (letter === '-') {
                    return 'awaitGroupNumber';
                }
                reset();
                return false;
            },
        },
        awaitGroupNumber: {
            check(letter) {
                if (/\d/.test(letter) && groupNumberCounter++ < 3) {
                    return 'awaitGroupNumber';
                }
                if (letter === '' && groupNumberCounter > 0) {
                    reset();
                    return true;
                }
                if ((letter === 'Б' || letter === 'М') && groupNumberCounter > 0) {
                    return 'awaitFinisher';
                }
                reset();
                return false;
            },
        },
        awaitFinisher: {
            check(letter) {
                if (letter === '') {
                    reset();
                    return true;
                }
                if (letter === '(') {
                    return 'awaitSecondEd';
                }
                reset();
                return false;
            },
        },
        awaitSecondEd: {
            check(letter) {
                if (letter === 'В') {
                    return 'awaitLastBracket';
                }
                reset();
                return false;
            },
        },
        awaitLastBracket: {
            check(letter) {
                if (letter === ')') {
                    return 'awaitEndOfChain';
                }
                reset();
                return false;
            },
        },
        awaitEndOfChain: {
            check(letter) {
                if (letter === '') {
                    reset();
                    return true;
                }
                reset();
                return false;
            },
        },
    };
}

let emailFsm = new FSM(fsmEmailData);
console.assert(emailFsm.test('asdfasdf@asd.fasf.ru') === emailRegExp.test('asdfasdf@asd.fasf.ru'), 1);
console.assert(emailFsm.test('asdfasdf@asd..fasf.ru') === emailRegExp.test('asdfasdf@asd..fasf.ru'), 2);

let bmstuGroupFsm = new FSM(fsmBmstuGroupData);
console.assert(bmstuGroupFsm.test('СМ4-112') === bmstuGroupRegExp.test('СМ4-112'), 3);
console.assert(bmstuGroupFsm.test('ИУ7-78Б(В)') === bmstuGroupRegExp.test('ИУ7-78Б(В)'), 4);
