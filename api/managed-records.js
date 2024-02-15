import URI from 'urijs';

// /records endpoint
window.path = 'http://localhost:3000/records';

const uri = new URI(
  'http://localhost:3000/records?limit=10&offset=0&color[]=red'
);

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

const retrieve = async (options) => {
  const baseURIString = 'http://localhost:3000/records?limit=10';

  // helper fn: get page
  // input: page number
  // output: string representing add'l query params
  const getPage = (pageNum) => {
    return `&offset=${pageNum * 10 - 10}`;
  };

  // helper fn: get colors
  // input: array of strings
  // output: string representing add'l query params
  const getColors = (colorsArray) => {
    let colorParams = '';

    for (const color of colorsArray) {
      colorParams += `&color[]=${color}`;
    }

    return colorParams;
  };

  // helper fn: map options to uri
  // input: page (num), colors (array)
  // output: string representing URI to fetch from
  const mapOptionsToURI = (page, colors) => {
    if (!page && !colors) return baseURIString;
    if (!page) return baseURIString + getColors(colors);
    if (!colors) return baseURIString + getPage(page);

    return baseURIString + getPage(page) + getColors(colors);
  };

  try {
    const res = options
      ? await fetch(mapOptionsToURI(options.page, options.colors))
      : await fetch(baseURIString);
    const data = await res.json();

    console.log('data BLUEYELLOW', data);
    console.log('data length', data.length);

    return data;
  } catch (err) {
    console.log('error:', err);
  }
};

// example:
retrieve({ page: 3, colors: ['blue', 'yellow'] });

export default retrieve;
