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
  // console.log('page number failed test', pageNum);
  return `&offset=${pageNum * 10 - 10}`;
};

/**
 * getColors: helper function to generate string representing color query params
 *
 * @param {array} colorsArray - requested colors
 * @return {string} - color query parameters
 */
const getColors = (colorsArray) => {
  const colorsSet = new Set();
  colorsSet.add('red').add('brown').add('blue').add('yellow').add('green');

  let colorParams = '';

  if (!colorsArray.length) return colorParams;

  for (const color of colorsArray) {
    if (colorsSet.has(color)) colorParams += `&color[]=${color}`;
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
  const baseURIString = 'http://localhost:3000/records?limit=10';

  return new URI(baseURIString + getPage(page) + getColors(colors));
};

const retrieve = async (options = { page: 1, colors: [] }) => {
  try {
    const res = await fetch(mapOptionsToURI(options.page, options.colors));
    const data = await res.json();

    console.log('look here! data', data);

    if (!options.page) options.page = 1;

    const payloadObject = {
      ids: [],
      open: [],
      closedPrimaryCount: 0,

      previousPage: options.page && options.page > 1 ? options.page - 1 : null,

      nextPage: options.page && options.page < 50 ? options.page + 1 : null,
    };

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

    console.log('payload object', payloadObject);

    return payloadObject;
  } catch (err) {
    console.log('error:', err);
  }
};

// tests:
// retrieve();
// retrieve({});
// retrieve({ page: 2 });
// retrieve({ colors: ['blue'] });
// retrieve({ page: 3, colors: ['blue', 'brown'] });

export default retrieve;

/* notes/observations */

// PAGINATION
// if options.page === 1, URI should be string + '&offset=0'
// if options.page === 2, URI should be string + '&offset=10'
// if options.page === 3, URI should be string + '&offset=20'
// ... and so on

// COLORS
// if options.colors includes 'red', URI should be string + '&color[]=red'
// if options.colors includes 'red' & 'brown', URI should be string + '&color[]=red&color[]=brown'
// ... and so on
