export interface MinAndMaxYear {
  max: null | number;
  min: null | number;
}

export function minAndMaxYearFromReturns(
  returns: Array<ReturnEntry>
): MinAndMaxYear {
  return returns.reduce<MinAndMaxYear>(
    (acc, { year }) => {
      if (acc.max === null || year > acc.max) {
        acc.max = year;
      }
      if (acc.min === null || year < acc.min) {
        acc.min = year;
      }
      return acc;
    },
    { max: null, min: null }
  );
}
