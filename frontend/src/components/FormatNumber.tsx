export const formatNumber = (value: number | undefined): string => {
  if (value === undefined) return "0.00";

  // Check if the number has decimal places
  const isDecimal = value % 1 !== 0;

  return isDecimal ? value.toFixed(1) : value.toString();
};
