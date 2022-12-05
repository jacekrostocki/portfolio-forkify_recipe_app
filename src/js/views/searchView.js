import View from './View.js';

class SearchView extends View {
  _parentElement = document.querySelector('.search');

  getSearchPhrase() {
    const query = document.querySelector('.search__field').value;
    document.querySelector('.search__field').value = '';
    return query;
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }
}

export default new SearchView();
