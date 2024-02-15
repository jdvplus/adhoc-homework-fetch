import URI from 'urijs';

// /records endpoint
window.path = 'http://localhost:3000/records';

const uri = new URI('http://localhost:3000/records?limit=10&offset=0');

/* notes */

// if options.page === 1, URI should be string + '?limit=10'
// if options.page === 2, URI should be string + '?limit=10&offset=10'
// if options.page === 3, URI should be string + '?limit=10&offset=20'
// ... and so on



const retrieve = async (options) => {
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

    
    return;
  }

  // helper fn: map options to uri
  // input: page (num), colors (array)
  // output: string representing URI to fetch from
  const mapOptionsToURI = (page, colors) => {
    const baseURIString = 'http://localhost:3000/records?limit=10';

    return `${baseURIString}${getPage(page)}`;
  };

  try {
    const res = await fetch(uri);
    const data = await res.json();

    console.log('data', data);

    return data;
  } catch (err) {
    console.log(err);
  }
};

// example:
retrieve({ page: 2, colors: ['red', 'brown'] });

export default retrieve;
