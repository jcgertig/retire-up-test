import { render } from '@testing-library/react';
import React from 'react';

import App from './App';
import returns from './returns.json';
import { minAndMaxYearFromReturns } from './utils';

const { max, min } = minAndMaxYearFromReturns(returns);

test('renders learn react link', () => {
  const { getByText } = render(
    <App returns={returns} maxYear={max} minYear={min} />
  );
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
