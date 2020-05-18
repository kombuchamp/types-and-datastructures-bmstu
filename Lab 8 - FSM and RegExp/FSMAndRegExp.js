const FSM = require('./fsm.js');

const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]\.{0,1})+$/;
const bmstuGroupRegExp = /[А-Я]{1,3}\d-\d{2,3}[БМ]{0,1}(\(В\)){0,1}/;

let fsmData = {
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

console.log(new FSM(fsmData).test('asdfasdf@asd.fasf.ru'));
