import URI from 'urijs';

// records endpoint
window.path = 'http://localhost:3000/records';

/**
 * getPage: helper function to generate string representing page query params
 *
 * @param {number} pageNum - requested page number
 * @return {string} - page query parameters
 */
const getPage = (pageNum) => {
  return `&offset=${pageNum * 10 - 10}`;
};

/**
 * getColors: helper function to generate string representing color query params
 *
 * @param {array} colorsArray - requested colors
 * @return {string} - color query parameters
 */
const getColors = (colorsArray) => {
  let colorParams = '';

  if (!colorsArray.length) return colorParams;

  for (const color of colorsArray) {
    colorParams += `&color[]=${color}`;
  }

  return colorParams;
};

/**
 * mapOptionsToURI: helper function to produce full URI string for fetch request
 *
 * @param {number} page - requested page number
 * @param {array} colors - requested colors
 * @return {string} - full URI string to fetch data from within main function
 */
const mapOptionsToURI = (page = 1, colors = []) => {
  const baseURIString = `${window.path}?limit=10`;

  return new URI(baseURIString + getPage(page) + getColors(colors));
};

/**
 * retrieve: main function; fetches data from 'records' API
 *
 * @param {object} options - object representing page & color queries
 * @return {object} - fetched payload transformed into object
 */
const retrieve = async (options = { page: 1, colors: [] }) => {
  let { page, colors } = options;
  if (!page) page = 1;

  try {
    const res = await fetch(mapOptionsToURI(page, colors));
    const data = await res.json();

    // console.log('data', data);

    const payloadObject = {
      ids: [],
      open: [],
      closedPrimaryCount: 0,
      previousPage: page && page > 1 ? page - 1 : null,
      nextPage: page && page < 50 ? page + 1 : null,
    };

    if (data.length < 10) payloadObject.nextPage = null;

    for (const item of data) {
      const { ids, open } = payloadObject;

      ids.push(item.id);

      if (item.disposition === 'open') open.push(item);

      if (
        item.color === 'red' ||
        item.color === 'blue' ||
        item.color === 'yellow'
      )
        item.isPrimary = true;
      else item.isPrimary = false;

      if (item.disposition === 'closed' && item.isPrimary)
        payloadObject.closedPrimaryCount += 1;
    }

    // console.log('payload object', payloadObject);

    return payloadObject;
  } catch (err) {
    console.log('error:', err);
  }
};

export default retrieve;
