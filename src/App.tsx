import './App.css';

import { AgGridReact } from 'ag-grid-react';
import React, { useReducer } from 'react';

interface ReturnEntryWithCumulativeReturns extends ReturnEntry {
  cumulativeReturns: number;
}

type YearValue = number | null;

interface AppProps {
  returns: Array<ReturnEntry>;
  maxYear: YearValue;
  minYear: YearValue;
}

function assignCumulativeReturns(
  val: Array<ReturnEntry>,
  minYear: YearValue,
  maxYear: YearValue
) {
  console.log(
    val.sort((a, b) => a.year - b.year),
    minYear,
    maxYear
  );
  return val.sort((a, b) => a.year - b.year);
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
    case 'setMinYear':
      return {
        ...state,
        rows: assignCumulativeReturns(
          state.returns,
          action.payload,
          state.maxYear
        ),
        minYear: action.payload
      };
    case 'setMaxYear':
      return {
        ...state,
        rows: assignCumulativeReturns(
          state.returns,
          state.minYear,
          action.payload
        ),
        maxYear: action.payload
      };
    default:
      throw new Error('No such action available');
  }
}

const App: React.FC<AppProps> = function App({ returns, maxYear, minYear }) {
  const [state] = useReducer(
    reducer,
    { returns, maxYear, minYear },
    initReducer
  );
  return (
    <div>
      <div
        className="ag-theme-balham"
        style={{
          position: 'relative',
          width: '100%',
          height: '500px'
        }}
      >
        <AgGridReact
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true
          }}
          columnDefs={[{ field: 'year' }, { field: 'totalReturn' }]}
          rowData={state.rows}
        />
      </div>
    </div>
  );
};

export default App;
