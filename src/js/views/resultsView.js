import icons from 'url:../../img/icons.svg'; //parcel importing picture/${icons} so parcel can use them when bundling
import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _defaultError = 'Something went wrong with your search phrase.';
  _defaultSuccess = 'SuperB! All wet good :D';

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new ResultsView();
