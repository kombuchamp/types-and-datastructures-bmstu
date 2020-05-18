/**
 * Final state machine
 */
class FSM {
    constructor({ states, initialState }) {
        this.states = states;
        this.start = states[initialState] || states[0];
    }

    /**
     * Tests a chain against fsm
     * @param {string|string[]} chain -- sequence of symbols to test against an automaton
     */
    test(chain) {
        chain = [...chain, ''];
        let state = this.start;
        for (let letter of chain) {
            let checkResult = state.check(letter);
            if (typeof checkResult === 'boolean') {
                return checkResult;
            }
            state = this.states[checkResult];
        }
        return false;
    }
}

module.exports = FSM;
