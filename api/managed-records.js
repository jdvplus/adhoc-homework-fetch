import URI from 'urijs';

// /records endpoint
window.path = 'http://localhost:3000/records';

const uri = new URI('http://localhost:3000/records?limit=10&offset=10');

const retrieve = async (options) => {
  // if options.page === 1, URI should be string + '?limit=10'
  // if options.page === 2, URI should be string + '?limit=10&offset=10'
  // if options.page === 3, URI should be string + '?limit=10&offset=20'
  // ... and so on

  // helper: map options to uri
  // input: page, colors
  // output: string representing URI
  const mapOptionsToURI = () => {

  }


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
retrieve({ page: 2, colors: ["red", "brown"] })

export default retrieve;
