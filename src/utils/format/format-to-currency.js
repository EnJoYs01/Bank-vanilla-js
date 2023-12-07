/**
 * Format number as a string with the specified currency symbol
 * @param {number} number - Number to be convented into currency
 * @returns {string} Formatted number with the currency symbol
 */
export function formatToCurrency(number) {
  return new Intl.NumberFormat('ru-Ru', {
    currency: 'RUB',
    style: 'currency'
  }).format(number);
}
