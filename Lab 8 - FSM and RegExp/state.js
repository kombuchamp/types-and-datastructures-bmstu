/**
 * Class representing state of FSM
 * @interface
 */
class State {
    /**
     * Function that checks the letter for validity.
     * If automaton successfully reached the end, return true
     * If automaton stuck (incorrect letter), return false
     * Otherwise return the next state of the automaton
     *
     * Empty string as a letter represents an end of chain
     * @param {string} letter
     */
    check(letter) {
        throw new Error('not implemented');
    }
}

module.exports = State;
