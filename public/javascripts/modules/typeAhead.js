const axios = require('axios');

function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}/" class="search__result">
        <strong>${store.name}</strong>
      </a>
    `;
  }).join('');
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');
  
  searchInput.on('input', function() {
    //if there is no value, quit it !
    if (!this.value) {
     searchResults.style.display = 'none';
     return; //stop!
    } 

    //show the search results results
    searchResults.style.display = 'block';

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if(res.data.length) {
          // const html = searchResultsHTML(res.data);
          searchResults.innerHTML = searchResultsHTML(res.data);
        }
      })
      .catch(err => {
        console.error(err);
        
      });
  });
  // handle keyboard inputs
  searchInput.on('keyup', (e) => {
    //console.log(e.keyCode);
    if (![38, 40, 13].includes(e.keyCode)){
      return; //
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector
  });
}

export default typeAhead;
