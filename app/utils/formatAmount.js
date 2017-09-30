// @flow

export type FormattedAmount = {
  text: string,
  isNegative: boolean,
};

export default function formatAmount(amount: number, showSign: boolean = true, format = null): FormattedAmount {
  const isNegative = amount < 0;
  let formatValue;

  if ( format === "percentage" ) {
    let valueForFormat = amount / 100;
    formatValue = Math.abs(valueForFormat).toLocaleString('en-us', {
      style: 'percent',
    });
  } else {
    formatValue = Math.abs(amount).toLocaleString('en-us', {
      style: 'currency',
      currency: 'USD',
    });
  }

  return {
    text: `${isNegative && showSign ? '-' : ''}${formatValue}`,
    isNegative,
  };
}
