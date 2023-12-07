/**
 * Formats date to the 'MMM DD, YYYY' format
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export function formatToDate(dateString) {
  const date = new Date(dateString);
  const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-Us', formatOptions);
}
