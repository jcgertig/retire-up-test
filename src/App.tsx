import './App.css';

import { InfoCircleOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { Layout, Popover, Slider } from 'antd';
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
    <Layout style={{ height: '100vh' }}>
      <Layout.Header>
        <h1
          style={{
            color: 'white',
            textAlign: 'center'
          }}
        >
          S&P 500 {state.minYear} - {state.maxYear} Returns
        </h1>
      </Layout.Header>
      <Layout.Content
        style={{
          padding: 10,
          paddingBottom: 15,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ paddingBottom: 10, position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: 12
            }}
          >
            <span>{minYear}</span>
            <span>{maxYear}</span>
          </div>
          <Slider
            range
            min={minYear}
            max={maxYear}
            onChange={handleChange}
            defaultValue={[minYear, maxYear]}
          />
          <div style={{ position: 'absolute', right: -20, bottom: 15 }}>
            <Popover content="Change the range to filter to the desired years">
              <InfoCircleOutlined style={{ cursor: 'help' }} />
            </Popover>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            className="ag-theme-material"
            style={{
              position: 'relative',
              width: '600px',
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
                    }),
                  cellClassRules: {
                    'negative-value': ({ value }) => parseFloat(value) < 0
                  }
                },
                {
                  field: 'cumulativeReturns',
                  valueFormatter: ({ value }) =>
                    value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }),
                  cellClassRules: {
                    'negative-value': ({ value }) => value < 0
                  }
                }
              ]}
              rowData={state.rows}
            />
          </div>
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default React.memo(App);
