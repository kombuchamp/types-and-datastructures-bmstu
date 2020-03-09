import React from 'react';
import css from './App.module.css';
import Plot from './Plot';
import {
    multiplyMatrices,
    multiplyMatricesWinograd,
    profileMatrixMultiplication,
} from './util/index';

function App() {
    const matrixRankRef = React.useRef();
    const maxExperimentsRef = React.useRef();

    const [inProgress, setInProgress] = React.useState(false);
    const [results, setResults] = React.useState([]);

    React.useEffect(() => {
        if (inProgress) {
            setTimeout(() => {
                const rank = matrixRankRef.current.value;
                const maxExperiments =
                    (((maxExperimentsRef.current.value | 0) / 100) | 0) * 100;
                const standardEvenResults = conductExperiment(
                    rank,
                    100,
                    maxExperiments,
                    multiplyMatrices
                );
                const standardOddResults = conductExperiment(
                    rank,
                    101,
                    maxExperiments + 1,
                    multiplyMatrices
                );
                const winogradEvenResults = conductExperiment(
                    rank,
                    100,
                    maxExperiments,
                    multiplyMatricesWinograd
                );
                const winogradOddResults = conductExperiment(
                    rank,
                    101,
                    maxExperiments + 1,
                    multiplyMatricesWinograd
                );
                setResults([
                    {
                        label: 'standardEvenResults',
                        data: standardEvenResults,
                    },
                    {
                        label: 'standardOddResults',
                        data: standardOddResults,
                    },
                    {
                        label: 'winogradEvenResults',
                        data: winogradEvenResults,
                    },
                    {
                        label: 'winogradOddResults',
                        data: winogradOddResults,
                    },
                ]);
                setInProgress(false);
            }, 50);
        }
    }, [inProgress]);
    console.log('>>', results);
    return (
        <div className={css.container}>
            <aside className={css.sideBar}>
                {inProgress ? (
                    '...'
                ) : (
                    <button onClick={e => setInProgress(true)}>
                        Conduct experiment
                    </button>
                )}
                <div className={css.setting}>
                    <label>Matrix rank</label>
                    <input defaultValue={10} ref={matrixRankRef} />
                </div>
                <div className={css.setting}>
                    <label>Max. number of experiments</label>
                    <input defaultValue={1000} ref={maxExperimentsRef} />
                </div>
            </aside>
            <main className={css.content}>
                {inProgress ? '...' : <Plot data={results} />}
            </main>
        </div>
    );
}

function conductExperiment(rank, from, to, method) {
    const results = [];
    for (let i = from; i < to; i += 100) {
        results.push([
            i,
            profileMatrixMultiplication(method, {
                rows: rank,
                cols: rank,
            }),
        ]);
    }
    return results;
}

export default App;
