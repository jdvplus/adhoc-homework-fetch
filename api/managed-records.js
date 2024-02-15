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
const mapOptionsToURI = (page, colors) => {
  const baseURIString = 'http://localhost:3000/records?limit=10';

  if (!page && !colors) return new URI(baseURIString);
  if (!page) return new URI(baseURIString + getColors(colors));
  if (!colors) return new URI(baseURIString + getPage(page));

  return new URI(baseURIString + getPage(page) + getColors(colors));
};

const retrieve = async (options = { page: 1, colors: [] }) => {
  try {
    const res = options
      ? await fetch(mapOptionsToURI(options.page, options.colors))
      : await fetch(new URI('http://localhost:3000/records?limit=10'));
    const data = await res.json();

    console.log('look here! data', data);

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
// retrieve({ page: 3, colors: ['blue', 'brown'] });
// retrieve();

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
