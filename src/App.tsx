import './App.css';

import { AgGridReact } from 'ag-grid-react';
import { Slider } from 'antd';
import React, { useReducer } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface ReturnEntryWithCumulativeReturns extends ReturnEntry {
  cumulativeReturns: number;
}

interface AppProps {
  returns: Array<ReturnEntry>;
  maxYear: number;
  minYear: number;
}

function assignCumulativeReturns(
  val: Array<ReturnEntry>,
  minYear: number,
  maxYear: number
) {
  const sorted: Array<ReturnEntryWithCumulativeReturns> = val
    .filter((i) => i.year >= minYear && i.year <= maxYear)
    .sort((a, b) => a.year - b.year) as any;
  for (let idx = 0; idx < sorted.length; idx += 1) {
    const entry = sorted[idx];
    const totalReturn = parseFloat(entry.totalReturn);
    sorted[idx] = {
      ...entry,
      cumulativeReturns:
        idx === 0
          ? totalReturn
          : sorted[idx - 1].cumulativeReturns + totalReturn
    };
  }
  return sorted;
}

function initReducer({ returns, minYear, maxYear }) {
  return {
    returns,
    minYear,
    maxYear,
    rows: assignCumulativeReturns(returns, minYear, maxYear)
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'setYears':
      return {
        ...state,
        rows: assignCumulativeReturns(
          state.returns,
          action.payload[0],
          action.payload[1]
        ),
        minYear: action.payload[0],
        maxYear: action.payload[1]
      };
    default:
      throw new Error('No such action available');
  }
}

const App: React.FC<AppProps> = function App({ returns, maxYear, minYear }) {
  const [state, dispatch] = useReducer(
    reducer,
    { returns, maxYear, minYear },
    initReducer
  );
  const [handleChange] = useDebouncedCallback((payload) => {
    dispatch({ type: 'setYears', payload });
  }, 200);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div>
        <Slider
          range
          min={minYear}
          max={maxYear}
          onChange={handleChange}
          defaultValue={[minYear, maxYear]}
        />
      </div>
      <div style={{ flex: 1 }}>
        <div
          className="ag-theme-balham"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          <AgGridReact
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
            columnDefs={[
              { field: 'year', sort: 'ASC' },
              {
                field: 'totalReturn',
                valueFormatter: ({ value }) =>
                  parseFloat(value).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
              },
              {
                field: 'cumulativeReturns',
                valueFormatter: ({ value }) =>
                  value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
              }
            ]}
            rowData={state.rows}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(App);
