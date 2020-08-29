export interface MinAndMaxYear {
  max: number;
  min: number;
}

export function minAndMaxYearFromReturns(
  returns: Array<ReturnEntry>
): MinAndMaxYear {
  return returns.reduce<MinAndMaxYear>(
    (acc, { year }) => {
      if (year > acc.max) {
        acc.max = year;
      }
      if (year < acc.min) {
        acc.min = year;
      }
      return acc;
    },
    { max: Number.NEGATIVE_INFINITY, min: Number.POSITIVE_INFINITY }
  );
}
