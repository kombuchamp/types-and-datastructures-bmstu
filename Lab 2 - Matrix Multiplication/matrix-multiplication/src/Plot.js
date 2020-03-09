import React from 'react';
import { Chart } from 'react-charts';
import css from './Plot.module.css';

export default function Plot({ data }) {
    return (
        <div className={css.container}>
            <Chart
                data={data}
                axes={[
                    { primary: true, type: 'linear', position: 'bottom' },
                    { type: 'linear', position: 'left' },
                ]}
                tooltip
            />
        </div>
    );
}
